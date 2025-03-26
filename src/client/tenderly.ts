import { Config } from "../config.js";

export class TenderlyClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(config: Config) {
    this.baseUrl = `https://api.tenderly.co/api/v1/account/${config.accountSlug}/project/${config.projectId}`;
    this.headers = {
      "X-Access-Key": `${config.accessToken}`,
      "Content-Type": "application/json",
      "User-Agent": "tenderly-mcp-server/0.0.1",
    };
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Tenderly API error: ${response.statusText}`);
    }

    return response.json();
  }
} 