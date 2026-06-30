## Context

現リポジトリは「軽量版」を名乗りつつ、実体は厳密な4層 Clean Architecture を前提とした規約・README・アーキテクチャテストのみで構成されている。具体的には次の状態である。

- `backend/` は `tests/arch/test_dependency_rule.py` と `test_source_structure.py` の2ファイルのみ。実装コード・`pyproject.toml`・`frontend/`・起動環境（docker-compose, .env）は未配置。
- アーキテクチャテストに名称揺れがある: 構造検査は `domain/app/interface/infra`、依存検査は `application/interfaces/infrastructure` を参照し、両者が一致しない。さらに Python パッケージ名 `todo_app` をハードコードしている。
- `README.md`・`AGENTS.md`・`.claude|.codex|.cursor/rules/` が4層構成を前提に書かれている。

`lightweight_template_implementation_guide.md`（特に 5章 Python版・12章 完了条件）が唯一の信頼できる仕様であり、本変更はこのガイドの Python版を**この既存リポジトリに対して**適用し、最終的に GitHub テンプレートリポジトリとして公開する。Go版（4章）はスコープ外。

制約: ユーザーのプロジェクト規約（結論ファースト、シンプル第一、影響最小化、テストで動作証明）。リモート公開（push / テンプレート化）は実行前にユーザー確認が必要。

## Goals / Non-Goals

**Goals:**

- ガイド 5.1 の Python版ディレクトリ構成を実体として作る（`api`/`services`/`repositories`/`schemas` ＋ `config.py`/`db.py`/`main.py`）。
- `GET /health` が `{"status":"ok"}` を返し、`uv run pytest` が通る、起動可能なテンプレートにする。
- React + TypeScript + Vite の最小フロントエンド雛形を置く。
- PostgreSQL 想定の `docker-compose.yml` と `.env.example` を用意する。
- README.md / AGENTS.md / 各エージェント規約を軽量版へ全面更新し、アーキテクチャテストと4層強制・`todo_app`・名称揺れを排除する。
- リポジトリを GitHub テンプレートとして公開する。

**Non-Goals:**

- Go版テンプレート（ガイド4章）の作成。
- 実テーブル・実 repository 実装・マイグレーション本体の作成（`repositories/` は README のみ、`migrations/` は空置き場）。
- 認証・通知・外部サービス連携・CLI 等の機能追加。
- TanStack Query / Shadcn/ui / TailwindCSS の必須化（任意導入に留める）。
- 既存テンプレート（`monorepo_python_project_template`）からの物理コピー作業（本リポジトリを直接整える方針）。

## Decisions

### D1: 既存リポジトリを直接軽量化する（新規リポジトリを切らない）

ガイドの文面は「新規リポジトリ作成」だが、本リポジトリ名が既に `lightweight_monorepo_python_project_template` であり、中身も雛形段階のため、新規作成せず**このリポジトリを直接整える**。これにより履歴・openspec 運用を一本化できる。GitHub テンプレート化はこのリポジトリに対して行う。
- 代替案: 別リポジトリを新規作成 → 履歴・openspec 二重管理になり、本リポジトリの存在意義が曖昧になるため不採用。

### D2: バックエンドのレイヤー命名は `api`/`services`/`repositories`/`schemas` に統一

ガイド 5.3 の指定どおり統一し、名称揺れ（`domain/app/interface/infra` ⇄ `application/interfaces/infrastructure`）を根絶する。`config.py`・`db.py` は `src/` 直下に置く（ガイド 5.1）。
- 代替案: 4層を温存しつつ薄くする → ガイドの主目的（軽量化・名称揺れ解消）に反するため不採用。

### D3: 責務分離はテストではなくドキュメントで担保

アーキテクチャテスト（`tests/arch/`）は削除し、「api から DB を触らない」「api に業務ロジックを書かない」等の責務ルールは `AGENTS.md` と各エージェント規約に明文で残す（ガイド 5.4 / P-7）。初速優先と将来の Clean Architecture 化余地の両立を狙う。
- 代替案: 軽量版用に arch テストを書き直す → 強制を残すことになりガイド方針に反する。不採用。

