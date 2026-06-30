## Why

このリポジトリ（`lightweight_monorepo_python_project_template`）は名称こそ「軽量版」だが、中身は厳密な Clean Architecture 4層構成（`domain / app / interface / infra`）を前提とした規約・README・アーキテクチャテストのみで、実コードや frontend、起動環境は未配置である。さらに、依存検査側のレイヤー名（`application / interfaces / infrastructure`）と構造検査側のフォルダ名（`app / interface / infra`）に名称揺れがあり、`todo_app` というサンプル固有名も残っている。`lightweight_template_implementation_guide.md` の Python版仕様（5章・12章）に従ってこのリポジトリを実際に軽量化し、すぐ使える GitHub テンプレートとして公開する。

## What Changes

- **BREAKING** 厳密な4層 Clean Architecture（`domain / app / interface / infra`）の強制をやめ、`api` / `services` / `repositories` / `schemas` の3責務＋スキーマに整理する。
- **BREAKING** アーキテクチャテスト（`backend/tests/arch/test_dependency_rule.py` / `test_source_structure.py`）を削除し、ディレクトリ構造・依存方向をテストで強制しない。責務分離ルールは `AGENTS.md` に明文で残す。
- `todo_app` 固有名、および `domain/app/interface/infra` と `application/interfaces/infrastructure` の名称揺れを完全に排除する。
- FastAPI バックエンドの軽量雛形を新設する（`backend/src/` 配下に `main.py` / `config.py` / `db.py` / `api/health.py` / `services/health_service.py` / `repositories/README.md` / `schemas/health.py`、`pyproject.toml`、`backend/migrations/.gitkeep`）。
- `GET /health` が `{"status":"ok"}` を返す実装と、`services` のユニットテスト（`backend/tests/test_health_service.py`）を追加する。
- React + TypeScript + Vite のフロントエンド雛形（`frontend/` 配下に `package.json` / `vite.config.ts` / `index.html` / `src/`）を新設し、API 呼び出しは `src/lib/api.ts` に集約する。
- PostgreSQL 想定の開発環境ファイル（ルート `docker-compose.yml`、`.env.example`）を追加し、`.gitignore` を整備する。
- README.md / AGENTS.md と各エージェント規約（`.claude/rules/`・`.codex/rules/`・`.cursor/rules/`）を軽量版（3責務）向けに全面的に書き換える。
- このリポジトリを GitHub の「テンプレートリポジトリ」として登録（公開）する。

## Capabilities

### New Capabilities
- `lightweight-backend`: FastAPI を `api`/`services`/`repositories`/`schemas` の3責務＋スキーマに整理した軽量バックエンド構成。`GET /health` の実装、`config.py`/`db.py` への設定・DB接続集約、`services` の最低限ユニットテスト、`pyproject.toml` を含む。
- `frontend-scaffold`: React + TypeScript + Vite のフロントエンド雛形。`src/lib/api.ts` への API 集約、`src/types/` への型配置を含む最小構成。
- `dev-environment`: PostgreSQL 想定のローカル開発環境。ルート `docker-compose.yml`（postgres のみ）、`.env.example`、`.gitignore` を含む。
- `agent-conventions`: 軽量版（3責務）向けに書き換えた README.md / AGENTS.md とエージェント規約（`.claude`/`.codex`/`.cursor`）。アーキテクチャテストと4層強制ルールの削除を含む。
- `github-template-publish`: このリポジトリを GitHub のテンプレートリポジトリとして登録・公開する手順。

### Modified Capabilities
<!-- 既存の openspec/specs/ は空のため、要件変更対象の既存 capability はなし。 -->

## Impact

- **削除**: `backend/tests/arch/test_dependency_rule.py`、`backend/tests/arch/test_source_structure.py`、4層強制を含むルール記述。
- **全面書き換え**: `README.md`、`AGENTS.md`、`.claude/rules/architecture.md`・`.claude/rules/backend-conventions.md`・`.claude/rules/templates.md`・`.claude/rules/testing.md`（および `.codex/rules/`・`.cursor/rules/` の対応ファイル）、`CLAUDE.md`（`AGENTS.md` 参照は維持）。
- **新規追加**: `backend/src/`（FastAPI 軽量構成一式）、`backend/pyproject.toml`、`backend/migrations/.gitkeep`、`backend/tests/test_health_service.py`、`frontend/`（React+TS+Vite 雛形一式）、ルート `docker-compose.yml`、`.env.example`。
- **依存関係**: backend に FastAPI / uvicorn / pydantic-settings / SQLAlchemy(async) / pytest / ruff / mypy。frontend に React / TypeScript / Vite。
- **外部操作**: `gh` CLI による GitHub テンプレートリポジトリ登録（リモート公開を伴うため実行前に確認）。
- `lightweight_template_implementation_guide.md` は実装ガイドとして本リポジトリに残す（Go版仕様は本変更のスコープ外）。
