import { ProfileWithCareers } from '@/types/database';
import ProfileSection from './ProfileSection';
import CareerSection from './CareerSection';
import ChatInterface from './ChatInterface';

interface PortfolioProps {
  profileData: ProfileWithCareers | null;
}

export default function Portfolio({ profileData }: PortfolioProps) {
  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">데이터를 불러올 수 없습니다</h2>
          <p className="text-gray-500">Supabase 연결을 확인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측 영역: 포트폴리오 콘텐츠 */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <ProfileSection profile={profileData} />
              <CareerSection careers={profileData.careers} />
            </div>
          </div>
          
          {/* 우측 영역: AI 채팅 인터페이스 */}
          <div className="lg:col-span-1">
            <div className="sticky top-4" style={{ height: 'calc(100vh - 2rem)' }}>
              <ChatInterface />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 