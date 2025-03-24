import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const TENDERLY_API_BASE = "https://api.tenderly.co/api";
const USER_AGENT = "tenderly-mcp-server/0.0.1";

// Create server instance
const server = new McpServer({
  name: "tenderly-mcp-server",
  version: "0.0.1",
  capabilities: {
    resources: {},
    tools: {},
  },
});