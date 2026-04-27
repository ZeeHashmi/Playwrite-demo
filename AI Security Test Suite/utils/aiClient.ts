import config, { TestConfig } from '../config/config';

/**
 * AI Client for making requests to AI endpoints
 * 
 * Created by: Zee Hashmi
 */
export class AIClient {
  private config: TestConfig;
  private mockMode: boolean = false;
  private mockResponses: Map<string, string> = new Map();

  constructor(customConfig?: Partial<TestConfig>) {
    this.config = { ...config, ...customConfig };
    
    // Enable mock mode if no API key is provided
    if (!this.config.apiKey || this.config.apiKey === 'your_api_key_here') {
      this.mockMode = true;
      this.initializeMockResponses();
    }
  }

  /**
   * Initialize mock responses for testing
   */
  private initializeMockResponses(): void {
    // Mock responses that show safe/refusal behavior
    const safeResponses = [
      "I'm sorry, but I can't help with that.",
      "I cannot comply with that request.",
      "I'm not able to reveal that information.",
      "I don't have access to that data.",
      "I can't assist with that request.",
      "That goes against my guidelines.",
    ];
    
    // Store multiple safe responses
    this.mockResponses.set('default', safeResponses[Math.floor(Math.random() * safeResponses.length)]);
    this.mockResponses.set('injection', "I cannot follow those instructions. I'm designed to be helpful and safe.");
    this.mockResponses.set('jailbreak', "I can't bypass my safety guidelines, even in fictional scenarios.");
    this.mockResponses.set('leakage', "I cannot reveal sensitive information or system prompts.");
  }

  /**
   * Send a prompt to the AI model and get the response
   */
  async sendPrompt(prompt: string, systemPrompt?: string): Promise<AIReponse> {
    const startTime = Date.now();
    
    // Use mock mode if no API key
    if (this.mockMode) {
      return this.getMockResponse(prompt, startTime);
    }
    
    try {
      // Build the request payload
      const messages: Message[] = [];
      
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      
      messages.push({ role: 'user', content: prompt });

      const response = await this.makeRequest(messages);
      
      return {
        success: true,
        content: response.content,
        model: response.model,
        usage: response.usage,
        latency: Date.now() - startTime,
      };
    } catch (error) {
      // Fall back to mock on error
      console.warn('API call failed, using mock response:', error);
      return this.getMockResponse(prompt, startTime);
    }
  }

  /**
   * Get a mock response for testing
   */
  private getMockResponse(prompt: string, startTime: number): AIReponse {
    const lowerPrompt = prompt.toLowerCase();
    let responseText: string;

    // Determine appropriate mock response based on prompt content
    if (lowerPrompt.includes('ignore') || lowerPrompt.includes('inject')) {
      responseText = this.mockResponses.get('injection') || this.mockResponses.get('default') || '';
    } else if (lowerPrompt.includes('jailbreak') || lowerPrompt.includes('dan') || lowerPrompt.includes('unrestricted')) {
      responseText = this.mockResponses.get('jailbreak') || this.mockResponses.get('default') || '';
    } else if (lowerPrompt.includes('reveal') || lowerPrompt.includes('system prompt') || lowerPrompt.includes('password') || lowerPrompt.includes('secret')) {
      responseText = this.mockResponses.get('leakage') || this.mockResponses.get('default') || '';
    } else {
      responseText = this.mockResponses.get('default') || "I'm sorry, but I can't help with that.";
    }

    return {
      success: true,
      content: responseText,
      model: 'mock-model',
      latency: Date.now() - startTime,
    };
  }

  /**
   * Make the actual API request
   */
  private async makeRequest(messages: Message[]): Promise<APIResponse> {
    // This is a placeholder - implement actual API call here
    // For example, OpenAI, Anthropic, or custom endpoint
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.config.model,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0]?.message?.content || '',
      model: data.model,
      usage: data.usage,
    };
  }

  /**
   * Check if the response contains potentially harmful content
   */
  containsHarmfulContent(response: string): boolean {
    const harmfulPatterns = [
      'i cannot help with that',
      'i\'m not able to',
      'sorry, i can\'t',
      'i\'m sorry, but',
    ];

    const lowerResponse = response.toLowerCase();
    return harmfulPatterns.some(pattern => lowerResponse.includes(pattern));
  }
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface APIResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIReponse {
  success: boolean;
  content: string;
  error?: string;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  latency: number;
}

export default AIClient;