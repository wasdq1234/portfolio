'use client';

import { useState } from 'react';
import { Profile } from '@/types/database';

interface ProfileSectionProps {
  profile: Profile;
}

export default function ProfileSection({ profile }: ProfileSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">프로필</h2>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
        </div>
        
        {profile.email && (
          <div className="flex items-center text-gray-600">
            <span className="font-medium mr-2">이메일:</span>
            <span>{profile.email}</span>
          </div>
        )}
        
        {profile.phone && (
          <div className="flex items-center text-gray-600">
            <span className="font-medium mr-2">전화번호:</span>
            <span>{profile.phone}</span>
          </div>
        )}
        
        {profile.address && (
          <div className="flex items-center text-gray-600">
            <span className="font-medium mr-2">주소:</span>
            <span>{profile.address}</span>
          </div>
        )}
        
        {profile.bio && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-800 mb-2">자기소개</h4>
            <div className="relative">
              <p 
                className="text-gray-600 leading-relaxed whitespace-pre-line"
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
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none"
                >
                  {isExpanded ? '접기' : '자세히 보기'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 