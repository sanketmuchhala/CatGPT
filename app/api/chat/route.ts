import { getCatResponse } from "@/lib/cat-agent";
import type { CatMode } from "@/lib/cat-agent";
import { meowifier } from "@/lib/meowifier";

export const runtime = "edge";

// Simple in-memory rate limiter (token bucket)
const rateLimits = new Map<string, { tokens: number; lastRefill: number }>();
const RATE_LIMIT_TOKENS = 10;
const REFILL_RATE = 1000; // 1 token per second

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  let bucket = rateLimits.get(ip);

  if (!bucket) {
    bucket = { tokens: RATE_LIMIT_TOKENS, lastRefill: now };
    rateLimits.set(ip, bucket);
  }

  // Refill tokens based on time elapsed
  const elapsed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor(elapsed / REFILL_RATE);
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(RATE_LIMIT_TOKENS, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  // Check if we have tokens
  if (bucket.tokens > 0) {
    bucket.tokens--;
    return true;
  }

  return false;
}

// Helper to create streaming response
function createStreamingResponse(text: string) {
  const encoder = new TextEncoder();
  let index = 0;

  const stream = new ReadableStream({
    async start(controller) {
      // Stream character by character with small delay for effect
      while (index < text.length) {
        const chunk = text[index];
        controller.enqueue(encoder.encode(chunk));
        index++;
        // Small delay to simulate streaming (5ms per character)
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function POST(req: Request) {
  try {
    // Get IP for rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return new Response("Rate limit exceeded. Please try again later.", {
        status: 429,
      });
    }

    const { messages, catPersonality, meowOnly } = await req.json();

    // Get the last user message
    const lastUserMessage = messages
      .filter((m: any) => m.role === "user")
      .pop();

    if (!lastUserMessage) {
      return new Response("No user message found", { status: 400 });
    }

    // Determine cat personality mode
    let mode: CatMode = (catPersonality as CatMode) || "lazy";

    // If meowOnly is enabled, override to meow-only mode
    if (meowOnly) {
      mode = "meow-only";
    }

    // Get cat response using local agent (no API calls!)
    const catResponse = getCatResponse(lastUserMessage.content, mode);

    let responseText = catResponse.content;

    // If meowOnly mode is enabled via settings (not personality), meowify the response
    if (meowOnly && mode !== "meow-only") {
      responseText = meowifier(responseText);
    }

    // Stream the response
    return createStreamingResponse(responseText);
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
