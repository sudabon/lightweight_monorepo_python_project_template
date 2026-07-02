## Context

`lightweight_monorepo_python_project_template` は本家 `monorepo_python_project_template` から派生した軽量版である。実装コード（health エンドポイント）は健全で、テスト・lint・型チェックはすべて通過している。わかりにくさの原因は以下に集中する。

- 本家移行時の残留物（OpenSpec 前提スキル、作業用 md、空の `migrations/`）
- README と AGENTS.md の Structure 不一致
- AGENTS.md の型同期方針が実態（手書きコピー）と乖離
- `.claude/rules/templates.md` の router サンプルが `Depends` 移行後の実コードと矛盾
- ルールファイルが `.claude/` / `.codex/` / `.cursor/` に三重複製されている
- LICENSE が未整備

軽量版の思想（3責務、先回り抽象の禁止）は維持し、ランタイムコードの構造変更は行わない。

## Goals / Non-Goals

**Goals:**

- テンプレート利用者が初見で「何が必須か」「正のドキュメントはどれか」を判断できるようにする
- 残留ファイルを削除し、ドキュメントを実ファイル構成・実装方針に一致させる
- エージェント向けテンプレート（`templates.md`）を現行コード方針に揃える
- MIT LICENSE で再利用条件を明示する

**Non-Goals:**

- CI 追加（`.github/workflows/ci.yml`）— 別 change とする
- docker-compose サービス名変更（`postgres` → `db`）
- `pyproject.toml` の `readme` フィールド削除
- openapi-typescript 等の型自動生成導入
- `.codex/rules/` / `.cursor/rules/` の物理削除やシンボリックリンク化（各ツールの読み込み確認が未実施のため、今回は AGENTS.md への正本明記のみ）

## Decisions

### 1. 空の `backend/migrations/` を削除する

**選択**: ディレクトリ削除 + 文書で方針を明記

**理由**: Alembic は依存に含まれておらず、`.gitkeep` のみのディレクトリは「既にマイグレーションがある」と誤解される。「先回りした構造を置かない」ルールとも整合する。

**代替案**: `.gitkeep` を残し README に注釈のみ — ディレクトリ自体が誤解の温床のため不採用。

### 2. Structure の正は実ファイル構成に合わせる

**選択**: 両ドキュメントに以下を反映

- `backend/.env.example` を記載
- `frontend/src/components/`、`pages/`、`hooks/` を記載（`.gitkeep` で存在）
- `backend/migrations/` は削除に伴い除外
- AGENTS.md の詳細度に README も揃える（ファイル名レベルまで）

### 3. 型同期は手動を正とする

**選択**: AGENTS.md Notes を以下の方針に修正

```text
API レスポンス型は backend/src/schemas を正とし、frontend/src/types/ に手動で対応する型を定義する。
自動生成（openapi-typescript 等）は必要になってから導入する。
```

**理由**: 軽量版として自動生成の仕組みを先回りしない。

### 4. router テンプレートは `Depends` + `Annotated` パターンに統一

**選択**: `health.py` と同型のファクトリ関数 + `Depends` 注入に差し替え

**理由**: モジュールグローバル `_xxx_service = XxxService()` はテスト差し替えが困難で、既に実コードは移行済み。

### 5. ルール正本は AGENTS.md + `.claude/rules/` と明記

**選択**: `.codex/rules/` と `.cursor/rules/` は複製である旨を AGENTS.md に追記。物理削除は行わない。

**理由**: 各ツールがシンボリックリンクや AGENTS.md を確実に読むか未検証。明記だけでも「どれが正か」の迷いは解消できる。

### 6. `codex-guidelines.md` はテンプレートから外す

**選択**: ファイル削除（個人ワークフロー設定のため）

### 7. OpenSpec 残留スキルは 2 ディレクトリのみ削除

**選択**: `openspec-adr-generator` と `opsx-codex-apply` のみ削除

**理由**: 修正指示書のスコープ。なお `openspec/` 配下は今回の change 運用で再導入されているため、他の openspec-* スキルは今回の対象外とする。

### 8. LICENSE は MIT

**選択**: ルートに `LICENSE` を追加

**理由**: 公開テンプレートとして再利用条件を明示する標準的選択。

## Risks / Trade-offs

| リスク | 緩和策 |
| --- | --- |
| `.codex/` / `.cursor/` ルールが `.claude/` と乖離し続ける | AGENTS.md に正本を明記。将来、ツール確認後にシンボリックリンク化を別 change で検討 |
| `migrations/` 削除後に利用者が置き場所に迷う | README と repositories/README の両方に方針を記載 |
| 作業用 md 削除で調査履歴が失われる | 本 change の proposal/design/specs に要件が集約される |

## Migration Plan

1. 削除系（スキル、作業用 md、migrations、codex-guidelines）を実施
2. ドキュメント更新（README、AGENTS.md、repositories/README、templates.md）
3. LICENSE 追加
4. 検証コマンド実行（pytest / ruff / mypy / pnpm build）
5. チェックリスト（proposal の完了条件）で目視確認

ロールバック: git revert で十分（DB や API 変更なし）。

## Open Questions

- なし（修正指示書の推奨方針をそのまま採用）
