import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadConfig } from "./config.js";
import { TenderlyClient } from "./client/tenderly.js";

const config = loadConfig();

const tenderlyClient = new TenderlyClient(config);

const server = new McpServer({
  name: "tenderly-mcp-server",
  version: "0.0.1",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Tenderly MCP Server running on stdio");
}
  
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});