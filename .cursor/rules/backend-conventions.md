---
globs: ["backend/**"]
---
# バックエンド コーディング規約

## 全般

- 型ヒントは必ず付与する。`Any` の使用は最小限に。
- 変数名・関数名は snake_case、クラス名は PascalCase。
- マジックナンバーは定数として定義する。
- async/await を一貫して使用する。sync関数と混在させない。

## api

- FastAPI の `APIRouter` を置く。
- リクエスト・レスポンスの形は `schemas` の Pydantic モデルを使う。
- 業務判断は `services` に委譲する。
- SQLAlchemy セッションや DB クエリを直接扱わない。

## services

- 業務判断と処理手順を置く。
- DB が必要な場合は `repositories` の関数やクラスを呼び出す。
- HTTP ステータスコードや FastAPI 固有の都合を持ち込まない。

## repositories

- DB 読み書きだけを置く。
- 実テーブルが出るまで README と `__init__.py` だけにする。
- 先回りした抽象基底クラスを置かない。

## config / db

- 設定値は `src/config.py` の Settings 経由で読む。
- DB 接続は `src/db.py` に集約する。
