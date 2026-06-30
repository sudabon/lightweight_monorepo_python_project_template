# Go / Python モノレポテンプレート軽量版 実装指示書

## 1. 目的

既存の以下2つのテンプレートリポジトリをベースに、新規リポジトリとして「軽量版テンプレート」を作成する。

- `sudabon/monorepo_go_project_template`
- `sudabon/monorepo_python_project_template`

既存テンプレートは Clean Architecture の4層構成、依存方向のテスト、エージェント向けルールを含む本格構成である。軽量版では、業務アプリケーション開発に必要な責務分離は残しつつ、初期開発・MVP・小規模チーム・AIエージェントによる実装に適したシンプルな構成へ整理する。

## 2. 軽量版の基本方針

### 2.1 残すもの

- モノレポ構成
- `frontend/` と `backend/` の分離
- React / TypeScript / Vite / TailwindCSS のフロントエンド構成
- Go版は Echo または標準 `net/http` ベースのAPI構成
- Python版は FastAPI ベースのAPI構成
- PostgreSQL接続を想定した設定
- マイグレーションの置き場
- 環境変数による設定管理
- 最低限のユニットテスト
- 最低限のエージェント向けルール
- APIスキーマを信頼の源泉とする考え方

### 2.2 削るもの

- 厳密な4層 Clean Architecture 強制
- `domain / app / interfaces / infra` の細かすぎる階層
- アーキテクチャテストによるディレクトリ構造の強制
- `repository / port / presenter / viewmodel` の初期配置
- 通知、CLI、外部サービス連携などの空ディレクトリ
- 実装前からの過剰な抽象インターフェース
- 複数AIエージェント向けの重複ルール
- サンプル用途以外の `todo_app` 固有名

### 2.3 軽量版で守る設計原則

軽量版では Clean Architecture を完全には採用しない。ただし、以下の3原則は維持する。

1. HTTPハンドラに業務ロジックを書かない
2. DBアクセスをハンドラに直書きしない
3. 業務処理は `service` に集約する

これにより、初速を落とさず、後から Clean Architecture 寄りに拡張できる余地を残す。

## 3. 新規リポジトリ名の推奨

以下のような名前を推奨する。

```text
monorepo_go_light_template
monorepo_python_light_template
```

または、より用途が明確な名前にする場合は以下でもよい。

```text
go_react_webapp_template
python_react_webapp_template
```

## 4. Go版 軽量テンプレート仕様

### 4.1 推奨ディレクトリ構成

```text
monorepo_go_light_template/
├── README.md
├── AGENTS.md
├── .gitignore
├── .env.example
├── docker-compose.yml
├── backend/
│   ├── go.mod
│   ├── go.sum
│   ├── cmd/
│   │   └── server/
│   │       └── main.go
│   ├── internal/
│   │   ├── config/
│   │   │   └── config.go
│   │   ├── db/
│   │   │   └── postgres.go
│   │   ├── handler/
│   │   │   └── health_handler.go
│   │   ├── service/
│   │   │   └── health_service.go
│   │   ├── repository/
│   │   │   └── README.md
│   │   └── router/
│   │       └── router.go
│   ├── migrations/
│   │   └── .gitkeep
│   └── tests/
│       └── .gitkeep
└── frontend/
    ├── package.json
    ├── pnpm-lock.yaml
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── components/
        ├── pages/
        ├── hooks/
        ├── lib/
        └── types/
```

### 4.2 Go版のレイヤー責務

#### `handler/`

HTTPリクエストとレスポンスを扱う。

- リクエストのパース
- バリデーション呼び出し
- `service` の呼び出し
- HTTPステータスとレスポンスJSONの返却

禁止事項:

- SQLを書く
- トランザクション制御を書く
- 複雑な業務判断を書く

#### `service/`

業務処理を書く。

- ユースケース単位の処理
- 複数repositoryの組み合わせ
- トランザクション境界の判断
- 権限・状態遷移・業務ルール

#### `repository/`

DBアクセスを担当する。

- SQL / ORMの実行
- DBモデルとアプリ用構造体の変換
- 永続化処理

初期状態では `README.md` と `.gitkeep` のみでもよい。実テーブルが出てきた段階で追加する。

#### `db/`

DB接続の初期化を担当する。

#### `config/`

環境変数の読み込みを担当する。

#### `router/`

ルーティング定義を担当する。

### 4.3 Go版で削除するもの

既存Goテンプレートから軽量版へ移行する際、以下は削除する。

