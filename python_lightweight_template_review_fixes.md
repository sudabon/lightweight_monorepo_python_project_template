# lightweight_monorepo_python_project_template 修正指示書

対象リポジトリ:

- https://github.com/sudabon/lightweight_monorepo_python_project_template

## 目的

FastAPI + React の軽量モノレポテンプレートとして、現状の `api / services / repositories` という3責務構成は維持する。

厳密な Clean Architecture には戻さず、以下を目的に最小限の修正を行う。

- テンプレートとしての信頼性を上げる
- FastAPIらしい自然な構成を維持する
- エージェント開発時に責務が崩れにくくする
- 新規プロジェクトへ転用したときの初期品質を上げる
- README / AGENTS.md / 実装のズレを減らす

## 修正方針

このリポジトリは軽量版テンプレートであるため、過度な抽象化は避ける。

特に以下は行わない。

- `domain / app / interface / infra` の4層構成へ戻さない
- repository protocol / abstract class を先回りして大量に定義しない
- DIコンテナを導入しない
- SQLAlchemyモデルやAlembic設定を、実テーブルがない段階で複雑化しない
- TanStack Query / TailwindCSS / UIライブラリを必須化しない

## 優先度A: `db.py` のDB engine生成を遅延初期化に変更する

### 背景

現状の `backend/src/db.py` は import 時に以下を実行している。

```python
_settings = get_settings()
engine = create_async_engine(_settings.database_url, pool_pre_ping=True)
async_session_factory = async_sessionmaker(...)
```

実際のDB接続は遅延されるため即時障害にはなりにくいが、以下の問題がある。

- テスト時に `src.db` を import しただけでDB設定が固定される
- 環境変数の差し替えテストがやりづらい
- CLIやスクリプトから一部モジュールだけ使いたいときにDB設定へ依存しやすい
- テンプレート利用者がDB必須構成だと誤解しやすい

### 修正方針

DB engine と session factory は関数経由で取得する。

### 修正例

```python
from collections.abc import AsyncGenerator
from functools import lru_cache

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from src.config import get_settings


@lru_cache
def get_engine() -> AsyncEngine:
    settings = get_settings()
    return create_async_engine(settings.database_url, pool_pre_ping=True)


@lru_cache
def get_session_factory() -> async_sessionmaker[AsyncSession]:
    return async_sessionmaker(
        get_engine(),
        class_=AsyncSession,
        expire_on_commit=False,
    )


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async_session_factory = get_session_factory()
    async with async_session_factory() as session:
        yield session
```

### 完了条件

```bash
cd backend
uv run pytest
uv run ruff check .
uv run ruff format --check .
uv run mypy src/
```

が成功すること。

## 優先度A: `APP_PORT` の扱いをREADMEで明確にする

### 背景

`Settings` には `app_port` があるが、READMEの起動コマンドでは利用されていない。

```bash
uv run uvicorn src.main:app --reload
```

このままだと、`.env` の `APP_PORT=8000` を変更しても uvicorn のポートは変わらない。

### 修正案1: READMEで明記する

軽量テンプレートとしてはこちらを推奨する。

READMEのBackend起動コマンドを以下にする。

```bash
uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

さらに環境変数表に注記する。

```text
APP_PORT はアプリケーション設定として保持する。
ローカル起動時のuvicornポートは、起動コマンドの `--port` で指定する。
```

### 修正案2: 起動スクリプトを追加する

`src/main.py` に `if __name__ == "__main__"` を追加して `uvicorn.run()` する方法もある。

ただし、テンプレートがやや重くなるため現時点では非推奨。

## 優先度B: API層の service インスタンス生成を改善するか検討する

### 背景

現状は `backend/src/api/health.py` で以下のようにモジュールグローバルに service を生成している。

```python
_health_service = HealthService()
```

軽量テンプレートとしては問題ないが、エンドポイントが増えるとテスト差し替えや依存注入がやや難しくなる。

### 推奨修正

FastAPI の `Depends` を使って、軽量な依存注入にする。

### 修正例

```python
from fastapi import APIRouter, Depends

from src.schemas.health import HealthResponse
from src.services.health_service import HealthService

router = APIRouter(tags=["health"])


def get_health_service() -> HealthService:
    return HealthService()


@router.get("/health")
async def get_health(
    health_service: HealthService = Depends(get_health_service),
) -> HealthResponse:
    return health_service.check()
