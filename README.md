# 포트폴리오 웹사이트

Next.js와 Supabase를 활용한 개인 포트폴리오 웹사이트입니다.

## 🚀 기능

- **프로필 정보 표시**: 개인 정보 및 자기소개
- **경력사항 관리**: 회사별 경력 및 담당 업무 표시
- **프로젝트 목록**: 경력별 수행 프로젝트 및 기술 스택
- **AI 어시스턴트 채팅**: 우측 영역에 채팅 인터페이스 (UI만 구현, 기능은 추후 개발)

## 🛠 기술 스택

- **Frontend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📦 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
`.env.example` 파일을 복사하여 `.env.local` 파일을 생성하고 Supabase 정보를 입력하세요:
```bash
cp .env.example .env.local
```
그리고 `.env.local` 파일에 실제 Supabase 정보를 입력하세요:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

3. 데이터베이스 스키마 적용:
`docs/supabase_schema.sql` 파일의 SQL을 Supabase에서 실행하세요.

4. 개발 서버 실행:
```bash
npm run dev
```

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   └── page.tsx            # 메인 페이지
├── components/
│   ├── Portfolio.tsx       # 포트폴리오 메인 컴포넌트
│   ├── ProfileSection.tsx  # 프로필 섹션
│   ├── CareerSection.tsx   # 경력 섹션
│   └── ChatInterface.tsx   # AI 채팅 UI 컴포넌트
├── lib/
│   ├── supabase.ts         # Supabase 클라이언트 설정
│   └── database.ts         # 데이터베이스 조회 함수들
└── types/
    └── database.ts         # 타입 정의
```

## 🗃 데이터베이스 스키마

- **profiles**: 기본 프로필 정보
- **careers**: 경력사항 (회사, 기간, 직책, 업무 설명)
- **projects**: 프로젝트 정보 (이름, 기간, 설명, 기술 스택)

## 📝 사용법

1. Supabase에 데이터베이스 스키마를 적용합니다.
2. profiles, careers, projects 테이블에 데이터를 입력합니다.
3. 웹사이트에서 포트폴리오 정보를 확인할 수 있습니다.

## 🔮 향후 계획

- AI 어시스턴트 채팅 기능 구현
- 관리자 페이지 추가
- 다크 모드 지원
- SEO 최적화
