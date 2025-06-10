'use client';

import { useState } from 'react';

export default function ChatInterface() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 추후 채팅 기능 구현 예정
    console.log('Message:', message);
    setMessage('');
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
          {/* 샘플 메시지 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 max-w-xs shadow-sm">
              <p className="text-sm text-gray-700 leading-relaxed">
                안녕하세요! 저는 이 포트폴리오에 대해 도움을 드릴 AI 어시스턴트입니다. 
                경력이나 프로젝트에 대해 궁금한 점이 있으시면 언제든 물어보세요.
              </p>
            </div>
          </div>
          
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-xs text-yellow-700 font-medium">채팅 기능은 추후 개발 예정입니다</span>
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3 p-2 bg-white rounded-xl border border-gray-200 shadow-sm">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
          disabled // 추후 기능 구현 시 제거
        />
        <button
          type="submit"
          disabled // 추후 기능 구현 시 제거
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          전송
        </button>
      </form>
    </div>
  );
} 