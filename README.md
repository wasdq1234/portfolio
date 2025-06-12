# 포트폴리오 웹사이트

Next.js와 Supabase를 활용한 개인 포트폴리오 웹사이트입니다.

## 🚀 기능

- **프로필 정보 표시**: 개인 정보 및 자기소개
- **경력사항 관리**: 회사별 경력 및 담당 업무 표시
- **프로젝트 목록**: 경력별 수행 프로젝트 및 기술 스택
- **AI 어시스턴트 채팅**: 실시간 스트리밍 채팅 기능 (백엔드 서버 연동)
- **관리자 대시보드**: 포트폴리오 데이터 CRUD 관리 시스템
- **관리자 인증**: 보안 로그인 및 회원가입 기능

## 🛠 기술 스택

- **Frontend**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Authentication**: bcryptjs
- **UI Framework**: React 19

## 📦 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
`.env.example` 파일을 복사하여 `.env.local` 파일을 생성하고 필요한 정보를 입력하세요:
```bash
cp .env.example .env.local
```
그리고 `.env.local` 파일에 실제 정보를 입력하세요:
```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# AI 어시스턴트 채팅 백엔드 서버 설정
NEXT_PUBLIC_AI_CHAT_API_URL=your_ai_chat_backend_url_here
```

3. 데이터베이스 스키마 적용:
`docs/supabase_schema.sql` 파일의 SQL을 Supabase에서 실행하세요.

4. 개발 서버 실행:
```bash
npm run dev
```

## 🚀 사용 가능한 스크립트

```bash
npm run dev      # 개발 서버 실행 (Turbopack 사용)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── admin/
│   │   └── page.tsx        # 관리자 페이지
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 페이지
│   ├── favicon.ico         # 파비콘
│   └── globals.css         # 전역 스타일
├── components/
│   ├── Portfolio.tsx       # 포트폴리오 메인 컴포넌트
│   ├── ProfileSection.tsx  # 프로필 섹션
│   ├── CareerSection.tsx   # 경력 섹션
│   ├── ChatInterface.tsx   # AI 채팅 인터페이스 (실시간 스트리밍)
│   ├── AdminLogin.tsx      # 관리자 로그인 컴포넌트
│   └── AdminDashboard.tsx  # 관리자 대시보드 컴포넌트
├── lib/
│   ├── supabase.ts         # Supabase 클라이언트 설정
│   └── database.ts         # 데이터베이스 조회 함수들
└── types/
    ├── database.ts         # 데이터베이스 타입 정의
    └── chat.ts             # 채팅 관련 타입 정의
```

## 🗃 데이터베이스 스키마

- **profiles**: 기본 프로필 정보 (이름, 이메일, 주소, 전화번호, 자기소개)
- **careers**: 경력사항 (회사, 기간, 직책, 업무 설명)
- **projects**: 프로젝트 정보 (이름, 기간, 설명, 기술 스택)
- **users**: 관리자 계정 정보 (인증 및 권한 관리)

## 📝 사용법

### 기본 설정
1. Supabase에 데이터베이스 스키마를 적용합니다.
2. 개발 서버를 실행합니다.
3. 메인 페이지에서 포트폴리오 정보를 확인할 수 있습니다.

### 관리자 기능
1. `/admin` 경로로 접속합니다.
2. 최초 접속 시 관리자 계정을 생성합니다.
3. 로그인 후 대시보드에서 다음 기능을 사용할 수 있습니다:
   - 프로필 정보 관리 (추가, 수정, 삭제)
   - 경력사항 관리 (추가, 수정, 삭제)
   - 프로젝트 관리 (추가, 수정, 삭제)

### AI 채팅 기능
1. 우측 영역의 채팅 인터페이스를 사용합니다.
2. AI 백엔드 서버 URL이 설정된 경우 실시간 대화가 가능합니다.
3. 포트폴리오 내용에 대한 질문을 할 수 있습니다.

## 🔮 향후 계획

- ✅ AI 어시스턴트 채팅 기능 구현 완료
- ✅ 관리자 페이지 추가 완료
- 🔄 다크 모드 지원
- 🔄 SEO 최적화
- 🔄 반응형 디자인 개선
