export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
  meowOnly: boolean;
  model: string;
}

export interface AppSettings {
  purrSound: boolean;
  compactMode: boolean;
  defaultModel: string;
  defaultMeowOnly: boolean;
  catAgentMode: boolean;  // NEW: Use local cat agent instead of API
  catPersonality: "lazy" | "sassy" | "helpful" | "chaotic" | "philosopher" | "meow-only";
}

export const ALLOWED_MODELS = [
  { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
  { id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
  { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
] as const;

export const DEFAULT_SETTINGS: AppSettings = {
  purrSound: false,
  compactMode: false,
  defaultModel: "claude-3-5-sonnet-20241022",
  defaultMeowOnly: false,
  catAgentMode: true,  // Default to FREE cat agent!
  catPersonality: "lazy",
};

export const SYSTEM_PROMPT = `You are CatGPT, an affectionate, helpful assistant with cat-like personality.
Be concise and useful. Sprinkle subtle cat mannerisms. Avoid copyrighted brand styling or claims.`;
