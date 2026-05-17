# Panorama Studio

아파트 커뮤니티 시설 벽면 프로젝션용 AI 파노라마 이미지 생성 웹앱입니다.

텍스트 프롬프트 → Blockade Labs AI 생성 → Three.js 360° 미리보기 → 다운로드 워크플로우를 제공합니다.

## 주요 기능

- **텍스트 입력** – 한국어 프롬프트로 원하는 장면 묘사
- **분위기 태그** – 자연 / 도시 / 추상 / 사계절 / 시간대 빠른 선택
- **스타일 선택** – 사실적 / 애니메이션 / 디지털 아트
- **360° 뷰어** – Three.js 구체 뷰어, 마우스 드래그 회전 + 자동 회전
- **다운로드** – 4096×2048 equirectangular 원본 파일
- **생성 히스토리** – 최근 5개 localStorage 저장, 썸네일 클릭으로 재열람

## 파일 구조

```
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (메타데이터, 다크 배경)
│   ├── page.tsx            # 메인 페이지 (입력→로딩→결과 상태 관리)
│   ├── globals.css
│   └── api/
│       └── generate/
│           └── route.ts    # Blockade Labs API 프록시 (POST: 생성 시작, GET: 상태 폴링)
├── components/
│   ├── InputPanel.tsx      # 프롬프트 입력 + 스타일 선택 패널
│   ├── MoodTags.tsx        # 분위기 태그 버튼 모음
│   ├── LoadingView.tsx     # 대기 화면 (진행바 + 경과 시간)
│   ├── ResultView.tsx      # 결과 화면 (뷰어 + 다운로드)
│   ├── PanoramaViewer.tsx  # Three.js 360° 구체 뷰어
│   └── HistoryPanel.tsx    # 최근 생성 이력 패널
├── lib/
│   └── blockade.ts         # Blockade Labs API 클라이언트
├── .env.local.example      # 환경변수 템플릿
└── next.config.mjs
```

## 환경변수 설정

1. `.env.local.example`을 복사해 `.env.local` 생성:

```bash
cp .env.local.example .env.local
```

2. `.env.local`에 API 키 입력:

```env
BLOCKADE_API_KEY=your_api_key_here
```

API 키는 [Blockade Labs](https://skybox.blockadelabs.com/) 계정에서 발급받을 수 있습니다.

> **보안**: `.env.local`은 `.gitignore`에 포함되어 있어 절대 커밋되지 않습니다. API 키는 서버 사이드(`app/api/`)에서만 사용하며 클라이언트에 노출되지 않습니다.

## 실행 방법

### 개발 서버

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속.

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 사용 방법

1. **분위기 태그** 클릭으로 프롬프트 자동 완성 (중복 클릭 시 이어서 추가)
2. **프롬프트 텍스트박스**에 원하는 장면 직접 입력 (비워두면 기본값 사용)
3. **스타일** 선택 (사실적 / 애니메이션 / 디지털 아트)
4. **파노라마 생성** 버튼 클릭 → 30~90초 대기
5. 결과 화면에서 **마우스 드래그**로 360° 탐색
6. **다운로드** 버튼으로 원본 파일 저장

## 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 스타일링 | Tailwind CSS |
| 3D 뷰어 | Three.js |
| AI 이미지 생성 | Blockade Labs Skybox API |
| 상태 저장 | localStorage (히스토리 최근 5개) |

## API 정보

### POST /api/generate

Blockade Labs에 이미지 생성을 요청합니다.

**요청 본문**:
```json
{
  "prompt": "봄날 오후, 벚꽃이 흩날리는 한강 공원",
  "style": "realistic"
}
```
`style`: `"realistic"` | `"anime"` | `"digital-art"`

**응답**:
```json
{ "jobId": 12345 }
```

### GET /api/generate?jobId=12345

생성 작업 상태를 폴링합니다.

**응답**:
```json
{
  "id": 12345,
  "status": "complete",
  "file_url": "https://...",
  "error_message": null
}
```
`status`: `"pending"` | `"processing"` | `"complete"` | `"error"`
