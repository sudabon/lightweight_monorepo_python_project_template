# template-governance Specification

## Purpose
TBD - created by archiving change template-clarity-fixes. Update Purpose after archive.
## Requirements
### Requirement: LICENSE ファイルが存在する

テンプレートリポジトリ SHALL ルートに再利用条件を示す `LICENSE` ファイルを含めなければならない。

#### Scenario: MIT LICENSE がルートにある

- **WHEN** リポジトリルートを確認する
- **THEN** `LICENSE` ファイルが存在する
- **THEN** ライセンス条項が MIT である

### Requirement: 変更後も品質チェックが通過する

本変更の適用後、テンプレートの品質チェックコマンド SHALL すべて成功しなければならない。

#### Scenario: バックエンドチェックが成功する

- **WHEN** `cd backend` で `uv run pytest`、`uv run ruff check .`、`uv run ruff format --check .`、`uv run mypy src/` を実行する
- **THEN** すべて exit code 0 で完了する

#### Scenario: フロントエンドビルドが成功する

- **WHEN** `cd frontend` で `pnpm install` と `pnpm build` を実行する
- **THEN** ビルドが exit code 0 で完了する

