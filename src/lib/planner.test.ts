import { describe, expect, it } from "vitest";

import { readEnv } from "@/lib/env";
import { createPlanner, PROPOSED_SENTENCE } from "@/lib/planner";
import { recordSpend } from "@/lib/spend";
import { runTurn } from "@/lib/turn";

const PROMPT = "Say when the run finished.";

async function offline<T>(run: () => Promise<T>): Promise<T> {
  const previous = globalThis.fetch;
  globalThis.fetch = () => Promise.reject(new Error("network"));
  try {
    return await run();
  } finally {
    globalThis.fetch = previous;
  }
}

describe("the model call", () => {
  it("replays the frozen case locally without calling the network", async () => {
    const run = await offline(() => runTurn(PROMPT, createPlanner(readEnv({}))));

    expect(run.spends.map((spend) => spend.elapsedMs)).toEqual([900, 800]);
    expect(run.usedMs).toBe(1700);
    expect(run.sentence).toBeNull();
  });

  it("stays local when the demo flag is set", async () => {
    const run = await offline(() =>
      runTurn(PROMPT, createPlanner(readEnv({ OPENAI_API_KEY: "sk-test", DEMO: "true" }))),
    );
    expect(run.sentence).toBeNull();
    expect(run.usedMs).toBe(1700);
  });

  it("drops the sentence the model wrote when the spends pass the budget", async () => {
    let calls = 0;
    const planner = createPlanner(
      readEnv({ OPENAI_API_KEY: "sk-test", DEMO: "false" }),
      async () => {
        calls += 1;
        return {
          text: PROPOSED_SENTENCE,
          toolResults: [
            { toolName: "spend", output: recordSpend({ elapsedMs: 900 }) },
            { toolName: "spend", output: recordSpend({ elapsedMs: 800 }) },
          ],
        };
      },
    );

    const run = await offline(() => runTurn(PROMPT, planner));

    expect(calls).toBe(1);
    expect(run.sentence).toBeNull();
    expect(run.usedMs).toBe(1700);
  });

  it("keeps the sentence the model wrote when the spends fit", async () => {
    const planner = createPlanner(
      readEnv({ OPENAI_API_KEY: "sk-test", DEMO: "false" }),
      async () => ({
        text: PROPOSED_SENTENCE,
        toolResults: [
          { toolName: "spend", output: recordSpend({ elapsedMs: 400 }) },
          { toolName: "spend", output: recordSpend({ elapsedMs: 500 }) },
        ],
      }),
    );

    const run = await offline(() => runTurn(PROMPT, planner));

    expect(run.sentence).toBe(PROPOSED_SENTENCE);
    expect(run.usedMs).toBe(900);
  });
});
