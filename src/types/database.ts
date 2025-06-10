export interface Profile {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Career {
  id: string;
  profile_id: string;
  company_name: string;
  start_date: string;
  end_date: string | null;
  job_description: string | null;
  position: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  career_id: string;
  project_name: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  technologies: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface CareerWithProjects extends Career {
  projects: Project[];
}

export interface ProfileWithCareers extends Profile {
  careers: CareerWithProjects[];
} 