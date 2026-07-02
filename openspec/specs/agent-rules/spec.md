# agent-rules Specification

## Purpose
TBD - created by archiving change template-clarity-fixes. Update Purpose after archive.
## Requirements
### Requirement: router テンプレートが Depends パターンを示す

`.claude/rules/templates.md` の新規 router サンプル SHALL `Depends` と `Annotated` による依存性注入パターンを示さなければならない。

#### Scenario: モジュールグローバル service インスタンスがない

- **WHEN** `.claude/rules/templates.md` の新規 router セクションを読む
- **THEN** `_xxx_service = XxxService()` のようなモジュールグローバルインスタンスが含まれない

#### Scenario: Depends 注入パターンがある

- **WHEN** `.claude/rules/templates.md` の新規 router セクションを読む
- **THEN** ファクトリ関数（例: `get_xxx_service`）と `Annotated[..., Depends(...)]` による注入が示されている

### Requirement: ルールファイルの正本が AGENTS.md に明記される

`AGENTS.md` SHALL エージェント向けルールの正本が `AGENTS.md` および `.claude/rules/` であること、`.codex/rules/` と `.cursor/rules/` は複製であることを明記しなければならない。

#### Scenario: 正本が明記されている

- **WHEN** `AGENTS.md` を読む
- **THEN** ルールの正本が `AGENTS.md` と `.claude/rules/` である旨が記載されている
- **THEN** `.codex/rules/` と `.cursor/rules/` は複製であり、更新時は正本に合わせる旨が記載されている

### Requirement: codex-guidelines がテンプレートに含まれない

テンプレート SHALL NOT に個人ワークフロー向けの `.claude/rules/codex-guidelines.md` を含めてはならない。

#### Scenario: codex-guidelines が存在しない

- **WHEN** `.claude/rules/` 配下を確認する
- **THEN** `codex-guidelines.md` が存在しない

