import { z } from "zod";

export const DEFAULT_MODEL = "gpt-4o-mini";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().min(1).optional(),
  DEMO: z.enum(["true", "false"]).optional(),
});

export type RunMode = "local" | "live";

export type AppEnv = {
  mode: RunMode;
  openaiApiKey: string | undefined;
  openaiModel: string;
};

export type EnvSource = Record<string, string | undefined>;

function present(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function readEnv(source: EnvSource = process.env): AppEnv {
  const parsed = envSchema.parse({
    OPENAI_API_KEY: present(source.OPENAI_API_KEY),
    OPENAI_MODEL: present(source.OPENAI_MODEL),
    DEMO: present(source.DEMO),
  });
  const demo = parsed.DEMO === "true";
  const mode: RunMode = demo || parsed.OPENAI_API_KEY === undefined ? "local" : "live";

  return {
    mode,
    openaiApiKey: mode === "live" ? parsed.OPENAI_API_KEY : undefined,
    openaiModel: parsed.OPENAI_MODEL ?? DEFAULT_MODEL,
  };
}
