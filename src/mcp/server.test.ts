import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it } from "vitest";

import { recordSpend, SPEND_TOOL } from "@/lib/spend";
import { createSpendServer } from "@/mcp/server";

async function withClient(run: (client: Client) => Promise<void>) {
  const server = createSpendServer();
  const client = new Client({ name: "next-late-run-test", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);
  try {
    await run(client);
  } finally {
    await Promise.all([client.close(), server.close()]);
  }
}

describe("spend server", () => {
  it("lists one tool and returns the recorded time", async () => {
    await withClient(async (client) => {
      const listed = await client.listTools();
      expect(listed.tools.map((tool) => tool.name)).toEqual([SPEND_TOOL]);

      const result = await client.callTool({ name: SPEND_TOOL, arguments: { elapsedMs: 900 } });
      expect(result.isError).not.toBe(true);
      expect(result.content).toEqual([
        { type: "text", text: JSON.stringify(recordSpend({ elapsedMs: 900 })) },
      ]);
    });
  });

  it("refuses a spend that is not a whole number of milliseconds", async () => {
    await withClient(async (client) => {
      const result = await client.callTool({ name: SPEND_TOOL, arguments: { elapsedMs: 1.5 } });
      expect(result.isError).toBe(true);
    });
  });
});
