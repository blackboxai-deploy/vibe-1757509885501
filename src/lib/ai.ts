import { ChatMessage } from '@/types/paper';

const AI_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const AI_HEADERS = {
  'customerId': 'cus_S16jfiBUH2cc7P',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
};

export interface ChatRequest {
  messages: ChatMessage[];
  paperContext: string;
  paperTitle: string;
}

export async function chatWithAI(request: ChatRequest): Promise<string> {
  try {
    const systemPrompt = `You are an AI assistant specialized in analyzing and discussing academic papers. You have been provided with the full content of a research paper titled "${request.paperTitle}".

Your role is to:
1. Answer questions about the paper's content, methodology, findings, and implications
2. Provide detailed explanations of complex concepts mentioned in the paper
3. Compare ideas from the paper with other research when relevant
4. Help users understand the significance and contributions of the work
5. Discuss potential applications and future research directions

Paper Content:
${request.paperContext}

Please provide accurate, insightful responses based on the paper content. When referencing specific parts of the paper, be precise and quote relevant sections when helpful.`;

    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt
      },
      ...request.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: AI_HEADERS,
      body: JSON.stringify({
        model: 'openrouter/claude-sonnet-4',
        messages
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from AI API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error chatting with AI:', error);
    throw new Error('Failed to get AI response');
  }
}

export function generateMessageId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}