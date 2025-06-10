# 포트폴리오 프로젝트 계획

## 📋 프로젝트 개요
Next.js와 Supabase를 활용한 개인 포트폴리오 웹사이트 구축

## 🎯 주요 기능
1. **프로필 정보 표시**: 개인 정보, 자기소개
2. **경력사항 표시**: 회사별 경력 및 담당 업무
3. **프로젝트 목록**: 경력별 수행 프로젝트 및 기술 스택
4. **AI 어시스턴트 채팅 UI**: 우측 영역에 채팅 인터페이스 (기능은 추후 개발)

## 🛠 기술 스택
- **Frontend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

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
│   ├── ProjectSection.tsx  # 프로젝트 섹션
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

## 📝 개발 단계
1. ✅ Next.js 프로젝트 초기화
2. ✅ Supabase 설정 및 연동
3. ✅ 타입 정의 생성
4. ✅ 데이터 조회 함수 구현
5. ✅ UI 컴포넌트 개발
6. ✅ 레이아웃 구성 및 통합
7. 🔄 AI 채팅 기능 구현 (추후)

## 🎨 UI/UX 설계
- **반응형 디자인**: 모바일/태블릿/데스크톱 대응
- **좌측 영역**: 포트폴리오 콘텐츠 (프로필, 경력, 프로젝트)
- **우측 영역**: AI 어시스턴트 채팅 인터페이스
- **깔끔한 디자인**: 가독성과 사용성 중심
