import { describe, expect, it } from "vitest";

import { RUN_BUDGET_MS } from "@/lib/budget";
import { runSpends } from "@/lib/run";

const SENTENCE = "The run finished in time.";

describe("a late run", () => {
  it("drops the sentence when two spends pass the budget", () => {
    const run = runSpends(SENTENCE, [900, 800]);

    expect(RUN_BUDGET_MS).toBe(1500);
    expect(run.spends).toEqual([
      { tool: "spend", elapsedMs: 900 },
      { tool: "spend", elapsedMs: 800 },
    ]);
    expect(run.usedMs).toBe(1700);
    expect(run.sentence).toBeNull();
  });

  it("keeps the sentence when the spends fit", () => {
    const run = runSpends(SENTENCE, [400, 500]);

    expect(run.usedMs).toBe(900);
    expect(run.sentence).toBe(SENTENCE);
  });
});
