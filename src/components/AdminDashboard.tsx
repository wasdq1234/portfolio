'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile, Career, Project, User } from '@/types/database';

interface AdminDashboardProps {
  currentUser: User | null;
}

export default function AdminDashboard({ currentUser }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'profiles' | 'careers' | 'projects'>('profiles');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // 폼 상태
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'profiles') {
        const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        setProfiles(data || []);
      } else if (activeTab === 'careers') {
        const { data } = await supabase.from('careers').select('*').order('created_at', { ascending: false });
        setCareers(data || []);
        // 프로필도 로드
        const { data: profileData } = await supabase.from('profiles').select('*');
        setProfiles(profileData || []);
      } else if (activeTab === 'projects') {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        setProjects(data || []);
        // 경력도 로드
        const { data: careerData } = await supabase.from('careers').select('*');
        setCareers(careerData || []);
      }
    } catch (error) {
      console.error('데이터 로딩 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    window.location.reload();
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string, tableName: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await supabase.from(tableName).delete().eq('id', id);
        loadData();
      } catch (error) {
        console.error('삭제 중 오류:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let tableName = '';
      const submitData = { ...formData };

      if (activeTab === 'profiles') {
        tableName = 'profiles';
      } else if (activeTab === 'careers') {
        tableName = 'careers';
      } else if (activeTab === 'projects') {
        tableName = 'projects';
        if (submitData.technologies && typeof submitData.technologies === 'string') {
          submitData.technologies = submitData.technologies.split(',').map((tech: string) => tech.trim());
        }
      }

      if (editingItem) {
        await supabase
          .from(tableName)
          .update({
            ...submitData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);
      } else {
        await supabase.from(tableName).insert([submitData]);
      }

      setFormData({});
      setShowForm(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error('저장 중 오류:', error);
    }
  };

  const renderForm = () => {
    if (!showForm) return null;

    if (activeTab === 'profiles') {
      return (
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingItem ? '프로필 수정' : '새 프로필 추가'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="이름"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="email"
                placeholder="이메일"
                required
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="주소"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="전화번호"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <textarea
              placeholder="자기소개"
              rows={3}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {editingItem ? '수정' : '추가'}
              </button>
            </div>
          </form>
        </div>
      );
    }

    if (activeTab === 'careers') {
      return (
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingItem ? '경력 수정' : '새 경력 추가'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                required
                value={formData.profile_id || ''}
                onChange={(e) => setFormData({ ...formData, profile_id: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">프로필을 선택하세요</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="회사명"
                required
                value={formData.company_name || ''}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="직책"
                value={formData.position || ''}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="date"
                placeholder="시작일"
                required
                value={formData.start_date ? formData.start_date.split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="date"
                placeholder="종료일 (현재 재직 중이면 비워두세요)"
                value={formData.end_date ? formData.end_date.split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <textarea
              placeholder="업무 설명"
              rows={3}
              value={formData.job_description || ''}
              onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {editingItem ? '수정' : '추가'}
              </button>
            </div>
          </form>
        </div>
      );
    }

    if (activeTab === 'projects') {
      return (
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingItem ? '프로젝트 수정' : '새 프로젝트 추가'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                required
                value={formData.career_id || ''}
                onChange={(e) => setFormData({ ...formData, career_id: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">경력을 선택하세요</option>
                {careers.map((career) => (
                  <option key={career.id} value={career.id}>
                    {career.company_name} - {career.position || '직책 없음'}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="프로젝트명"
                required
                value={formData.project_name || ''}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="date"
                placeholder="시작일"
                value={formData.start_date ? formData.start_date.split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="date"
                placeholder="종료일"
                value={formData.end_date ? formData.end_date.split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <input
              type="text"
              placeholder="기술스택 (쉼표로 구분)"
              value={formData.technologies ? (Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies) : ''}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <textarea
              placeholder="프로젝트 설명"
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {editingItem ? '수정' : '추가'}
              </button>
            </div>
          </form>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">포트폴리오 관리자</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">안녕하세요, {currentUser?.username}님</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'profiles', name: '프로필' },
              { id: 'careers', name: '경력' },
              { id: 'projects', name: '프로젝트' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'profiles' | 'careers' | 'projects')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'profiles' && '프로필 관리'}
              {activeTab === 'careers' && '경력 관리'}
              {activeTab === 'projects' && '프로젝트 관리'}
            </h2>
            <button
              onClick={handleAdd}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              새 {activeTab === 'profiles' && '프로필'}{activeTab === 'careers' && '경력'}{activeTab === 'projects' && '프로젝트'} 추가
            </button>
          </div>

          {renderForm()}

          {loading ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {activeTab === 'profiles' && profiles.map((profile) => (
                  <li key={profile.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-lg font-medium text-indigo-600">{profile.name}</p>
                        <p className="text-sm text-gray-900">{profile.email}</p>
                        {profile.phone && <p className="text-sm text-gray-500">{profile.phone}</p>}
                        {profile.address && <p className="text-sm text-gray-500">{profile.address}</p>}
                        {profile.bio && <p className="text-sm text-gray-500 mt-2">{profile.bio}</p>}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(profile)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(profile.id, 'profiles')}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </li>
                ))}

                {activeTab === 'careers' && careers.map((career) => (
                  <li key={career.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-lg font-medium text-indigo-600">{career.company_name}</p>
                        <p className="text-sm text-gray-900">프로필: {profiles.find(p => p.id === career.profile_id)?.name || '알 수 없음'}</p>
                        {career.position && <p className="text-sm text-gray-500">직책: {career.position}</p>}
                        <p className="text-sm text-gray-500">
                          기간: {career.start_date.split('T')[0]} ~ {career.end_date ? career.end_date.split('T')[0] : '현재'}
                        </p>
                        {career.job_description && <p className="text-sm text-gray-500 mt-2">{career.job_description}</p>}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(career)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(career.id, 'careers')}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </li>
                ))}

                {activeTab === 'projects' && projects.map((project) => (
                  <li key={project.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-lg font-medium text-indigo-600">{project.project_name}</p>
                        <p className="text-sm text-gray-900">경력: {careers.find(c => c.id === project.career_id)?.company_name || '알 수 없음'}</p>
                        {(project.start_date || project.end_date) && (
                          <p className="text-sm text-gray-500">
                            기간: {project.start_date ? project.start_date.split('T')[0] : '시작일 없음'} ~ {project.end_date ? project.end_date.split('T')[0] : '종료일 없음'}
                          </p>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {project.description && <p className="text-sm text-gray-500 mt-2">{project.description}</p>}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, 'projects')}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 