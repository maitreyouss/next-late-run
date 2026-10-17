"use client";

import { useRef, useState } from "react";

import { RUN_BUDGET_MS } from "@/lib/budget";

type ReplayName = "late" | "fit";

type Replay = {
  sentence: string | null;
  spends: { tool: string; elapsedMs: number }[];
  usedMs: number;
  budgetMs: number;
};

const ACTIONS: { id: ReplayName; label: string }[] = [
  { id: "late", label: "Late run" },
  { id: "fit", label: "In budget" },
];

export function RunConsole() {
  const [pending, setPending] = useState<ReplayName | null>(null);
  const [selected, setSelected] = useState<ReplayName | null>(null);
  const [run, setRun] = useState<Replay | null>(null);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function replay(name: ReplayName) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setPending(name);
    setError("");

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case: name }),
        signal: controller.signal,
      });
      const payload = (await response.json()) as Replay & { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "The run failed.");
        return;
      }
      setSelected(name);
      setRun(payload);
    } catch (caught) {
      if (controller.signal.aborted) return;
      setError(caught instanceof Error ? caught.message : "The run failed.");
    } finally {
      if (abortRef.current === controller) setPending(null);
    }
  }

  return (
    <section className="console">
      <div className="actions">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            aria-pressed={selected === action.id}
            disabled={pending !== null}
            onClick={() => void replay(action.id)}
          >
            {pending === action.id ? "Running" : action.label}
          </button>
        ))}
      </div>
      <div className="result" aria-live="polite">
        <p className="budget">Budget {run?.budgetMs ?? RUN_BUDGET_MS} ms</p>
        {error ? <p className="error">{error}</p> : null}
        {run ? (
          <>
            <ul>
              {run.spends.map((spend, index) => (
                <li key={`${spend.tool}-${index}`}>
                  {spend.tool} {spend.elapsedMs} ms
                </li>
              ))}
            </ul>
            <p className="sum">Sum {run.usedMs} ms</p>
            <p className={run.sentence === null ? "dropped" : "kept"}>
              {run.sentence === null ? "No sentence." : run.sentence}
            </p>
          </>
        ) : error ? null : (
          <p className="idle">Replay a run.</p>
        )}
      </div>
    </section>
  );
}
