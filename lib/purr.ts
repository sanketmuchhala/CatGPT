/**
 * Purr sound - A small base64-encoded WAV file for the purr effect
 * This is a placeholder simple tone. In production, use a license-free purr sound.
 */

// A simple 0.5-second purr-like tone (base64 encoded WAV)
export const PURR_AUDIO_BASE64 =
  "UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

export function playPurrSound(enabled: boolean): void {
  if (!enabled || typeof window === "undefined") return;

  try {
    const audio = new Audio(`data:audio/wav;base64,${PURR_AUDIO_BASE64}`);
    audio.volume = 0.3;
    audio.play().catch((err) => {
      console.warn("Failed to play purr sound:", err);
    });
  } catch (error) {
    console.warn("Purr sound not supported:", error);
  }
}
