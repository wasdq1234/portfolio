'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/database';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const { data: adminUsers } = await supabase
        .from('users')
        .select('*')
        .eq('type', 'portfolio_admin');

      setLoading(false);
      
      if (!adminUsers || adminUsers.length === 0) {
        // 관리자가 없으면 회원가입 창 표시
        setIsAuthenticated(false);
      } else {
        // 관리자가 있으면 로그인 창 표시
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('관리자 확인 중 오류:', error);
      setLoading(false);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard currentUser={currentUser} />;
} 