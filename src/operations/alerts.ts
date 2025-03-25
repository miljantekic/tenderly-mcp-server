import { z } from "zod";
import { TenderlyClient } from "../client/tenderly.js";

// Schema for alert response
const AlertSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  projectId: z.string(),
  networkId: z.string(),
  conditions: z.array(z.any()),
  actions: z.array(z.any()),
});

const AlertsResponseSchema = z.object({
  alerts: z.array(AlertSchema),
});

export async function listAlerts(client: TenderlyClient) {
  try {
    const response = await client.request<z.infer<typeof AlertsResponseSchema>>("/alerts");
    const validatedResponse = AlertsResponseSchema.parse(response);
    return validatedResponse.alerts;
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
} 