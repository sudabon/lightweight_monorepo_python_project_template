# template-cleanup Specification

## Purpose
TBD - created by archiving change template-clarity-fixes. Update Purpose after archive.
## Requirements
### Requirement: OpenSpec 前提の残留スキルを削除する

テンプレートリポジトリ SHALL NOT に、OpenSpec ワークフロー前提で動作するが運用基盤が存在しないスキルを含めてはならない。

#### Scenario: 残留スキルが存在しない

- **WHEN** `.claude/skills/` 配下を確認する
- **THEN** `openspec-adr-generator/` と `opsx-codex-apply/` ディレクトリが存在しない

### Requirement: 作業用修正指示書をルートから削除する

テンプレートリポジトリ SHALL NOT に、過去リファクタリングの作業履歴を示す修正指示書 md をルートに残してはならない。

#### Scenario: 作業用 md がルートにない

- **WHEN** リポジトリルートのファイル一覧を確認する
- **THEN** `python_lightweight_template_review_fixes.md` と `lightweight_template_clarity_fixes.md` が存在しない

### Requirement: 空の migrations ディレクトリを削除する

テンプレート SHALL NOT に、Alembic 未導入の状態で `.gitkeep` のみの `backend/migrations/` ディレクトリを含めてはならない。

#### Scenario: migrations ディレクトリが存在しない

- **WHEN** `backend/` 配下を確認する
- **THEN** `migrations/` ディレクトリが存在しない

