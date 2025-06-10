'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/database';
import bcrypt from 'bcryptjs';

interface AdminLoginProps {
  onLoginSuccess: (user: User) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const { data: adminUsers } = await supabase
        .from('users')
        .select('*')
        .eq('type', 'portfolio_admin');

      if (!adminUsers || adminUsers.length === 0) {
        setIsRegisterMode(true);
      }
    } catch (error) {
      console.error('관리자 확인 중 오류:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setLoading(false);
      return;
    }

    try {
      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password, 10);

      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            username,
            password: hashedPassword,
            type: 'portfolio_admin'
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          setError('이미 존재하는 사용자명입니다.');
        } else {
          setError('회원가입 중 오류가 발생했습니다.');
        }
      } else {
        onLoginSuccess(data);
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('type', 'portfolio_admin');

      if (error || !users || users.length === 0) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        // 비밀번호 검증
        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (isPasswordValid) {
          onLoginSuccess(user);
        } else {
          setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isRegisterMode ? '관리자 설정' : '관리자 로그인'}
          </h2>
          {isRegisterMode && (
            <p className="mt-2 text-center text-sm text-gray-600">
              관리자 계정이 존재하지 않습니다. 새로운 관리자 계정을 생성해주세요.
            </p>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={isRegisterMode ? handleRegister : handleLogin}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                사용자명
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="사용자명"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isRegisterMode ? '' : 'rounded-b-md'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isRegisterMode && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? '처리 중...' : isRegisterMode ? '관리자 계정 생성' : '로그인'}
            </button>
          </div>

          {!isRegisterMode && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className="text-indigo-600 hover:text-indigo-500"
              >
                관리자 계정이 없나요? 계정 생성하기
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 