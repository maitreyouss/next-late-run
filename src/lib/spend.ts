import { z } from "zod";

export const SPEND_TOOL = "spend" as const;

const elapsedMs = z.number().int().nonnegative();

export const spendInput = z.object({
  elapsedMs,
});

export const spendResult = z.object({
  tool: z.literal(SPEND_TOOL),
  elapsedMs,
});

export type SpendResult = z.infer<typeof spendResult>;

export function readSpend(value: unknown): SpendResult {
  return spendResult.parse(value);
}

export function recordSpend(value: unknown): SpendResult {
  const input = spendInput.parse(value);
  return readSpend({ tool: SPEND_TOOL, elapsedMs: input.elapsedMs });
}
