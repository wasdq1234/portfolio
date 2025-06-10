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
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="border-b border-gray-200 pb-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-800">AI 어시스턴트</h3>
        <p className="text-sm text-gray-500">포트폴리오에 대해 궁금한 것을 물어보세요</p>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-3">
          {/* 샘플 메시지 */}
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              안녕하세요! 저는 이 포트폴리오에 대해 도움을 드릴 AI 어시스턴트입니다. 
              경력이나 프로젝트에 대해 궁금한 점이 있으시면 언제든 물어보세요.
            </p>
          </div>
          
          <div className="text-center">
            <span className="text-xs text-gray-400">채팅 기능은 추후 개발 예정입니다</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled // 추후 기능 구현 시 제거
        />
        <button
          type="submit"
          disabled // 추후 기능 구현 시 제거
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          전송
        </button>
      </form>
    </div>
  );
} 