import { describe, expect, it } from "vitest";

import { RUN_BUDGET_MS, sentenceAfterBudget } from "@/lib/budget";

describe("a late run", () => {
  it("drops the sentence when two spends pass the budget", () => {
    expect(RUN_BUDGET_MS).toBe(1500);
    expect(sentenceAfterBudget("The run finished in time.", [900, 800])).toBeNull();
  });

  it("keeps the sentence when the spends fit", () => {
    expect(sentenceAfterBudget("The run finished in time.", [400, 500])).toBe(
      "The run finished in time.",
    );
  });
});
