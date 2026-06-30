# 軽量アーキテクチャ原則

## 3責務

- `backend/src/api`: HTTP 入出力、ルーティング、ステータスコードを扱う。
- `backend/src/services`: 業務判断と処理手順を扱う。
- `backend/src/repositories`: DB 読み書きを扱う。実テーブルが出るまで空でよい。

## 共有ファイル

- `backend/src/config.py`: 環境変数と設定値を集約する。
- `backend/src/db.py`: SQLAlchemy async エンジンとセッション factory を集約する。
- `backend/src/schemas`: Pydantic のリクエスト・レスポンス型を置く。

## 禁止事項

- `api` から SQLAlchemy セッションを直接扱わない。
- `api` に業務ロジックを書かない。
- 環境変数を各モジュールで直接読まない。
- 実データが無い段階で過剰な抽象を作らない。
