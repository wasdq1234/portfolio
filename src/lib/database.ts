import { supabase } from './supabase';
import { Profile, Career, Project, ProfileWithCareers } from '@/types/database';

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function getCareers(): Promise<Career[]> {
  const { data, error } = await supabase
    .from('careers')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching careers:', error);
    return [];
  }

  return data || [];
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

export async function getProfileWithCareers(): Promise<ProfileWithCareers | null> {
  // 프로필 정보 가져오기
  const profile = await getProfile();
  if (!profile) return null;

  // 경력 정보 가져오기 (프로젝트 포함)
  const { data: careers, error } = await supabase
    .from('careers')
    .select(`
      *,
      projects (*)
    `)
    .eq('profile_id', profile.id)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching careers with projects:', error);
    return { ...profile, careers: [] };
  }

  return {
    ...profile,
    careers: careers || []
  };
} 