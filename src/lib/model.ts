import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

import { readEnv, type AppEnv } from "@/lib/env";

export function createLanguageModel(env: AppEnv = readEnv()): LanguageModel | null {
  if (env.mode !== "live" || env.openaiApiKey === undefined) return null;
  const openai = createOpenAI({ apiKey: env.openaiApiKey });
  return openai(env.openaiModel);
}
