import type { Planner } from "@/lib/planner";
import { settleRun, type SettledRun } from "@/lib/run";

export async function runTurn(prompt: string, planner: Planner): Promise<SettledRun> {
  const planned = await planner.plan(prompt);
  return settleRun(planned.sentence, planned.spends);
}
