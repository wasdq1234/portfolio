'use client';

import { useState } from 'react';
import { Profile } from '@/types/database';

interface ProfileSectionProps {
  profile: Profile;
}

export default function ProfileSection({ profile }: ProfileSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl font-bold text-white">
            {profile.name.charAt(0)}
          </span>
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {profile.name}
          </h2>
          <p className="text-gray-600 font-medium">Portfolio</p>
        </div>
      </div>
      
      <div className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.email && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">이메일</p>
                <p className="text-gray-700 font-medium">{profile.email}</p>
              </div>
            </div>
          )}
          
          {profile.phone && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">전화번호</p>
                <p className="text-gray-700 font-medium">{profile.phone}</p>
              </div>
            </div>
          )}
          
          {profile.address && (
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100 md:col-span-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">주소</p>
                <p className="text-gray-700 font-medium">{profile.address}</p>
              </div>
            </div>
          )}
        </div>
        
        {profile.bio && (
          <div className="mt-6">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
              <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                자기소개
              </h4>
              <div className="relative">
                <p 
                  className="text-gray-700 leading-relaxed whitespace-pre-line text-sm"
                  style={
                    isExpanded 
                      ? {} 
                      : {
                          display: '-webkit-box',
                          WebkitLineClamp: 5,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }
                  }
                >
                  {profile.bio}
                </p>
                {profile.bio.split('\n').length > 5 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-white/80 hover:bg-white border border-gray-200 rounded-lg text-blue-600 hover:text-blue-700 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {isExpanded ? (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        접기
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        자세히 보기
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 