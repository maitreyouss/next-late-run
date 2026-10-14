import { sentenceAfterBudget, usedMs } from "@/lib/budget";
import { recordSpend, type SpendResult } from "@/lib/spend";

export type SettledRun = {
  sentence: string | null;
  spends: SpendResult[];
  usedMs: number;
};

export function settleRun(sentence: string, spends: readonly SpendResult[]): SettledRun {
  const times = spends.map((spend) => spend.elapsedMs);
  return {
    sentence: sentenceAfterBudget(sentence, times),
    spends: [...spends],
    usedMs: usedMs(times),
  };
}

export function runSpends(sentence: string, elapsed: readonly number[]): SettledRun {
  return settleRun(
    sentence,
    elapsed.map((elapsedMs) => recordSpend({ elapsedMs })),
  );
}
