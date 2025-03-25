import { z } from "zod";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const configSchema = z.object({
  accountSlug: z.string().min(1, "Account slug is required"),
  projectId: z.string().min(1, "Project ID is required"),
  accessToken: z.string().min(1, "Access token is required"),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(): Config {
  const config = {
    accountSlug: process.env.TENDERLY_ACCOUNT_SLUG,
    projectId: process.env.TENDERLY_PROJECT_ID,
    accessToken: process.env.TENDERLY_ACCESS_TOKEN,
  };

  const result = configSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Configuration error: ${result.error.message}`);
  }

  return result.data;
} 