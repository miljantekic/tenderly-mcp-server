import { z } from "zod";
import { TenderlyClient } from "../client/tenderly.js";

// Schema for alert response
const AlertSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  enabled: z.boolean(),
  expressions: z.array(z.object({
    type: z.string(),
    expression: z.record(z.any())  // Allow any expression structure
  })),
  delivery_channels: z.array(z.object({
    delivery_channel_id: z.string(),
    delivery_channel: z.object({
      id: z.string(),
      type: z.string(),
      owner_id: z.string(),
      project_id: z.string().nullable(),
      label: z.string(),
      reference_id: z.string(),
      enabled: z.boolean(),
      created_at: z.string(),
      information: z.record(z.any())
    }),
    enabled: z.boolean(),
    created_at: z.string()
  })),
  project_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  color: z.string().nullable(),
  severity: z.string(),
  is_editable: z.boolean()
});

const GetAlertsResponseSchema = z.object({
  alerts: z.array(AlertSchema)
});

const GetAlertResponseSchema = z.object({
  alert: AlertSchema
});

export async function listAlerts(client: TenderlyClient) {
  try {
    const response = await client.request<z.infer<typeof GetAlertsResponseSchema>>("/alerts");
    console.error("list alerts response", JSON.stringify(response, null, 2));
    const validatedResponse = GetAlertsResponseSchema.parse(response);
    console.error("list alerts validated response", JSON.stringify(validatedResponse, null, 2));
    return validatedResponse.alerts;
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
}

export async function getAlertById(client: TenderlyClient, alertId: string) {
  try {
    const response = await client.request<z.infer<typeof GetAlertResponseSchema>>(`/alert/${alertId}`);
    const validatedResponse = GetAlertResponseSchema.parse(response);
    return validatedResponse.alert;
  } catch (error) {
    console.error("Error fetching alert by ID:", error);
    throw error;
  }
} 