import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/run/route";
import { readEnv } from "@/lib/env";
import { allow, runLimit } from "@/lib/http/rate-limit";
import { PROPOSED_SENTENCE } from "@/lib/planner";

function request(body: unknown) {
  return new Request("http://localhost/api/run", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/run", () => {
  it("returns no sentence for the late run", async () => {
    const response = await POST(request({ case: "late" }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      budgetMs: 1500,
      usedMs: 1700,
      sentence: null,
      spends: [
        { tool: "spend", elapsedMs: 900 },
        { tool: "spend", elapsedMs: 800 },
      ],
    });
  });

  it("returns the sentence when the run fits", async () => {
    const response = await POST(request({ case: "fit" }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      usedMs: 900,
      sentence: PROPOSED_SENTENCE,
    });
  });

  it("rejects an unknown case", async () => {
    const response = await POST(request({ case: "other" }));
    expect(response.status).toBe(400);
  });

  it("rejects a body that is not JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/run", { method: "POST", body: "nope" }),
    );
    expect(response.status).toBe(400);
  });

  it("refuses a run past the hourly cap", async () => {
    const key = "203.0.113.50";
    const limit = runLimit(readEnv().mode);
    for (let i = 0; i < limit.limit; i += 1) {
      expect(allow(key, limit.limit, limit.windowMs)).toBe(true);
    }
    const response = await POST(
      new Request("http://localhost/api/run", {
        method: "POST",
        headers: { "x-forwarded-for": key },
        body: JSON.stringify({ case: "late" }),
      }),
    );
    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({ error: "Too many runs. Try again later." });
  });
});
