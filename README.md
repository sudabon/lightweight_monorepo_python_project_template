# lightweight_monorepo_python_project_template

FastAPI と React を最小構成で始めるための軽量モノレポテンプレートです。
Clean Architecture の厳密な4層ではなく、`api` / `services` / `repositories` の
3責務に絞った軽量構成です。

本家 `monorepo_python_project_template` はルール中心で層構成を厳密に保ちたい場合に向いています。
この軽量版は実装中心で、3責務に絞って初速と見通しを優先します。
小規模・初速優先ならこの軽量版を、層の厳密な強制が必要なら本家テンプレートを使います。

## Structure

```text
backend/
  pyproject.toml
  uv.lock
  .env.example
  src/
    main.py
    config.py
    db.py
    api/
      health.py
    services/
      health_service.py
    repositories/
      README.md
    schemas/
      health.py
  tests/
    test_health_service.py
    test_health_api.py
frontend/
  package.json
  pnpm-lock.yaml
  vite.config.ts
  index.html
  src/
    App.tsx
    main.tsx
    index.css
    vite-env.d.ts
    components/
    pages/
    hooks/
    lib/
      api.ts
    types/
      health.ts
docker-compose.yml
```

## Backend

```bash
cd backend
uv sync
uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

Health check:

```bash
curl http://127.0.0.1:8000/health
```

Expected response:

```json
{"status":"ok"}
```

Tests and checks:

```bash
cd backend
uv run pytest
uv run ruff check .
uv run ruff format --check .
uv run mypy src/
```

## Frontend

```bash
cd frontend
pnpm install
pnpm dev
pnpm build
```

Set `VITE_API_BASE_URL` if the backend is not running at `http://localhost:8000`.

## Local DB

PostgreSQL is available through Docker Compose:

```bash
docker compose up -d
```

The health endpoint does not require DB access, so backend startup and tests work without Docker.

## Migration Policy

実テーブルを導入するまでは、Alembic と `backend/migrations/` は置きません。
マイグレーションが必要になった時点で Alembic を追加し、`backend/migrations/` を作成します。

## Environment Variables

ローカル起動時は `cd backend` して実行するため、backend 用の `.env` は `backend/.env` に置く。
`backend/.env.example` を `backend/.env` にコピーして利用する。

| Key | Default example | Purpose |
| --- | --- | --- |
| `APP_ENV` | `development` | Runtime environment name |
| `APP_PORT` | `8000` | Backend port (see note below) |
| `DATABASE_URL` | `postgresql+asyncpg://postgres:postgres@localhost:5432/app` | PostgreSQL connection URL |

`APP_PORT` はアプリケーション設定として保持する。
ローカル起動時の uvicorn ポートは、起動コマンドの `--port` で指定する。

## Development Rules

- HTTP concerns belong in `backend/src/api`.
- Business logic belongs in `backend/src/services`.
- DB access belongs in `backend/src/repositories`.
- DB setup belongs in `backend/src/db.py`.
- Settings belong in `backend/src/config.py`.
- Frontend API calls belong in `frontend/src/lib/api.ts`.
- Frontend response types belong in `frontend/src/types/`.
