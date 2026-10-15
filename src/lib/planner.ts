import { generateText, stepCountIs, tool, type LanguageModel } from "ai";

import type { AppEnv } from "@/lib/env";
import { createLanguageModel } from "@/lib/model";
import { readSpend, recordSpend, SPEND_TOOL, spendInput, type SpendResult } from "@/lib/spend";

export const PROPOSED_SENTENCE = "The run finished in time.";
export const FROZEN_ELAPSED = [900, 800] as const;
export const FIT_ELAPSED = [400, 500] as const;

export type PlannedRun = {
  sentence: string;
  spends: SpendResult[];
};

export type Planner = {
  plan(prompt: string): Promise<PlannedRun>;
};

export type ModelTurn = {
  text: string;
  toolResults: readonly { toolName: string; output: unknown }[];
};

export type ModelCaller = (prompt: string) => Promise<ModelTurn>;

export const spendTool = tool({
  description: "Records one stretch of tool time, in milliseconds.",
  inputSchema: spendInput,
  execute: async (input) => recordSpend(input),
});

const instructions = "Call spend for each stretch of tool time, then write one sentence.";

async function callModel(model: LanguageModel, prompt: string): Promise<ModelTurn> {
  const result = await generateText({
    model,
    instructions,
    prompt,
    tools: { [SPEND_TOOL]: spendTool },
    stopWhen: stepCountIs(4),
  });
  return {
    text: result.text,
    toolResults: result.toolResults.map((item) => ({
      toolName: item.toolName,
      output: item.output,
    })),
  };
}

function plannedFromTurn(turn: ModelTurn): PlannedRun {
  return {
    sentence: turn.text.trim(),
    spends: turn.toolResults
      .filter((item) => item.toolName === SPEND_TOOL)
      .map((item) => readSpend(item.output)),
  };
}

export function createScriptedPlanner(elapsed: readonly number[]): Planner {
  return {
    async plan() {
      return {
        sentence: PROPOSED_SENTENCE,
        spends: elapsed.map((elapsedMs) => recordSpend({ elapsedMs })),
      };
    },
  };
}

export function createLocalPlanner(): Planner {
  return createScriptedPlanner(FROZEN_ELAPSED);
}

export function createLivePlanner(
  model: LanguageModel,
  call: ModelCaller = (prompt) => callModel(model, prompt),
): Planner {
  return {
    async plan(prompt: string) {
      return plannedFromTurn(await call(prompt));
    },
  };
}

export function createPlanner(env: AppEnv, call?: ModelCaller): Planner {
  const model = createLanguageModel(env);
  if (model === null) return createLocalPlanner();
  return createLivePlanner(model, call);
}
