## ADDED Requirements

### Requirement: PostgreSQL 開発環境

ルートに `docker-compose.yml` を提供 SHALL し、最低限 PostgreSQL サービスのみを含 MUST む。`docker compose up` で PostgreSQL が `localhost:5432` で利用可能になる構成 MUST とする。

#### Scenario: PostgreSQL が起動する

- **WHEN** リポジトリ直下で `docker compose up -d` を実行する
- **THEN** PostgreSQL コンテナが起動し、`5432` ポートで接続可能になる

### Requirement: 環境変数テンプレート

`.env.example` を提供 SHALL し、`APP_ENV` / `APP_PORT` / `DATABASE_URL` を含 MUST む。`DATABASE_URL` は PostgreSQL 接続を想定した値（SQLAlchemy async を使う場合は `postgresql+asyncpg://...`）とする。実 `.env` はコミット MUST NOT。

#### Scenario: 環境変数テンプレートが存在する

- **WHEN** `.env.example` を確認する
- **THEN** `APP_ENV` / `APP_PORT` / `DATABASE_URL` のキーが定義されている

#### Scenario: .env が無視される

- **WHEN** `.gitignore` を確認する
- **THEN** `.env` がコミット対象から除外されている

### Requirement: gitignore の整備

`.gitignore` は Python（`__pycache__` / `.venv` 等）、Node（`node_modules` / ビルド成果物）、環境ファイル（`.env`）、ツールキャッシュを除外 SHALL する。

#### Scenario: 主要な生成物が除外されている

- **WHEN** `.gitignore` を確認する
- **THEN** `node_modules` / `.venv`（または相当）/ `__pycache__` / `.env` が除外対象に含まれている
