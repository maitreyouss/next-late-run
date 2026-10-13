import { describe, expect, it } from "vitest";

import { readEnv } from "@/lib/env";
import { createLanguageModel } from "@/lib/model";

describe("createLanguageModel", () => {
  it("returns no model on the local path", () => {
    expect(createLanguageModel(readEnv({}))).toBeNull();
    expect(createLanguageModel(readEnv({ OPENAI_API_KEY: "sk-test", DEMO: "true" }))).toBeNull();
  });

  it("builds the named model without calling the network", () => {
    const model = createLanguageModel(
      readEnv({ OPENAI_API_KEY: "sk-test", DEMO: "false", OPENAI_MODEL: "gpt-4o-mini" }),
    );
    expect(model).toMatchObject({ modelId: "gpt-4o-mini" });
    expect(model).toEqual(expect.objectContaining({ provider: expect.stringContaining("openai") }));
  });
});
