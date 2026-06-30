# AGENTS.md

このリポジトリは、FastAPI と React を使う軽量モノレポテンプレートである。
Clean Architecture の厳密な4層ではなく、`api` / `services` / `repositories` の
3責務に絞って初速と見通しを優先する。

## Backend Rules

- HTTP 処理は `backend/src/api` に置く。
- 業務処理は `backend/src/services` に置く。
- DB 処理は `backend/src/repositories` に置く。
- DB 接続は `backend/src/db.py` に集約する。
- 設定は `backend/src/config.py` に集約し、環境変数は `pydantic-settings` 経由で読む。
- `api` から DB を直接操作しない。
- `api` に業務ロジックを書かない。
- 実テーブルが出るまで `repositories` に先回りした抽象を置かない。

## Frontend Rules

- React / TypeScript / Vite を最小構成で使う。
- API 呼び出しは `frontend/src/lib/api.ts` に集約する。
- API レスポンス型は `frontend/src/types/` に置く。
- 画面コンポーネントから直接 `fetch` を増やさない。
- `any` は避け、`unknown` と型ガードで絞り込む。

## Structure

```text
backend/
  pyproject.toml
  src/
    main.py
    config.py
    db.py
    api/
    services/
    repositories/
    schemas/
  tests/
frontend/
  package.json
  vite.config.ts
  index.html
  src/
    App.tsx
    main.tsx
    components/
    pages/
    hooks/
    lib/
    types/
```

## Commands

### Backend

```bash
cd backend
uv sync
uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
uv run pytest
uv run ruff check .
uv run ruff format --check .
uv run mypy src/
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
pnpm build
```

### Local DB

```bash
docker compose up -d
```

## Notes

- `.env` はコミットしない。必要なキーは `backend/.env.example` を参照し、`backend/.env` にコピーして使う。
- `GET /health` は DB 非依存にし、DB 未起動でも起動確認できるようにする。
- API スキーマをバックエンドとフロントエンド間の型の信頼源にする。
