import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { recordSpend, SPEND_TOOL, spendInput } from "@/lib/spend";

export function createSpendServer() {
  const server = new McpServer({ name: "next-late-run", version: "0.1.0" });
  server.registerTool(
    SPEND_TOOL,
    {
      description: "Records one stretch of tool time, in milliseconds.",
      inputSchema: spendInput,
    },
    async (args) => {
      const result = recordSpend(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result) }],
      };
    },
  );
  return server;
}
