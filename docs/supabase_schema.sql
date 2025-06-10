-- 1. 프로필 기본 정보 테이블
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT, -- 자기소개
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 경력사항 테이블
CREATE TABLE careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE, -- NULL이면 현재 재직중
    job_description TEXT,
    position VARCHAR(100), -- 직책
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 프로젝트 테이블
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    project_name VARCHAR(200) NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    technologies TEXT[], -- 사용 기술 스택 (배열로 저장)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 성능 최적화를 위한 인덱스 생성
CREATE INDEX idx_careers_profile_id ON careers(profile_id);
CREATE INDEX idx_projects_career_id ON projects(career_id);
CREATE INDEX idx_profiles_email ON profiles(email);

-- updated_at 자동 업데이트를 위한 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_careers_updated_at
    BEFORE UPDATE ON careers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();