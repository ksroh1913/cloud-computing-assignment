# 개인 소개 페이지 · 프론트엔드–백엔드 연동

HTML로 만든 개인 소개 페이지를 **Vercel**에 배포하고, **Render**에 배포한
FastAPI 백엔드 API를 호출하도록 연결한 클라우드 컴퓨팅 실습 프로젝트입니다.

## 제출 주소

| 제출 항목 | 주소 |
|---|---|
| GitHub 저장소 | https://github.com/ksroh1913/cloud-computing-assignment |
| Vercel 개인 소개·연동 페이지 | https://cloud-computing-assignment-kaist-ksroh.vercel.app |
| Render FastAPI Swagger UI | https://kyeongsoo-profile-api.onrender.com/docs |

## 주요 구성

```text
브라우저
  └─ Vercel: index.html + style.css + app.js
       └─ GET /api/profile
            └─ Render: FastAPI (backend/main.py)
```

- **프론트엔드:** HTML, CSS, JavaScript
- **백엔드:** FastAPI, Uvicorn
- **배포:** Vercel(프론트엔드), Render(백엔드)
- **연동:** 프론트엔드가 Fetch API로 `GET /api/profile` 호출

## 폴더 구조

```text
.
├── index.html              # 개인 소개 및 API 연동 화면
├── style.css               # 반응형 화면 스타일
├── config.js               # 백엔드 API 주소
├── app.js                  # 테마 전환·API 호출
├── backend/
│   ├── main.py             # FastAPI 앱
│   ├── requirements.txt    # 배포용 Python 패키지
│   └── requirements-dev.txt # 로컬 테스트용 패키지
├── tests/
│   └── test_api.py         # API 단위 테스트
├── render.yaml             # Render Blueprint 설정
└── vercel.json             # Vercel 정적 사이트 설정
```

## 로컬 실행

### 1. 백엔드

```bash
cd backend
python -m venv .venv

# Windows PowerShell
.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

- API: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`

### 2. 프론트엔드

프로젝트 루트에서 별도 터미널을 열어 실행합니다.

```bash
python -m http.server 5500
```

브라우저에서 `http://127.0.0.1:5500`을 엽니다.

### 3. API 테스트

프로젝트 루트에서 실행합니다.

```bash
pip install -r backend/requirements-dev.txt
python -m unittest discover -s tests -v
```

## API 명세

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/` | 서비스 기본 정보 |
| GET | `/health` | Render 상태 확인용 |
| GET | `/api/profile` | 프론트엔드에 연동 결과 반환 |

## 배포 방법

### Render 백엔드

1. Render에서 **New → Blueprint**를 선택합니다.
2. 이 GitHub 저장소를 연결합니다.
3. 루트의 `render.yaml` 설정을 확인하고 배포합니다.
4. 생성된 `https://...onrender.com` 주소의 `/docs`가 열리는지 확인합니다.

### Vercel 프론트엔드

1. `config.js`의 `API_BASE_URL`을 위 Render 주소로 바꿉니다.
2. Render의 `ALLOWED_ORIGINS` 환경변수에 Vercel 주소를 입력합니다.
   - 예: `https://프로젝트명.vercel.app`
   - 주소 끝에 `/`는 붙이지 않습니다.
3. Vercel에서 이 GitHub 저장소를 Import합니다.
4. Framework Preset은 **Other**, Root Directory는 저장소 루트(`.`)로 배포합니다.

## CORS 설정

배포 환경에서는 Render 환경변수 `ALLOWED_ORIGINS`에 Vercel 주소를 넣습니다.
여러 주소를 허용할 때는 쉼표로 구분합니다.

```text
https://example.vercel.app,https://www.example.com
```

## 실습 결과

- 개인 소개 페이지를 HTML로 작성했습니다.
- CSS로 반응형 레이아웃과 다크 모드를 구현했습니다.
- JavaScript `fetch()`로 FastAPI API를 호출했습니다.
- 프론트엔드와 백엔드를 서로 다른 클라우드 서비스에 배포하도록 구성했습니다.
- 백엔드의 Swagger UI에서 API를 직접 확인할 수 있습니다.

## 문제 해결 기록

- API 호출이 실패하면 Render 서비스가 `Live` 상태인지 먼저 확인합니다.
- CORS 오류가 나면 `ALLOWED_ORIGINS`의 Vercel 주소가 정확한지 확인합니다.
- Render 무료 인스턴스가 휴면 상태였다면 첫 응답까지 시간이 걸릴 수 있습니다.
