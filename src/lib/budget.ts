export const RUN_BUDGET_MS = 1500;

export function usedMs(elapsed: readonly number[]): number {
  return elapsed.reduce((sum, ms) => sum + ms, 0);
}

export function sentenceAfterBudget(sentence: string, elapsed: readonly number[]): string | null {
  if (usedMs(elapsed) > RUN_BUDGET_MS) return null;
  return sentence;
}
