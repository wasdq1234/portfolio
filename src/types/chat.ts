export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  conversationId?: string;
}

export interface ChatStreamChunk {
  content: string;
  conversation_id: string;
  is_final: boolean;
  chunk_type?: 'tool_calling' | 'tool_result' | 'ai_response';
  metadata: object | null;
}

export interface ChatMessageHistory {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  messages: ChatMessageHistory[];
  profile_id: string;
} 