```text
backend/tests/arch/
backend/internal/*/domain/
backend/internal/*/app/
backend/internal/*/interfaces/
backend/internal/*/infra/
.cursor/rules/architecture.md の厳密な4層強制部分
.claude/rules/architecture.md の厳密な4層強制部分
.codex/rules/architecture.md の厳密な4層強制部分
```

ただし、AIエージェントに読ませるルールとして、軽量版の責務分離ルールは `AGENTS.md` に残す。

### 4.4 Go版の実装タスク

#### Task G-1: 新規リポジトリ作成

新規リポジトリ `monorepo_go_light_template` を作成する。

#### Task G-2: 既存テンプレートから必要ファイルをコピー

以下をコピーする。

```text
README.md
AGENTS.md
.gitignore
frontend/
```

ただし、READMEとAGENTSは軽量版向けに全面的に書き換える。

#### Task G-3: backend構成を作り直す

既存のClean Architecture用ディレクトリを削除し、以下に置き換える。

```text
backend/cmd/server/main.go
backend/internal/config/config.go
backend/internal/db/postgres.go
backend/internal/router/router.go
backend/internal/handler/health_handler.go
backend/internal/service/health_service.go
backend/internal/repository/README.md
backend/migrations/.gitkeep
```

#### Task G-4: health APIを実装

以下のAPIを実装する。

```text
GET /health
```

レスポンス例:

```json
{
  "status": "ok"
}
```

#### Task G-5: 起動コマンドを整備

READMEに以下を記載する。

```bash
cd backend
go mod tidy
go run ./cmd/server
```

#### Task G-6: テストを整備

最低限、`service` のユニットテストを1つ追加する。

```text
backend/internal/service/health_service_test.go
```

#### Task G-7: アーキテクチャテストを削除

軽量版では、ディレクトリ構造や依存方向をテストで強制しない。

代わりに `AGENTS.md` に以下を記載する。

```text
- handler は service を呼び出す
- service は repository を呼び出す
- repository は DB を扱う
- handler から DB を直接触らない
```

## 5. Python版 軽量テンプレート仕様

### 5.1 推奨ディレクトリ構成

```text
monorepo_python_light_template/
├── README.md
├── AGENTS.md
├── .gitignore
├── .env.example
├── docker-compose.yml
├── backend/
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── src/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── db.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── health.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── health_service.py
│   │   ├── repositories/
│   │   │   ├── __init__.py
│   │   │   └── README.md
│   │   └── schemas/
│   │       ├── __init__.py
│   │       └── health.py
│   ├── migrations/
│   │   └── .gitkeep
│   └── tests/
│       ├── __init__.py
│       └── test_health_service.py
└── frontend/
    ├── package.json
    ├── pnpm-lock.yaml
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── components/
        ├── pages/
        ├── hooks/
        ├── lib/
        └── types/
```

### 5.2 Python版のレイヤー責務

#### `api/`

FastAPIのルーターを置く。

- リクエスト受け取り
- Pydantic schemaによる入出力定義
- `services` の呼び出し
- HTTP例外の返却

禁止事項:

- SQLAlchemyを直接使う
- 複雑な業務判断を書く
- 外部API呼び出しを直接書く

#### `services/`

業務処理を書く。

- ユースケース単位の処理
- repositoryの呼び出し
- 業務ルール
- 複数データソースの組み合わせ

#### `repositories/`

DBアクセスを書く。

初期状態では `README.md` のみでよい。実テーブルが出てきた段階で追加する。

#### `schemas/`

Pydanticモデルを置く。

- APIリクエスト
- APIレスポンス
- 必要に応じて内部DTO

#### `config.py`

`pydantic-settings` による環境変数読み込みを担当する。

#### `db.py`

SQLAlchemyの接続設定を担当する。

### 5.3 Python版で削除するもの

既存Pythonテンプレートから軽量版へ移行する際、以下は削除する。

```text
backend/tests/arch/
backend/src/domain/
backend/src/app/
backend/src/interface/
backend/src/infra/
.cursor/rules/architecture.md の厳密な4層強制部分
.claude/rules/architecture.md の厳密な4層強制部分
.codex/rules/architecture.md の厳密な4層強制部分
```

特に既存Python版では、README上で `domain / app / interface / infra` と、import検査側の `application / interfaces / infrastructure` の名称揺れがあるため、軽量版ではこの問題を解消する。

軽量版では以下に統一する。

