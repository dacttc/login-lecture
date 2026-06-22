# Beauty Salon Reservation Platform

미용실/헤어샵을 위한 예약 및 매장 관리 웹 애플리케이션입니다. 사용자는 매장을 검색하고 서비스/디자이너/시간을 선택해 예약 요청을 보낼 수 있으며, 매장 관리자는 예약 요청, 서비스, 휴무일, 매장 정보, 소식과 리뷰를 관리할 수 있습니다.

## Screenshots

### Login
![Login screen](docs/screenshots/login.png)

### Register
![Register screen](docs/screenshots/register.png)

관리자/예약 화면은 MySQL 샘플 데이터 연결 후 추가 캡처 예정입니다.

## Tech Stack

- Runtime: Node.js
- Server: Express
- View: EJS
- Database: MySQL, mysql2
- Authentication: bcryptjs, JWT, cookie-parser
- OAuth: Kakao OAuth
- Upload: multer
- HTTP Client: axios
- Deployment: AWS Elastic Beanstalk, nginx reverse proxy

## Main Features

- 일반 회원가입 및 로그인
- Kakao OAuth 로그인
- JWT cookie 기반 인증
- 매장 소개 페이지
- 매장 검색 및 위치 기반 목록 조회
- 서비스/시술 메뉴 관리
- 디자이너별 예약 화면
- 예약 요청 등록, 승인, 거절, 삭제
- 휴무일 설정
- 리뷰, 댓글, 소식 관리
- 이미지 업로드 기반 매장 정보 수정

## Project Structure

```text
.
├── app.js
├── package.json
├── .ebextensions/
│   └── nodecommand.config
├── database/
│   └── schema.sql
├── docs/
│   └── screenshots/
├── src/
│   ├── bin/
│   ├── config/
│   ├── models/
│   ├── public/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   └── views/
└── .env.example
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

`.env.example`을 참고해 `.env`를 생성합니다.

```bash
PORT=8080
NODE_ENV=development
JWT_SECRET=replace-with-a-long-random-secret
DB_HOST=localhost
DB_USER=root
DB_PSWORD=password
DB_DATABASE=beauty_salon
KAKAOMAP_KEY=your-kakao-rest-api-key
REDIRECTION=http://localhost:8080/oauth
ALLOW_LEGACY_CLIENT_SQL=false
```

운영 환경에서는 `JWT_SECRET`을 반드시 길고 예측 불가능한 값으로 설정해야 합니다.

### 3. Create database schema

```bash
mysql -u root -p < database/schema.sql
```

`database/schema.sql`은 기존 코드에서 사용 중인 테이블과 컬럼을 기준으로 복원한 초기 스키마입니다. 실제 운영 데이터나 상세 제약 조건은 별도 마이그레이션으로 보완할 수 있습니다.

### 4. Run

```bash
npm start
```

브라우저에서 `http://localhost:8080` 또는 `http://localhost:8080/login`으로 접속합니다.

## Security Cleanup

포트폴리오 공개를 위해 다음 항목을 정리했습니다.

- JWT secret 하드코딩 제거 및 `JWT_SECRET` 환경변수 사용
- 로그인 성공 시에만 JWT cookie 발급
- cookie 옵션에 `httpOnly`, `sameSite`, 운영 환경 `secure` 적용
- 비밀번호 평문/해시 로그 제거
- 특정 ID 로그인 우회 로직 제거
- 클라이언트 SQL 직접 실행 기본 차단
- 업로드 라우트 인증 추가
- 업로드 파일 확장자와 크기 제한 추가
- `node_modules`, `.env` Git 제외
- `npm audit` 취약점 0개 상태로 업데이트

## Legacy SQL Endpoint

초기 구현에서는 일부 프론트 코드가 SQL 문자열을 서버로 전달하는 구조가 있었습니다. SQL Injection 위험이 크기 때문에 현재는 기본적으로 차단되어 있습니다.

```bash
ALLOW_LEGACY_CLIENT_SQL=false
```

기존 화면을 임시로 확인해야 하는 경우에만 개발 환경에서 `true`로 바꿀 수 있습니다. 운영 환경에서는 기능별 API로 분리하는 방식이 권장됩니다.

## Deployment Notes

`.ebextensions/nodecommand.config`에는 Elastic Beanstalk 배포 시 의존성 설치와 nginx reverse proxy 설정이 포함되어 있습니다. nginx는 80번 포트 요청을 Node 앱의 8080 포트로 프록시합니다.

배포 시 AWS Elastic Beanstalk 환경 변수에 다음 값을 설정합니다.

- `PORT`
- `NODE_ENV`
- `JWT_SECRET`
- `DB_HOST`
- `DB_USER`
- `DB_PSWORD`
- `DB_DATABASE`
- `KAKAOMAP_KEY`
- `REDIRECTION`

## Portfolio Talking Points

- Express/EJS 기반 서버 렌더링 애플리케이션 구현
- MySQL 기반 예약, 리뷰, 매장 관리 데이터 모델링
- bcrypt + JWT cookie 인증 흐름 구현
- Kakao OAuth 로그인 연동
- multer 기반 이미지 업로드 처리
- AWS Elastic Beanstalk 배포 설정 경험
- 오래된 프로젝트를 다시 분석하고 보안 취약점을 정리한 리팩터링 경험

## Future Improvements

- 기능별 컨트롤러/서비스 레이어 분리
- 프론트의 legacy SQL 요청을 명시적인 REST API로 전환
- DB migration 도구 도입
- 테스트 코드 추가
- 관리자/예약 화면 샘플 데이터와 스크린샷 보강
- 깨진 주석 및 오래된 UI 코드 정리
