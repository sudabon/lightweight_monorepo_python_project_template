## ADDED Requirements

### Requirement: テンプレートリポジトリとしての公開

軽量化が完了したリポジトリを GitHub のテンプレートリポジトリとして登録 SHALL する。`gh` CLI（`gh repo edit --template` 等）または GitHub 設定でテンプレートフラグを有効化 MUST し、有効化後はリポジトリ設定に「Template repository」が反映されている MUST。リモートへの公開を伴う操作は実行前にユーザー確認 MUST する。

#### Scenario: テンプレートフラグが有効化される

- **WHEN** 軽量化済みの内容を push 後、テンプレート化操作を実行する
- **THEN** GitHub 上で当該リポジトリの "Template repository" が有効になり、`Use this template` が利用可能になる

#### Scenario: 公開前に確認する

- **WHEN** リモートへの push やテンプレート公開操作を行う直前
- **THEN** 実行内容（対象リポジトリ・可視性・テンプレート化）をユーザーに提示し、承認を得てから実行する

### Requirement: テンプレートとして成立する完了状態

テンプレート公開時点で、README.md / AGENTS.md が軽量版向けに整備され、`GET /health` が動作し、`uv run pytest` が成功し、アーキテクチャテストと `todo_app` 固有名・名称揺れが残っていない状態 SHALL を満たす。

#### Scenario: 完了条件を満たす

- **WHEN** テンプレート公開前に完了条件を点検する
- **THEN** ガイド12章 Python版の完了条件（README/AGENTS 整備、health 動作、pytest 成功、arch テスト削除、`todo_app` 不在、名称揺れ解消）をすべて満たしている
