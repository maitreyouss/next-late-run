import { describe, expect, it } from "vitest";

import { allow, clientKey, runLimit } from "@/lib/http/rate-limit";

describe("rate limit", () => {
  it("opens the window again after it expires", () => {
    const key = "rate-limit-window";
    expect(allow(key, 1, 1_000, 0)).toBe(true);
    expect(allow(key, 1, 1_000, 500)).toBe(false);
    expect(allow(key, 1, 1_000, 1_001)).toBe(true);
  });

  it("keeps a tighter cap when a live key is set", () => {
    expect(runLimit("live")).toEqual({ limit: 20, windowMs: 60 * 60 * 1000 });
    expect(runLimit("local").limit).toBe(60);
  });

  it("uses the first forwarded address", () => {
    const request = new Request("http://localhost/api/run", {
      headers: { "x-forwarded-for": "203.0.113.8, 10.0.0.1" },
    });
    expect(clientKey(request)).toBe("203.0.113.8");
  });
});
