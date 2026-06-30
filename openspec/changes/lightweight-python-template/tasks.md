## 1. バックエンド軽量構成の新設

- [x] 1.1 `backend/pyproject.toml` を作成（FastAPI / uvicorn / pydantic-settings / SQLAlchemy[async] / asyncpg、dev: pytest / ruff / mypy。`src` レイアウト設定）
- [x] 1.2 `backend/src/config.py` を作成（`pydantic-settings` で `APP_ENV` / `APP_PORT` / `DATABASE_URL` を読み込む Settings）
- [x] 1.3 `backend/src/db.py` を作成（SQLAlchemy async エンジン／セッション factory を `config` から構築。health では未使用でよい）
- [x] 1.4 `backend/src/schemas/health.py` を作成（`HealthResponse` Pydantic モデル: `status: str`）と `schemas/__init__.py`
- [x] 1.5 `backend/src/services/health_service.py` を作成（状態判定を担う `HealthService.check()` 等が `status="ok"` を返す）と `services/__init__.py`
- [x] 1.6 `backend/src/api/health.py` を作成（`GET /health` ルーターが `services` を呼び出し `{"status":"ok"}` を返す）と `api/__init__.py`
- [x] 1.7 `backend/src/main.py` を作成（FastAPI アプリ生成し health ルーターを登録）
- [x] 1.8 `backend/src/repositories/README.md` を作成（実テーブル出現時に追加する方針を明記）と `repositories/__init__.py`
- [x] 1.9 `backend/migrations/.gitkeep` を作成

## 2. バックエンドのテストと検証

- [x] 2.1 `backend/tests/arch/` を削除（`test_dependency_rule.py` / `test_source_structure.py`）
- [x] 2.2 `backend/tests/test_health_service.py` を作成（`health_service` のユニットテスト: `status == "ok"`）と `tests/__init__.py`
- [x] 2.3 `cd backend && uv sync` で依存解決し `uv.lock` を生成・コミット対象にする
- [x] 2.4 `uv run pytest` が成功することを確認
- [x] 2.5 `uv run uvicorn src.main:app --reload` で起動し `GET /health` が `{"status":"ok"}`（200）を返すことを確認
- [x] 2.6 `uv run ruff check .` / `uv run ruff format --check .` を通す

## 3. フロントエンド雛形の新設

- [x] 3.1 `frontend/package.json` / `vite.config.ts` / `index.html` を作成（React + TypeScript + Vite、pnpm 前提）
- [x] 3.2 `frontend/src/main.tsx` / `App.tsx` と `components/` / `pages/` / `hooks/` / `lib/` / `types/` ディレクトリを作成
- [x] 3.3 `frontend/src/lib/api.ts` に API 呼び出し基盤を集約、`frontend/src/types/` に health レスポンス型を配置
- [x] 3.4 `cd frontend && pnpm install` で `pnpm-lock.yaml` を生成し、`pnpm build` が成功することを確認

## 4. 開発環境ファイル

- [x] 4.1 ルート `docker-compose.yml` を作成（PostgreSQL のみ、`5432` 公開、volume 永続化）
- [x] 4.2 ルート `.env.example` を作成（`APP_ENV` / `APP_PORT` / `DATABASE_URL`、asyncpg 形式の例）
- [x] 4.3 `.gitignore` を整備（`__pycache__` / `.venv` / `node_modules` / ビルド成果物 / `.env` / ツールキャッシュ）

## 5. ドキュメントとエージェント規約の軽量版更新

- [x] 5.1 `AGENTS.md` を軽量版（3責務 api/services/repositories）に全面書き換え（Backend rules / Frontend rules / Commands）
- [x] 5.2 `README.md` を軽量版に全面書き換え（概要・構成・起動方法・テスト・開発ルール・環境変数、`todo_app` 参照を排除）
- [x] 5.3 `.claude/rules/`・`.codex/rules/`・`.cursor/rules/` を軽量版へ更新（`architecture.md` の4層強制を削除/置換、3エージェント間で内容を一致させる）
- [x] 5.4 `.claude/rules/backend-conventions.md` 等の4層前提記述を3責務向けに更新、`templates.md`（entity/usecase/viewmodel テンプレート）を軽量版テンプレートに差し替えまたは削除
- [x] 5.5 `CLAUDE.md` の `@AGENTS.md` 参照は維持しつつ整合を確認

## 6. 完了条件の点検

- [x] 6.1 リポジトリ全文を `domain|application|interfaces|infrastructure|todo_app` で grep し、ガイド由来の説明箇所を除き 0 件であることを確認
- [x] 6.2 `backend/tests/arch/` が存在しないことを確認
- [x] 6.3 ガイド12章 Python版の完了条件（README/AGENTS 整備、health 動作、pytest 成功、arch テスト削除、`todo_app` 不在、名称揺れ解消）をすべて点検
- [ ] 6.4 変更をコミット（コミットメッセージは日本語・`feat:`/`refactor:` 等のプレフィックス、1関心事単位で分割）

## 7. GitHub テンプレートとして公開（要ユーザー承認）

- [ ] 7.1 リポジトリ可視性（public/private）とリモート（既存 origin / 新規作成）をユーザーに確認
- [ ] 7.2 リモートへ push（実行前に内容を提示し承認を得る）
- [ ] 7.3 `gh repo edit --template` でテンプレートフラグを有効化し、GitHub 上で "Template repository" / "Use this template" が有効になったことを確認