### D4: health の3責務分離を最小実装で示す

`api/health.py`（ルーター）→ `services/health_service.py`（状態判定）→ `schemas/health.py`（レスポンス Pydantic モデル）の流れを最小実装で示し、テンプレート利用者が責務分離のパターンを写経できるようにする。`repositories/` は呼ばない（health は DB 非依存）が、README で「実テーブル出現時に追加」と明記する。

### D5: DB 接続は用意するが health では未使用

`db.py`（SQLAlchemy async エンジン/セッション factory）と `config.py`（`pydantic-settings`）を用意するが、`GET /health` は DB に依存させない。これにより DB 未起動でもテンプレートが起動・テスト可能。`DATABASE_URL` は `.env.example` に asyncpg 形式で例示する。
- 代替案: health を DB ping にする → DB 起動必須になりテンプレートの初速を損なうため不採用。

### D6: フロントエンドは Vite 公式 React-TS 最小構成 + `lib/api.ts` 集約

`pnpm` を採用し、`src/lib/api.ts` に fetch 基盤を集約、`src/types/` に API 型を置く。TanStack Query / Tailwind / Shadcn は導入しない（任意）。lockfile（`pnpm-lock.yaml`）はガイド構成に含まれるが、生成は `pnpm install` 実行に委ねる。

### D7: GitHub テンプレート化は最終ステップ・要確認

すべての検証（pytest 成功、health 応答、ビルド成功、不要語の不在）が済んだ後、`gh repo edit --template`（または作成時 push）でテンプレートフラグを有効化する。push・公開・テンプレート化は外向き操作のため、実行直前にユーザーへ対象・可視性を提示して承認を得る。

## Risks / Trade-offs

- **[責務分離をテストで強制しないため逸脱しうる]** → `AGENTS.md`・各エージェント規約に明確な禁止事項を残し、README にも記載してレビュー時の指針にする。
- **[名称揺れ・`todo_app` の取り残し]** → 完了前に `domain|application|interfaces|infrastructure|todo_app` をリポジトリ全文 grep し、ガイド由来の説明箇所を除き 0 件であることを検証（spec のシナリオ化済み）。
- **[lockfile 未コミットで再現性低下]** → `uv.lock` / `pnpm-lock.yaml` は `uv sync` / `pnpm install` 実行で生成しコミットする。CI 無しでも手元で `pytest` / `pnpm build` を実行して動作を証明する。
- **[GitHub テンプレート化が破壊的・外向き操作]** → D7 のとおり最終ステップに隔離し、ユーザー承認を必須にする。リポジトリ可視性（public/private）も事前確認。
- **[3エージェント規約の内容ドリフト]** → `.claude`/`.codex`/`.cursor` の同種ファイルは同一の軽量版内容で揃え、矛盾が無いことを確認する。

## Migration Plan

1. backend 雛形を新設（`src/` 一式・`pyproject.toml`・`migrations/.gitkeep`）。
2. `tests/arch/` を削除し、`tests/test_health_service.py` を追加。`uv sync` → `uv run pytest` で検証。
3. frontend 雛形を新設し、`pnpm install` → `pnpm build` で検証。
4. ルートに `docker-compose.yml` / `.env.example` を追加、`.gitignore` を整備。
5. README.md / AGENTS.md / `.claude|.codex|.cursor/rules/` を軽量版へ全面更新。`CLAUDE.md` の `@AGENTS.md` 参照は維持。
6. 全文 grep で `todo_app` / 名称揺れの不在を確認、完了条件（ガイド12章）を点検。
7. （ユーザー承認後）コミット → push → `gh` でテンプレートフラグ有効化。

ロールバック: テンプレート化は `gh repo edit --template=false` で解除可能。コード変更は本変更のコミットを revert すれば雛形前の状態へ戻せる。

## Open Questions

- GitHub 上のリポジトリ可視性は public / private どちらにするか（テンプレート公開の前提）。
- リモートリポジトリは既存（origin 設定済み）か、本変更で新規作成・接続するか。
- `lightweight_template_implementation_guide.md` 自体をテンプレートに残すか、`openspec/` 配下へ退避するか（現状は残す前提）。
