import { describe, expect, it } from "vitest";

import { DEFAULT_MODEL, readEnv } from "@/lib/env";

describe("readEnv", () => {
  it("stays local when no key is set", () => {
    expect(readEnv({})).toEqual({
      mode: "local",
      openaiApiKey: undefined,
      openaiModel: DEFAULT_MODEL,
    });
  });

  it("treats a blank key as absent", () => {
    expect(readEnv({ OPENAI_API_KEY: "  " }).mode).toBe("local");
  });

  it("drops the key when the demo flag forces the local path", () => {
    expect(readEnv({ OPENAI_API_KEY: "sk-test", DEMO: "true" })).toEqual({
      mode: "local",
      openaiApiKey: undefined,
      openaiModel: DEFAULT_MODEL,
    });
  });

  it("goes live only with a key and the demo flag off", () => {
    expect(readEnv({ OPENAI_API_KEY: "sk-test", DEMO: "false", OPENAI_MODEL: "gpt-4o" })).toEqual({
      mode: "live",
      openaiApiKey: "sk-test",
      openaiModel: "gpt-4o",
    });
  });

  it("rejects an unknown demo flag", () => {
    expect(() => readEnv({ DEMO: "yes" })).toThrow();
  });
});
