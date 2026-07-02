## ADDED Requirements

### Requirement: README と AGENTS.md の Structure が一致する

`README.md` と `AGENTS.md` の Structure セクション SHALL 実ファイル構成を反映し、両者の内容が一致しなければならない。

#### Scenario: Structure の主要項目が一致する

- **WHEN** `README.md` と `AGENTS.md` の Structure セクションを比較する
- **THEN** 両方に `backend/.env.example`、`frontend/src/components/`、`pages/`、`hooks/` が記載され、`backend/migrations/` は記載されない

### Requirement: マイグレーション方針が文書化される

テンプレート SHALL 実テーブル導入時のマイグレーション方針を、ルート README と `backend/src/repositories/README.md` の両方に記載しなければならない。

#### Scenario: マイグレーション方針が README にある

- **WHEN** ルート `README.md` を読む
- **THEN** 実テーブル導入時に Alembic を追加し `backend/migrations/` を作成する旨が記載されている

#### Scenario: マイグレーション方針が repositories README にある

- **WHEN** `backend/src/repositories/README.md` を読む
- **THEN** 実テーブル導入時に Alembic を追加し `backend/migrations/` を作成する旨が記載されている

### Requirement: API 型同期方針が実態に合致する

`AGENTS.md` の Notes SHALL、フロントエンド型が `backend/src/schemas` から手動同期であることを明記しなければならない。

#### Scenario: 手動同期が明記されている

- **WHEN** `AGENTS.md` の Notes を読む
- **THEN** `backend/src/schemas` を正とし `frontend/src/types/` に手動で対応する型を定義する旨が記載されている
- **THEN** 自動生成は必要時に導入する旨が記載されている

### Requirement: 本家テンプレートとの使い分けが README に記載される

ルート `README.md` SHALL 本家 `monorepo_python_project_template` との関係と使い分け基準を冒頭付近に記載しなければならない。

#### Scenario: 使い分けが記載されている

- **WHEN** ルート `README.md` の冒頭を読む
- **THEN** 本家がルール中心・層構成厳密、軽量版が実装中心・3責務である旨が記載されている
- **THEN** 小規模・初速優先なら軽量版、層の厳密な強制が必要なら本家を使う旨が記載されている
