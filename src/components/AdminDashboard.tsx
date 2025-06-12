'use client';

import { useState, useEffect, useCallback } from 'react';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingItem, setEditingItem] = useState<any>(null);

  const loadData = useCallback(async () => {
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
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const logout = () => {
    window.location.reload();
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setShowForm(true);
  };

  const handleEdit = (item: Profile | Career | Project) => {
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

      if (editingItem && 'id' in editingItem) {
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
                    {career.company_name} - {career.position}
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
                required
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
            <textarea
              placeholder="프로젝트 설명"
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="기술 스택 (쉼표로 구분)"
              value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : (formData.technologies as string) || ''}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
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
  };

  const renderDataTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      );
    }

    if (activeTab === 'profiles') {
      return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  전화번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  주소
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {profile.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {profile.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {profile.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {profile.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(profile)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(profile.id, 'profiles')}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'careers') {
      return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  회사명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  직책
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  기간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {careers.map((career) => (
                <tr key={career.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {career.company_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {career.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {career.start_date} ~ {career.end_date || '현재'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(career)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(career.id, 'careers')}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'projects') {
      return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  프로젝트명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  기간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  기술 스택
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id}>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                     {project.project_name}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.start_date} ~ {project.end_date || '진행중'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {Array.isArray(project.technologies) 
                      ? project.technologies.join(', ') 
                      : project.technologies || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(project.id, 'projects')}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              관리자 대시보드
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {currentUser?.username}님 환영합니다
              </span>
              <button
                onClick={logout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 탭 네비게이션 */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('profiles')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profiles'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                프로필 관리
              </button>
              <button
                onClick={() => setActiveTab('careers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'careers'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                경력 관리
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'projects'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                프로젝트 관리
              </button>
            </nav>
          </div>

          {/* 추가 버튼 */}
          <div className="mb-6">
            <button
              onClick={handleAdd}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {activeTab === 'profiles' && '새 프로필 추가'}
              {activeTab === 'careers' && '새 경력 추가'}
              {activeTab === 'projects' && '새 프로젝트 추가'}
            </button>
          </div>

          {/* 폼 */}
          {renderForm()}

          {/* 데이터 테이블 */}
          {renderDataTable()}
        </div>
      </div>
    </div>
  );
} 