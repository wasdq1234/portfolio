'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatStreamChunk, ChatRequest, ChatMessageHistory } from '@/types/chat';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentStreamingMessageRef = useRef<string>('');
  const conversationIdRef = useRef<string>('');

  // 메시지 목록 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 초기 환영 메시지 추가
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content: '안녕하세요! 저는 이 포트폴리오에 대해 도움을 드릴 AI 어시스턴트입니다. 경력이나 프로젝트에 대해 궁금한 점이 있으시면 언제든 물어보세요.',
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // SSE 스트림 처리 함수
  const handleStreamResponse = async (response: Response) => {
    if (!response.body) {
      throw new Error('응답 본문을 읽을 수 없습니다.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    currentStreamingMessageRef.current = '';

    // AI 응답 메시지 초기화
    const aiMessageId = `ai-${Date.now()}`;
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      content: '',
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsStreaming(true);

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataContent = line.slice(6);
            
            if (dataContent === '[DONE]') {
              setIsStreaming(false);
              return;
            }

            try {
              const chunk: ChatStreamChunk = JSON.parse(dataContent);
              currentStreamingMessageRef.current += chunk.content;
              conversationIdRef.current = chunk.conversation_id;

              // 메시지 업데이트
              setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId 
                  ? { 
                      ...msg, 
                      content: currentStreamingMessageRef.current,
                      conversationId: chunk.conversation_id 
                    }
                  : msg
              ));

              if (chunk.is_final) {
                setIsStreaming(false);
                return;
              }
            } catch (error) {
              console.error('JSON 파싱 오류:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('스트림 읽기 오류:', error);
      setIsStreaming(false);
      throw error;
    } finally {
      reader.releaseLock();
    }
  };

  // 메시지 전송 함수
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || isStreaming) return;

    const apiUrl = process.env.NEXT_PUBLIC_AI_CHAT_API_URL;
    if (!apiUrl) {
      console.error('AI_CHAT_API_URL이 설정되지 않았습니다.');
      return;
    }

    // 사용자 메시지 추가
    const userMessageId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 환영 메시지를 제외한 대화 내역 구성
      const messageHistory: ChatMessageHistory[] = messages
        .filter(msg => msg.id !== 'welcome') // 환영 메시지 제외
        .map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content,
          timestamp: msg.timestamp.toISOString(),
        }));

      const requestBody: ChatRequest = {
        message: inputMessage,
        messages: messageHistory,
      };

      const response = await fetch(`${apiUrl}/api/v1/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await handleStreamResponse(response);
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      
      // 오류 메시지 추가
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: '죄송합니다. 메시지 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 h-full flex flex-col">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              AI 어시스턴트
            </h3>
            <p className="text-sm text-gray-500">포트폴리오에 대해 궁금한 것을 물어보세요</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 bg-gradient-to-b from-gray-50 to-white rounded-xl p-4 border border-gray-100">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isUser 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                  : 'bg-gradient-to-br from-green-500 to-blue-600'
              }`}>
                {message.isUser ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className={`p-4 rounded-2xl border shadow-sm max-w-[70%] ${
                message.isUser
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-200'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                  {isStreaming && message.id.startsWith('ai-') && message === messages[messages.length - 1] && (
                    <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse">|</span>
                  )}
                </p>
                <p className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3 p-2 bg-white rounded-xl border border-gray-200 shadow-sm">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
          disabled={isLoading || isStreaming}
          maxLength={10000}
        />
        <button
          type="submit"
          disabled={isLoading || isStreaming || !inputMessage.trim()}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
        >
          {isLoading || isStreaming ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              전송 중...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              전송
            </>
          )}
        </button>
      </form>
    </div>
  );
} 