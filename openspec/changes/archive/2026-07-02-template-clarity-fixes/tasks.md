## 1. 残留物の削除（template-cleanup）

- [x] 1.1 `.claude/skills/openspec-adr-generator/` を削除する
- [x] 1.2 `.claude/skills/opsx-codex-apply/` を削除する
- [x] 1.3 `python_lightweight_template_review_fixes.md` を削除する
- [x] 1.4 `lightweight_template_clarity_fixes.md` を削除する
- [x] 1.5 `backend/migrations/` ディレクトリ（`.gitkeep` 含む）を削除する

## 2. ドキュメント整合（documentation-consistency）

- [x] 2.1 ルート `README.md` の Structure を実ファイル構成に合わせて更新する（`migrations/` 削除、`.env.example`・`components/`・`pages/`・`hooks/` 追加）
- [x] 2.2 `AGENTS.md` の Structure を `README.md` と同一内容に揃える
- [x] 2.3 ルート `README.md` にマイグレーション方針（Alembic 導入時に `backend/migrations/` を作成）を追記する
- [x] 2.4 `backend/src/repositories/README.md` にマイグレーション方針を追記する
- [x] 2.5 `AGENTS.md` Notes の型同期方針を手動同期の実態に合わせて修正する
- [x] 2.6 ルート `README.md` 冒頭に本家テンプレートとの使い分け段落を追加する

## 3. エージェントルール整備（agent-rules）

- [x] 3.1 `.claude/rules/templates.md` の新規 router サンプルを `Depends` + `Annotated` 版に差し替える
- [x] 3.2 `.claude/rules/templates.md` の repository サンプルをモデル型仮置きの例に更新する（任意だが推奨）
- [x] 3.3 `AGENTS.md` にルール正本（`AGENTS.md` + `.claude/rules/`）と複製（`.codex/` / `.cursor/`）の明記を追記する
- [x] 3.4 `.claude/rules/codex-guidelines.md` を削除する

## 4. テンプレートガバナンス（template-governance）

- [x] 4.1 ルートに MIT `LICENSE` ファイルを追加する

## 5. 検証

- [x] 5.1 `cd backend && uv run pytest && uv run ruff check . && uv run ruff format --check . && uv run mypy src/` を実行し成功を確認する
- [x] 5.2 `cd frontend && pnpm install && pnpm build` を実行し成功を確認する
- [x] 5.3 proposal の完了条件チェックリストを目視確認する
