import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadConfig } from "./config.js";
import { TenderlyClient } from "./client/tenderly.js";
import { getAlertById, listAlerts } from "./operations/alerts.js";

const config = loadConfig();
const tenderlyClient = new TenderlyClient(config);

const server = new McpServer({
  name: "tenderly-mcp-server",
  version: "0.0.1",
  capabilities: {
    resources: {
      "tenderly://alerts": {
        description: "All Tenderly alerts for the given project",
      }
    },
    tools: {
      get_alert: {
        description: "Retrieve a specific Tenderly alert by ID"
      }
    },
  },
});

// Register the alerts resource
server.resource(
  "get_alerts",
  "tenderly://alerts",
  async (uri) => {
    try {
      const alerts = await listAlerts(tenderlyClient);
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(alerts, null, 2),
            
          },
        ],
      };
    } catch (error) {
      console.error("Error reading alerts resource:", error);
      throw error;
    }
  }
);

server.tool(
  "get_alert",
  {
    id: z.string().describe("The ID of the alert to retrieve"),
  },
  async (args) => {
    const alert = await getAlertById(tenderlyClient, args.id);
    return {
      content: [
        {
          type: "resource",
          resource: {
            uri: `tenderly://alerts/${args.id}`,
            mimeType: "application/json",
            text: JSON.stringify(alert, null, 2),
          },
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Tenderly MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});