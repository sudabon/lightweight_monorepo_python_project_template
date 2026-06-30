# repositories

DB access code belongs in this package when real tables are introduced.

Keep the initial template empty aside from this note and `__init__.py`. Add concrete repository
modules only when a feature needs persistent data, and keep SQLAlchemy session usage out of
`src/api`.

## 方針

- DBアクセスが必要な処理が出るまでは、先回りしてRepositoryクラスやProtocolを作成しない。
- SQLAlchemyモデル、クエリ、外部永続化の詳細はこのディレクトリに置く。
- API層からこのディレクトリを直接呼ばず、services経由で利用する。