```text
api
services
repositories
schemas
```

### 5.4 Python版の実装タスク

#### Task P-1: 新規リポジトリ作成

新規リポジトリ `monorepo_python_light_template` を作成する。

#### Task P-2: 既存テンプレートから必要ファイルをコピー

以下をコピーする。

```text
README.md
AGENTS.md
.gitignore
frontend/
```

ただし、READMEとAGENTSは軽量版向けに全面的に書き換える。

#### Task P-3: backend構成を作り直す

既存のClean Architecture用ディレクトリを削除し、以下に置き換える。

```text
backend/src/main.py
backend/src/config.py
backend/src/db.py
backend/src/api/health.py
backend/src/services/health_service.py
backend/src/repositories/README.md
backend/src/schemas/health.py
backend/tests/test_health_service.py
backend/migrations/.gitkeep
```

#### Task P-4: health APIを実装

以下のAPIを実装する。

```text
GET /health
```

レスポンス例:

```json
{
  "status": "ok"
}
```

#### Task P-5: 起動コマンドを整備

READMEに以下を記載する。

```bash
cd backend
uv sync
uv run uvicorn src.main:app --reload
```

#### Task P-6: テストを整備

最低限、`services` のユニットテストを1つ追加する。

```text
backend/tests/test_health_service.py
```

#### Task P-7: アーキテクチャテストを削除

軽量版では、ディレクトリ構造や依存方向をテストで強制しない。

代わりに `AGENTS.md` に以下を記載する。

```text
- api は services を呼び出す
- services は repositories を呼び出す
- repositories は DB を扱う
- api から DB を直接触らない
```

## 6. フロントエンド共通仕様

Go版・Python版とも、フロントエンドは同じ構成にする。

### 6.1 推奨構成

```text
frontend/
├── package.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── components/
    ├── pages/
    ├── hooks/
    ├── lib/
    │   └── api.ts
    └── types/
```

### 6.2 フロントエンドの方針

- React + TypeScript + Viteを前提にする
- API呼び出しは `src/lib/api.ts` に集約する
- 画面コンポーネントから直接 `fetch` を乱用しない
- APIレスポンス型は `src/types/` に置く
- TanStack Queryは採用してよいが、軽量版では必須にしない
- Shadcn/ui + TailwindCSSは任意導入にする

## 7. README.md に書く内容

各軽量版リポジトリのREADMEには、以下を記載する。

```text
# プロジェクト名

## 概要

React + TypeScript のフロントエンドと、Go/Python のバックエンドを組み合わせた軽量モノレポテンプレートです。

このテンプレートは Clean Architecture の厳密な4層構成ではなく、handler/api、service、repository の3責務に絞った軽量構成です。

## ディレクトリ構成

## 起動方法

## テスト

## 開発ルール

## 環境変数
```

## 8. AGENTS.md に書く内容

`AGENTS.md` は、人間とAIエージェントの両方が読む前提で、短く明確にする。

### 8.1 Go版 AGENTS.md の要点

```text
# AGENTS.md

## プロジェクト概要

React + TypeScript frontend と Go backend の軽量モノレポ。

## Backend rules

- HTTP処理は internal/handler に書く
- 業務処理は internal/service に書く
- DB処理は internal/repository に書く
- DB接続は internal/db に集約する
- 設定は internal/config に集約する
- handler から DB を直接操作しない
- handler に業務ロジックを書かない
- service は必要に応じて repository を呼び出す

## Frontend rules

- API呼び出しは frontend/src/lib に集約する
- 型定義は frontend/src/types に置く
- ページ固有処理は pages に置く
- 再利用UIは components に置く

## Commands

Backend:
- go run ./cmd/server
- go test ./...
- gofmt -w .

Frontend:
- pnpm install
- pnpm dev
- pnpm build
```

### 8.2 Python版 AGENTS.md の要点

```text
# AGENTS.md

## プロジェクト概要

React + TypeScript frontend と FastAPI backend の軽量モノレポ。

## Backend rules

- HTTP処理は src/api に書く
- 業務処理は src/services に書く
- DB処理は src/repositories に書く
- DB接続は src/db.py に集約する
- 設定は src/config.py に集約する
- api から DB を直接操作しない
- api に業務ロジックを書かない
- services は必要に応じて repositories を呼び出す

## Frontend rules

- API呼び出しは frontend/src/lib に集約する
- 型定義は frontend/src/types に置く
- ページ固有処理は pages に置く
- 再利用UIは components に置く

## Commands

Backend:
- uv sync
- uv run uvicorn src.main:app --reload
- uv run pytest
- uv run ruff check .
- uv run ruff format .

Frontend:
- pnpm install
- pnpm dev
- pnpm build
```

