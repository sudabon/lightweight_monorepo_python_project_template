## ADDED Requirements

### Requirement: 軽量バックエンドのディレクトリ構成

バックエンドは厳密な4層 Clean Architecture ではなく、`api` / `services` / `repositories` / `schemas` の責務に整理された構成 SHALL とする。`backend/src/` 配下に `main.py` / `config.py` / `db.py` と、`api/` / `services/` / `repositories/` / `schemas/` の各パッケージを配置 MUST する。`domain` / `app` / `interface` / `infra` のディレクトリ、および `todo_app` 固有名は存在 MUST NOT。

#### Scenario: 構成ディレクトリが存在する

- **WHEN** リポジトリ直下から `backend/src/` を確認する
- **THEN** `main.py` / `config.py` / `db.py` と `api/` / `services/` / `repositories/` / `schemas/` が存在する
- **AND** `domain/` / `app/` / `interface/` / `infra/` および `todo_app` 名は存在しない

#### Scenario: 名称揺れが解消されている

- **WHEN** リポジトリ全体を `domain`・`application`・`interfaces`・`infrastructure`・`todo_app` で検索する
- **THEN** バックフォワード互換の説明箇所を除き、ソース・設定・テスト上にこれらの語が残っていない

### Requirement: health エンドポイント

バックエンドは `GET /health` を提供 SHALL し、HTTP 200 と JSON ボディ `{"status":"ok"}` を返 MUST す。HTTP 処理は `api/` に、状態判定ロジックは `services/health_service.py` に置 MUST き、`api` 層に業務ロジックを書 MUST NOT。

#### Scenario: health が ok を返す

- **WHEN** サーバ起動後に `GET /health` を呼び出す
- **THEN** ステータスコード 200 と JSON `{"status":"ok"}` が返る

#### Scenario: ロジックが service に集約されている

- **WHEN** `api/health.py` を確認する
- **THEN** ルーターは `services/health_service.py` を呼び出すのみで、状態判定ロジックを直接持たない

### Requirement: 設定とDB接続の集約

環境変数の読み込みは `config.py`（`pydantic-settings`）に、DB 接続初期化は `db.py`（SQLAlchemy）に集約 SHALL する。環境変数を各モジュールで直接 `os.environ` 参照 MUST NOT。

#### Scenario: 設定が一元化されている

- **WHEN** バックエンドのソースを確認する
- **THEN** 環境変数アクセスは `config.py` 経由に限定され、`DATABASE_URL` 等は設定オブジェクトから取得される

### Requirement: repositories 初期状態

`repositories/` は初期状態では `README.md` のみを持 SHALL ち、実テーブルが出た段階で実装を追加する方針を README に明記 MUST する。実装前から過剰な抽象インターフェースを置 MUST NOT。

#### Scenario: repositories は README のみ

- **WHEN** `backend/src/repositories/` を確認する
- **THEN** `README.md`（と `__init__.py`）のみが存在し、抽象基底クラス等の事前実装は無い

### Requirement: バックエンドのユニットテスト

`services` 層に対する最低限のユニットテスト `backend/tests/test_health_service.py` を提供 SHALL し、`uv run pytest` が成功 MUST する。`backend/tests/arch/` のアーキテクチャテストは存在 MUST NOT。

#### Scenario: テストが通る

- **WHEN** `backend/` で `uv run pytest` を実行する
- **THEN** `test_health_service.py` を含むテストがすべて成功する
- **AND** `tests/arch/` ディレクトリは存在しない

### Requirement: パッケージ定義と起動

`backend/pyproject.toml` を提供 SHALL し、`uv sync` で依存を解決、`uv run uvicorn src.main:app --reload` で開発サーバが起動 MUST する。`backend/migrations/` を空の置き場として用意 MUST する。

#### Scenario: サーバが起動する

- **WHEN** `backend/` で `uv sync` 後に `uv run uvicorn src.main:app --reload` を実行する
- **THEN** FastAPI アプリケーションが起動し `GET /health` が応答する
