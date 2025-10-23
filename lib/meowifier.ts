/**
 * Meowifier - Transforms text into cat language
 *
 * Allowed tokens: ["meow", "meoww", "meowww", "meowwww", "meowwwww", "purr", "prrr", "mrrr"]
 *
 * Algorithm:
 * - Split on whitespace
 * - For each token, pick a meow variant based on word length
 * - Randomly append ~ or ... about 10% of the time
 * - Preserve code fences and their language labels
 */

const MEOW_TOKENS = [
  "meow",
  "meoww",
  "meowww",
  "meowwww",
  "meowwwww",
  "purr",
  "prrr",
  "mrrr",
];

// Seeded random for deterministic testing
let seed = 12345;
function seededRandom(): number {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

export function setSeed(newSeed: number) {
  seed = newSeed;
}

export function meowifier(message: string, useSeed = false): string {
  const random = useSeed ? seededRandom : Math.random;

  // Check if message contains code blocks
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const hasCodeBlocks = codeBlockRegex.test(message);

  if (hasCodeBlocks) {
    // Process code blocks separately
    return message.replace(codeBlockRegex, (match, language, code) => {
      const lines = code.split("\n");
      const meowedLines = lines.map((line: string) => {
        if (line.trim() === "") return "";
        const meowCount = Math.max(1, Math.floor(line.length / 8));
        return Array(meowCount)
          .fill(0)
          .map(() => pickMeowToken(line.length, random))
          .join(" ");
      });
      return "```" + language + "\n" + meowedLines.join("\n") + "\n```";
    });
  }

  // Regular text processing
  const tokens = message.split(/(\s+)/);
  const result: string[] = [];

  for (const token of tokens) {
    // Preserve whitespace
    if (/^\s+$/.test(token)) {
      result.push(token);
      continue;
    }

    // Skip empty tokens
    if (token.length === 0) {
      continue;
    }

    // Convert word to meow variant
    let meowToken = pickMeowToken(token.length, random);

    // Add random punctuation (~10% chance each)
    if (random() < 0.1) {
      meowToken += "~";
    }
    if (random() < 0.1) {
      meowToken += "...";
    }

    // Preserve some original punctuation
    const lastChar = token[token.length - 1];
    if (['.', '!', '?', ','].includes(lastChar)) {
      meowToken += lastChar;
    }

    result.push(meowToken);
  }

  return result.join("");
}

function pickMeowToken(wordLength: number, random: () => number): string {
  // Map word length to meow token index with jitter
  const baseIndex = Math.min(
    MEOW_TOKENS.length - 1,
    Math.floor(wordLength / 4)
  );
  const jitter = Math.floor(random() * 3) - 1; // -1, 0, or 1
  const index = Math.max(0, Math.min(MEOW_TOKENS.length - 1, baseIndex + jitter));
  return MEOW_TOKENS[index];
}

/**
 * Transform stream chunk with meowifier
 */
export function meowifyChunk(chunk: string): string {
  return meowifier(chunk);
}