## 9. .env.example

Go版・Python版とも、最低限以下を用意する。

```env
APP_ENV=local
APP_PORT=8080
DATABASE_URL=postgres://app:password@localhost:5432/app_db?sslmode=disable
```

Python版でSQLAlchemy asyncを使う場合は、以下でもよい。

```env
DATABASE_URL=postgresql+asyncpg://app:password@localhost:5432/app_db
```

## 10. docker-compose.yml

最低限、PostgreSQLのみを含める。

```yaml
services:
  postgres:
    image: postgres:17
    container_name: app_postgres
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 11. 移行時の注意点

### 11.1 Clean Architectureを完全には捨てない

軽量版では4層構成を削るが、責務分離そのものは残す。

特に以下は禁止する。

- HTTPハンドラにSQLを書く
- APIルーターに業務ロジックを書く
- DBモデルをフロントエンドレスポンスとしてそのまま返す
- 環境変数を各所で直接読む

### 11.2 将来の拡張先を残す

軽量版から本格構成へ拡張する場合は、以下のように移行できる。

Go版:

```text
handler  → interfaces/controller
service  → app/usecase
repository interface → app/repository
repository implementation → infra/persistence
entity → domain/entity
```

Python版:

```text
api → interface/controller
services → app/usecase
repositories interface → app/repository
repositories implementation → infra/persistence
entity/model → domain/entity
```

つまり、軽量版は将来的なClean Architecture化を妨げない構成にする。

## 12. 実装完了条件

Go版・Python版それぞれで、以下を満たすこと。

### Go版

- 新規リポジトリが作成されている
- README.md が軽量版向けに更新されている
- AGENTS.md が軽量版向けに更新されている
- `backend/cmd/server/main.go` でAPIサーバーが起動する
- `GET /health` が `{"status":"ok"}` を返す
- `go test ./...` が成功する
- アーキテクチャテストが削除されている
- `todo_app` 固有名が残っていない

### Python版

- 新規リポジトリが作成されている
- README.md が軽量版向けに更新されている
- AGENTS.md が軽量版向けに更新されている
- `uv run uvicorn src.main:app --reload` でAPIサーバーが起動する
- `GET /health` が `{"status":"ok"}` を返す
- `uv run pytest` が成功する
- アーキテクチャテストが削除されている
- `todo_app` 固有名が残っていない
- `domain / app / interface / infra` と `application / interfaces / infrastructure` の名称揺れが残っていない

## 13. Codex / Claude Code向け実装プロンプト

以下を、そのままCodexまたはClaude Codeに渡してよい。

```text
既存の monorepo_go_project_template / monorepo_python_project_template を参考に、新規リポジトリとして軽量版テンプレートを作成してください。

目的は、Clean Architectureの厳密な4層構成をやめ、handler/api・service・repository の3責務に整理した、MVPや小規模業務アプリ向けの軽量モノレポテンプレートにすることです。

共通方針:
- frontend は React + TypeScript + Vite のまま維持する
- backend はGo版とPython版で別リポジトリにする
- アーキテクチャテストは削除する
- todo_app 固有名は削除する
- README.md と AGENTS.md は軽量版向けに全面更新する
- GET /health を実装する
- 最低限のユニットテストを追加する
- DBはPostgreSQL想定とし、docker-compose.yml と .env.example を用意する

Go版:
- backend/cmd/server/main.go
- backend/internal/config
- backend/internal/db
- backend/internal/router
- backend/internal/handler
- backend/internal/service
- backend/internal/repository
の構成にしてください。

Python版:
- backend/src/main.py
- backend/src/config.py
- backend/src/db.py
- backend/src/api
- backend/src/services
- backend/src/repositories
- backend/src/schemas
の構成にしてください。

禁止事項:
- handler/api からDBを直接操作しない
- handler/api に業務ロジックを書かない
- 実装前から過剰な抽象インターフェースを作らない
- Clean Architecture 4層の空ディレクトリを残さない

完了条件:
- README.md に起動方法、構成、開発ルールが書かれている
- AGENTS.md にAIエージェント向けの簡潔なルールが書かれている
- health APIが動作する
- テストが通る
- 既存テンプレート由来の名称揺れや todo_app 参照が残っていない
```
