## ADDED Requirements

### Requirement: 軽量版 AGENTS.md

`AGENTS.md` は人間と AI エージェント双方が読む前提で、軽量版（3責務）の規約を簡潔に記述 SHALL する。Backend rules として「HTTP 処理は `src/api`」「業務処理は `src/services`」「DB 処理は `src/repositories`」「DB 接続は `src/db.py`」「設定は `src/config.py`」「api から DB を直接操作しない」「api に業務ロジックを書かない」を含 MUST む。Frontend rules・Commands（`uv sync` / `uv run uvicorn src.main:app --reload` / `uv run pytest` / `pnpm install` / `pnpm dev` / `pnpm build`）も含 MUST む。

#### Scenario: 軽量版規約が記載されている

- **WHEN** `AGENTS.md` を確認する
- **THEN** 3責務（api/services/repositories）の分離ルールと、backend/frontend のコマンドが記載されている
- **AND** 4層 Clean Architecture（domain/app/interface/infra）の強制記述が残っていない

### Requirement: 軽量版 README.md

`README.md` は軽量版テンプレートとして、概要・ディレクトリ構成・起動方法・テスト・開発ルール・環境変数を記述 SHALL する。「Clean Architecture の厳密な4層ではなく api/service/repository の3責務に絞った軽量構成」である旨を明記 MUST し、`todo_app` 参照を残 MUST NOT。

#### Scenario: README が軽量版を説明している

- **WHEN** `README.md` を確認する
- **THEN** 3責務構成・起動方法・テスト・環境変数が記載され、`todo_app` 参照が存在しない

### Requirement: エージェント規約の更新

`.claude/rules/`・`.codex/rules/`・`.cursor/rules/` の規約は軽量版の責務分離に整合 SHALL する。厳密な4層強制（依存方向 `interface → app → domain` 等の強制、4層フォルダ強制）を記述する `architecture.md` 相当の内容は削除または軽量版ルールへ置換 MUST する。3つのエージェント間で内容が矛盾 MUST NOT。

#### Scenario: 4層強制ルールが除去されている

- **WHEN** `.claude/rules/`・`.codex/rules/`・`.cursor/rules/` を確認する
- **THEN** 4層 Clean Architecture の強制記述が無く、3責務（api/services/repositories）に基づくルールに統一されている

### Requirement: アーキテクチャテストの削除

ディレクトリ構造・依存方向をテストで強制しない方針とし、`backend/tests/arch/` を削除 SHALL する。代替として責務分離ルールを `AGENTS.md` に明文で残 MUST す。

#### Scenario: arch テストが存在しない

- **WHEN** `backend/tests/` を確認する
- **THEN** `arch/` ディレクトリおよび `test_dependency_rule.py` / `test_source_structure.py` が存在しない
