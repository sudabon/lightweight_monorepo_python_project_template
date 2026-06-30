# lightweight_monorepo_python_project_template

FastAPI と React を最小構成で始めるための軽量モノレポテンプレートです。
Clean Architecture の厳密な4層ではなく、`api` / `services` / `repositories` の
3責務に絞った軽量構成です。

## Structure

```text
backend/
  pyproject.toml
  migrations/
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
frontend/
  package.json
  vite.config.ts
  index.html
  src/
    App.tsx
    main.tsx
    lib/
      api.ts
    types/
      health.ts
docker-compose.yml
.env.example
```

## Backend

```bash
cd backend
uv sync
uv run uvicorn src.main:app --reload
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

## Environment Variables

Copy `.env.example` to `.env` when local overrides are needed.

| Key | Default example | Purpose |
| --- | --- | --- |
| `APP_ENV` | `development` | Runtime environment name |
| `APP_PORT` | `8000` | Backend port |
| `DATABASE_URL` | `postgresql+asyncpg://postgres:postgres@localhost:5432/app` | PostgreSQL connection URL |

## Development Rules

- HTTP concerns belong in `backend/src/api`.
- Business logic belongs in `backend/src/services`.
- DB access belongs in `backend/src/repositories`.
- DB setup belongs in `backend/src/db.py`.
- Settings belong in `backend/src/config.py`.
- Frontend API calls belong in `frontend/src/lib/api.ts`.
- Frontend response types belong in `frontend/src/types/`.
