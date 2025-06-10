'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatStreamChunk, ChatRequest, ChatMessageHistory } from '@/types/chat';

interface ChatInterfaceProps {
  profileId: string;
}

export default function ChatInterface({ profileId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string>('');
  const shouldScrollRef = useRef<boolean>(false);

  // 메시지 목록 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // 스크롤이 필요한 경우에만 실행
    if (shouldScrollRef.current) {
      scrollToBottom();
      shouldScrollRef.current = false;
    }
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
    
    // AI 응답 메시지 관리
    let aiMessageId: string | null = null;
    let aiResponseContent = '';

    // 헬퍼 함수들 정의
    const updateAiMessage = (messageId: string | null, content: string, conversationId: string) => {
      if (!messageId) {
        const newMessageId = `ai-${Date.now()}`;
        aiMessageId = newMessageId;
        
        const newMessage: ChatMessage = {
          id: newMessageId,
          content: content,
          isUser: false,
          timestamp: new Date(),
          conversationId: conversationId,
        };
        
        setMessages(prev => [...prev, newMessage]);
        shouldScrollRef.current = true;
        console.log('새 AI 메시지 생성:', newMessageId);
      } else {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: content }
            : msg
        ));
        console.log('기존 AI 메시지 업데이트:', messageId);
      }
    };

    const isToolRelatedContent = (content: string): boolean => {
      return content.includes('도구 호출 중:') || 
             content.includes('도구 실행 결과:') ||
             content.startsWith('도구 ');
    };

    const updateToolStatus = (content: string) => {
      if (content.includes('도구 호출 중:')) {
        setCurrentStatus('🔧 도구 호출 중...');
      } else if (content.includes('도구 실행 결과:')) {
        setCurrentStatus('📊 도구 호출 완료');
      }
    };

    setIsStreaming(true);
    shouldScrollRef.current = true;

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('스트림 읽기 완료 - done=true');
          break;
        }

        // 원시 데이터 디버깅 로그
        const rawChunk = decoder.decode(value, { stream: true });
        console.log('=== 원시 스트림 데이터 ===');
        console.log('Raw chunk length:', rawChunk.length);
        console.log('Raw chunk:', JSON.stringify(rawChunk));

        buffer += rawChunk;
        
        // SSE 형식: 두 개의 개행문자로 분리된 이벤트 처리
        const events = buffer.split('\n\n');
        // 마지막 부분은 불완전할 수 있으므로 버퍼에 보관
        buffer = events.pop() || '';

        for (const event of events) {
          if (!event.trim()) {
            console.log('빈 이벤트 무시');
            continue;
          }

          console.log('=== 이벤트 처리 ===');
          console.log('Event:', JSON.stringify(event));

          // SSE 형식 파싱: "data: {JSON}" 또는 여러 줄의 "data:" 라인들
          const lines = event.split('\n');
          let dataContent = '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const lineData = line.slice(6); // "data: " 제거
              dataContent += lineData;
            }
          }

          if (!dataContent.trim()) {
            console.log('데이터 내용이 없는 이벤트 무시');
            continue;
          }

          console.log('추출된 데이터:', dataContent);
          
          // [DONE] 체크 (종료 조건)
          if (dataContent.trim() === '[DONE]') {
            console.log('🏁 스트림 완료: [DONE] 수신');
            setIsStreaming(false);
            setCurrentStatus('');
            return;
          }

          // JSON 파싱 시도
          try {
            // 빈 문자열이나 null 체크
            if (!dataContent || dataContent.trim().length === 0) {
              console.log('빈 데이터 내용 무시');
              continue;
            }

            const chunk: ChatStreamChunk = JSON.parse(dataContent);
            console.log('=== 파싱 성공 ===');
            console.log('Chunk:', chunk);
            console.log('chunk_type:', chunk.chunk_type);
            console.log('content:', chunk.content);
            
            // conversation_id 저장
            if (chunk.conversation_id) {
              conversationIdRef.current = chunk.conversation_id;
            }

            // chunk_type에 따른 처리
            if (chunk.chunk_type === 'tool_calling') {
              console.log('🔧 도구 호출 중');
              setCurrentStatus('🔧 도구 호출 중...');
              continue;
              
            } else if (chunk.chunk_type === 'tool_result') {
              console.log('📊 도구 호출 완료');
              setCurrentStatus('📊 도구 호출 완료');
              continue;
              
            } else if (chunk.chunk_type === 'ai_response') {
              console.log('💬 AI 응답 처리');
              setCurrentStatus('💬 AI 응답 생성 중...');
              
              // AI 응답 내용 처리
              let content = chunk.content || '';
              
              // "AI 응답:" 접두사 제거
              if (content.startsWith('AI 응답:\n')) {
                content = content.substring('AI 응답:\n'.length);
                console.log('AI 응답: 접두사(\\n 포함) 제거됨');
              } else if (content.startsWith('AI 응답:')) {
                content = content.substring('AI 응답:'.length);
                console.log('AI 응답: 접두사 제거됨');
              }
              
              console.log('처리된 content:', content);
              
              // AI 응답 내용 누적
              aiResponseContent += content;
              
              // 실시간 메시지 업데이트
              updateAiMessage(aiMessageId, aiResponseContent, chunk.conversation_id);
              
            } else {
              console.log('⚠️ 알 수 없는 chunk_type 또는 chunk_type 없음');
              
              // chunk_type이 없는 경우 내용 분석
              let content = chunk.content || '';
              
              // 도구 관련 내용 필터링
              if (isToolRelatedContent(content)) {
                console.log('도구 관련 내용 필터링됨:', content);
                updateToolStatus(content);
                continue;
              }
              
              // "AI 응답:" 접두사 제거
              if (content.startsWith('AI 응답:\n')) {
                content = content.substring('AI 응답:\n'.length);
                setCurrentStatus('💬 AI 응답 생성 중...');
              } else if (content.startsWith('AI 응답:')) {
                content = content.substring('AI 응답:'.length);
                setCurrentStatus('💬 AI 응답 생성 중...');
              }
              
              // 빈 내용이면 처리하지 않음
              if (!content.trim()) {
                console.log('빈 내용으로 처리 생략');
                continue;
              }
              
              // AI 응답으로 처리
              aiResponseContent += content;
              updateAiMessage(aiMessageId, aiResponseContent, chunk.conversation_id);
            }

          } catch (error) {
            console.error('❌ JSON 파싱 오류:', error);
            console.error('파싱 실패한 원본 데이터:', JSON.stringify(dataContent));
            console.error('파싱 실패한 이벤트:', JSON.stringify(event));
            // 파싱 오류가 발생해도 스트림은 계속 진행
            continue;
          }
        }
      }
    } catch (error) {
      console.error('❌ 스트림 읽기 오류:', error);
      setIsStreaming(false);
      setCurrentStatus('');
      throw error;
    } finally {
      reader.releaseLock();
      console.log('스트림 리더 해제됨');
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
    setCurrentStatus('⏳ 응답 대기중...');
    shouldScrollRef.current = true; // 사용자 메시지 추가 시 스크롤 활성화

    try {
      // 현재 messages 상태 로그 출력
      console.log('=== 요청 전 현재 messages 상태 ===');
      console.log('전체 messages:', messages);
      console.log('messages 개수:', messages.length);
      
      // 환영 메시지를 제외한 대화 내역 구성
      const messageHistory: ChatMessageHistory[] = messages
        .filter(msg => msg.id !== 'welcome') // 환영 메시지 제외
        .map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content,
          timestamp: msg.timestamp.toISOString(),
        }));

      console.log('=== 구성된 대화 내역 ===');
      console.log('messageHistory:', messageHistory);
      console.log('messageHistory 개수:', messageHistory.length);

      const requestBody: ChatRequest = {
        message: inputMessage,
        messages: messageHistory,
        profile_id: profileId,
      };

      console.log('=== 최종 요청 데이터 ===');
      console.log('requestBody:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${apiUrl}/api/v1/chat/stream_tools`, {
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
      shouldScrollRef.current = true; // 오류 메시지 추가 시 스크롤 활성화
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setCurrentStatus('');
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
        {currentStatus && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-700">{currentStatus}</span>
          </div>
        )}
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