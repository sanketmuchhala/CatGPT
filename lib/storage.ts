import { Chat, AppSettings, DEFAULT_SETTINGS } from "./types";

const STORAGE_KEY = "catgpt:v1:convos";
const SETTINGS_KEY = "catgpt:v1:settings";
const MAX_CHATS = 50;

export function loadChats(): Chat[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load chats:", error);
    return [];
  }
}

export function saveChats(chats: Chat[]): void {
  if (typeof window === "undefined") return;
  try {
    // Keep only the most recent MAX_CHATS
    const sorted = [...chats].sort((a, b) => b.createdAt - a.createdAt);
    const limited = sorted.slice(0, MAX_CHATS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error("Failed to save chats:", error);
  }
}

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (error) {
    console.error("Failed to load settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
}

export function generateChatTitle(firstMessage: string): string {
  const words = firstMessage.split(/\s+/).slice(0, 10);
  const title = words.join(" ");
  return title.length > 60 ? title.slice(0, 60) + "..." : title;
}
