import { describe, expect, it } from "vitest";

import { PROPOSED_SENTENCE } from "@/lib/planner";
import { replay } from "@/lib/replay";

describe("replay", () => {
  it("drops the sentence for the late run", async () => {
    const run = await replay("late");
    expect(run.budgetMs).toBe(1500);
    expect(run.spends).toEqual([
      { tool: "spend", elapsedMs: 900 },
      { tool: "spend", elapsedMs: 800 },
    ]);
    expect(run.usedMs).toBe(1700);
    expect(run.sentence).toBeNull();
  });

  it("keeps the sentence when the run fits", async () => {
    const run = await replay("fit");
    expect(run.usedMs).toBe(900);
    expect(run.sentence).toBe(PROPOSED_SENTENCE);
  });
});