```

### 推奨判断

実案件テンプレートとしては `Depends` 版を推奨する。

理由:

- FastAPIとして自然
- テストで差し替えやすい
- グローバルインスタンスを避けられる
- DIコンテナほど重くない

## 優先度B: API endpoint のテストを追加する

### 背景

現在は service のテストがあるが、`GET /health` のAPIテストは不足している。

テンプレートとしては、FastAPI の `TestClient` を使った最低限のAPIテストがあるとよい。

### 追加するファイル

```text
backend/tests/test_health_api.py
```

### 実装内容

確認観点:

- `GET /health` が `200 OK` を返す
- レスポンスJSONが `{"status":"ok"}` である
- DB未起動でもテストが通る

### 修正例

```python
from fastapi.testclient import TestClient

from src.main import create_app


def test_get_health_returns_ok() -> None:
    client = TestClient(create_app())

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

### 依存関係の注意

`fastapi` の `TestClient` 利用に追加依存が必要な場合は、`httpx` を dev dependency に追加する。

```toml
[dependency-groups]
dev = [
    "httpx>=0.28.0",
    "mypy>=1.13.0",
    "pytest>=8.3.0",
    "ruff>=0.8.0",
]
```

## 優先度B: repository README を維持するか判断する

### 背景

`repositories/README.md` は「まだ実装がないが置き場所を示す」意味では有効。

ただし、テンプレートとしては空ディレクトリ維持目的に見えるため、今後の方針を明記するとよい。

### 推奨追記

`backend/src/repositories/README.md` に以下を記載する。

```text
DBアクセスが必要な処理が出るまでは、先回りしてRepositoryクラスやProtocolを作成しない。
SQLAlchemyモデル、クエリ、外部永続化の詳細はこのディレクトリに置く。
API層からこのディレクトリを直接呼ばず、services経由で利用する。
```

## 優先度C: docker-compose のサービス名をGo版と揃えるか検討する

### 背景

Python版ではDBサービス名が `postgres`、Go版では `db` になっている。

単体では問題ないが、両テンプレートを横並びで運用する場合、サービス名が揃っている方がわかりやすい。

### 推奨判断

両方のテンプレートを同じ思想で管理するなら、Python版も以下に寄せる。

```yaml
services:
  db:
```

ただし、既存READMEに `docker compose up -d` としか書いていないため、現状維持でも問題ない。

変更する場合は、READMEも以下のように修正する。

```bash
docker compose up -d db
```

## 優先度C: `.env` の読み込み位置をREADMEで補足する

### 背景

`pydantic-settings` の `env_file=".env"` は、実行時のカレントディレクトリに依存する。

READMEでは `cd backend` してから起動するため、`backend/.env` を読みに行く挙動になる。

一方、`.env.example` はリポジトリルートにある。

このままだと、ユーザーが以下のどちらに `.env` を置くべきか迷う可能性がある。

```text
./.env
backend/.env
```

### 修正案

軽量テンプレートでは、READMEに配置先を明記する。

```text
ローカル起動時は `cd backend` して実行するため、backend用の `.env` は `backend/.env` に置く。
リポジトリルートの `.env.example` は配布用サンプルである。
```

または、`.env.example` を `backend/.env.example` に移動する。

### 推奨判断

Python版では `backend/.env.example` に置く方が誤解が少ない。

ただし、frontend用の `VITE_API_BASE_URL` も含めるなら、ルート `.env.example` のままでもよい。

その場合は、READMEで「コピー先」を明記する。

## 優先度C: frontend APIクライアントは現状維持でよい

### 評価

`frontend/src/lib/api.ts` は以下の点で良い。

- `VITE_API_BASE_URL` の末尾スラッシュを除去している
- APIレスポンスを `unknown` として受けている
- 型ガードで `HealthResponse` を検証している
- コンポーネントから直接 `fetch` していない

現時点で大きな修正は不要。

## 変更後に実行する確認コマンド

```bash
cd backend
uv sync
uv run pytest
uv run ruff check .
uv run ruff format --check .
uv run mypy src/
```

```bash
cd frontend
pnpm install
pnpm build
```

## 最終チェックリスト

- [ ] `/health` はDB非依存で動作する
- [ ] `uv run pytest` が成功する
- [ ] `uv run ruff check .` が成功する
- [ ] `uv run ruff format --check .` が成功する
- [ ] `uv run mypy src/` が成功する
- [ ] `api` からDBを直接操作していない
- [ ] `api` に業務ロジックを書いていない
- [ ] DB接続は `backend/src/db.py` に集約されている
- [ ] 設定は `backend/src/config.py` に集約されている
- [ ] 環境変数の読み込み場所がREADMEで明確になっている
- [ ] frontend コンポーネントから直接 `fetch` を増やしていない
- [ ] README と AGENTS.md の内容が実装と矛盾していない
