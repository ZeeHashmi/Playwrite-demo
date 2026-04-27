/**
 * AI Security Test Suite Configuration
 * 
 * Created by: Zee Hashmi
 */

export interface TestConfig {
  /** Base URL for the AI endpoint being tested */
  baseUrl: string;
  /** API key for authentication (optional) */
  apiKey?: string;
  /** Model identifier (e.g., 'gpt-4', 'claude-3') */
  model: string;
  /** Maximum timeout for API responses (ms) */
  timeout: number;
  /** Enable detailed logging */
  verbose: boolean;
}

export const config: TestConfig = {
  baseUrl: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
  apiKey: process.env.AI_API_KEY,
  model: process.env.AI_MODEL || 'gpt-4',
  timeout: parseInt(process.env.AI_TIMEOUT || '30000', 10),
  verbose: process.env.VERBOSE === 'true',
};

/** Security test categories */
export enum TestCategory {
  PROMPT_INJECTION = 'prompt-injection',
  JAILBREAK = 'jailbreak',
  DATA_LEAKAGE = 'data-leakage',
}

/** Test severity levels */
export enum Severity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export default config;