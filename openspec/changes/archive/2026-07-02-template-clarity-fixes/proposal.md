## Why

本家テンプレートからの移行時に残留したファイルと、ドキュメント間の不整合が、テンプレート利用者に「何が正か」「何が必須か」を誤解させている。コードは健全なため、構造変更ではなく削除・文書修正で初見の見通しを改善する。

## What Changes

### 優先度A: 残留物の削除とドキュメント整合

- OpenSpec 前提のスキル（`.claude/skills/openspec-adr-generator/`、`.claude/skills/opsx-codex-apply/`）を削除する
- 作業用ドキュメント（`python_lightweight_template_review_fixes.md`、`lightweight_template_clarity_fixes.md`）を削除する
- `.gitkeep` のみの `backend/migrations/` を削除し、マイグレーション方針を README と `backend/src/repositories/README.md` に追記する
- README と AGENTS.md の Structure セクションを実ファイル構成に合わせて一致させる
- AGENTS.md の「API スキーマを型の信頼源にする」記述を、手動同期の実態に合わせて修正する
- `.claude/rules/templates.md` の router テンプレートを `Depends` + `Annotated` 版に更新する
- README に本家テンプレート（`monorepo_python_project_template`）との使い分けを追記する

### 優先度B: テンプレートとしての信頼性

- ルールファイルの三重管理（`.claude/` / `.codex/` / `.cursor/`）について、正のソースを AGENTS.md に明記する
- `.claude/rules/codex-guidelines.md` をテンプレートから外す
- MIT LICENSE を追加する

### 優先度C: 軽微な改善（本変更のスコープ外）

- CI 追加（`.github/workflows/ci.yml`）は別 change とする
- pytest deprecation warning、docker-compose サービス名、`pyproject.toml` の readme 参照は現状維持

## Capabilities

### New Capabilities

- `template-cleanup`: OpenSpec 残留スキル・作業用 md・空の migrations ディレクトリの削除
- `documentation-consistency`: README / AGENTS.md の Structure 統一、マイグレーション方針、型同期方針、本家との使い分けの文書化
- `agent-rules`: templates.md の Depends 版更新、ルール正本の明記、codex-guidelines の除去
- `template-governance`: LICENSE 追加

### Modified Capabilities

（既存 spec なし）

## Impact

- **削除対象**: `.claude/skills/openspec-adr-generator/`、`.claude/skills/opsx-codex-apply/`、作業用 md 2 ファイル、`backend/migrations/`、`.claude/rules/codex-guidelines.md`
- **更新対象**: `README.md`、`AGENTS.md`、`backend/src/repositories/README.md`、`.claude/rules/templates.md`
- **追加対象**: `LICENSE`
- **API / ランタイム**: 変更なし（ドキュメントとテンプレート整備のみ）
- **完了条件**: `uv run pytest` / `ruff` / `mypy` / `pnpm build` がすべて成功すること
