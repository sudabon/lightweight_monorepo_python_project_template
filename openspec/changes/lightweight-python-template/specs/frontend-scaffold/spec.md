## ADDED Requirements

### Requirement: フロントエンド雛形の構成

`frontend/` に React + TypeScript + Vite の最小雛形を配置 SHALL する。`package.json` / `vite.config.ts` / `index.html` と `src/` 配下に `main.tsx` / `App.tsx` / `components/` / `pages/` / `hooks/` / `lib/` / `types/` を用意 MUST する。

#### Scenario: フロントエンド構成が存在する

- **WHEN** `frontend/` を確認する
- **THEN** `package.json` / `vite.config.ts` / `index.html` と `src/main.tsx` / `src/App.tsx` および `components`/`pages`/`hooks`/`lib`/`types` ディレクトリが存在する

### Requirement: API 呼び出しの集約

フロントエンドの API 呼び出しは `src/lib/api.ts` に集約 SHALL し、画面コンポーネントから直接 `fetch` を乱用 MUST NOT。API レスポンス型は `src/types/` に配置 MUST する。

#### Scenario: API クライアントが集約されている

- **WHEN** `frontend/src/` を確認する
- **THEN** API 呼び出しの基盤が `src/lib/api.ts` に存在し、レスポンス型が `src/types/` に置かれている

### Requirement: フロントエンドの起動とビルド

`frontend/` で `pnpm install` 後に `pnpm dev` で開発サーバが起動し、`pnpm build` が成功 SHALL する。TanStack Query・Shadcn/ui・TailwindCSS は任意導入とし、軽量版では必須 MUST NOT。

#### Scenario: 開発サーバとビルドが動作する

- **WHEN** `frontend/` で `pnpm install` 後に `pnpm build` を実行する
- **THEN** ビルドがエラーなく完了する
