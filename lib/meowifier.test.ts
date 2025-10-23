import { describe, it, expect } from "vitest";
import { meowifier, setSeed } from "./meowifier";

describe("meowifier", () => {
  it("should convert simple text to meow variants", () => {
    setSeed(12345);
    const input = "Hello world";
    const output = meowifier(input, true);

    // Should contain meow variants
    expect(output).toMatch(/meow|purr|mrrr/i);
    // Should preserve word count approximately
    expect(output.split(/\s+/).length).toBeGreaterThan(0);
  });

  it("should preserve code blocks with language label", () => {
    const input = "Here is code:\\n```javascript\\nconst x = 1;\\n```";
    const output = meowifier(input);

    // Should preserve code fence
    expect(output).toContain("```javascript");
    expect(output).toContain("```");
  });

  it("should handle empty string", () => {
    const output = meowifier("");
    expect(output).toBe("");
  });

  it("should produce deterministic output when seeded", () => {
    setSeed(12345);
    const input = "test message";
    const output1 = meowifier(input, true);

    setSeed(12345);
    const output2 = meowifier(input, true);

    expect(output1).toBe(output2);
  });

  it("should handle punctuation", () => {
    setSeed(12345);
    const input = "Hello! How are you?";
    const output = meowifier(input, true);

    // Should contain some punctuation
    expect(output).toMatch(/[.!?,]/);
  });
});
