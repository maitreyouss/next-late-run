import { z } from "zod";

export const spendResult = z.object({
  tool: z.literal("spend"),
  elapsedMs: z.number().int().nonnegative(),
});

export type SpendResult = z.infer<typeof spendResult>;

export function readSpend(value: unknown): SpendResult {
  return spendResult.parse(value);
}
