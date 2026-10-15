import { RUN_BUDGET_MS } from "@/lib/budget";
import { FIT_ELAPSED, FROZEN_ELAPSED, createScriptedPlanner } from "@/lib/planner";
import { runTurn } from "@/lib/turn";
import type { SettledRun } from "@/lib/run";

export const REPLAYS = {
  late: FROZEN_ELAPSED,
  fit: FIT_ELAPSED,
} as const;

export type ReplayName = keyof typeof REPLAYS;

export type Replay = SettledRun & {
  budgetMs: number;
};

export async function replay(name: ReplayName): Promise<Replay> {
  const run = await runTurn("Replay the run.", createScriptedPlanner(REPLAYS[name]));
  return { ...run, budgetMs: RUN_BUDGET_MS };
}
