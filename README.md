# 手相AI Premium - Next.js Application

AIで手相を解析する高級占いサイト（Render無料枠対応・マーカー不要版）

## ✨ 特徴

- **マーカー不要** - 手のひらを撮影するだけで自動解析
- **Next.js 15** - App Router, TypeScript, Tailwind CSS 
- **AI手相解析** - Python (OpenCV) による自動検出
- **Stripe決済** - プレミアム機能の課金システム
- **SEO最適化** - メタタグ完備
- **自動Keep-Alive** - Render無料枠で10分毎に自動ping

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
cd python && pip install -r requirements.txt && cd ..
```

### 2. 環境変数 (.env.local)

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PREMIUM_PRICE_ID=price_xxx
STRIPE_ONETIME_PRICE_ID=price_xxx
```

### 3. 開発サーバー

```bash
npm run dev
```

http://localhost:3000 でアクセス

## 📦 Renderへのデプロイ

### 方法1: GitHub経由（推奨）

1. GitHubにリポジトリを作成
2. Renderダッシュボードで「New Web Service」
3. GitHubリポジトリを接続
4. 以下を設定:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: すべての`.env.local`の値を追加

### 方法2: Git直接プッシュ

```bash
cd nextjs-app
git init
git add .
git commit -m "Initial commit: 手相AI Premium"
git remote add origin https://github.com/yourusername/tesouai-premium.git
git push -u origin main
```

## ⏰ 自動Keep-Alive設定（必須）

Render無料枠は15分アクセスがないとスリープします。以下のサービスで10分毎にpingを設定:

### 推奨: cron-job.org（無料・簡単）

1. https://cron-job.org で無料アカウント作成
2. 「Create cronjob」をクリック
3. 設定:
   - **Title**: 手相AI Keep-Alive
   - **URL**: `https://your-app.onrender.com/api/keep-alive`
   - **Schedule**: Every 10 minutes (*/10 * * * *)
   - **Enabled**: チェックを入れる

### 代替: UptimeRobot

1. https://uptimerobot.com で無料アカウント
2. Add New Monitor:
   - **Type**: HTTP(s)
   - **URL**: `https://your-app.onrender.com/api/keep-alive`
   - **Interval**: 10 minutes

## 🎨 使い方

1. `/reading` ページで手のひらを撮影
2. 手のひら全体が明るく写るように撮影（マーカー不要）
3. AIが自動で手のひらと生命線を検出
4. スコアと運勢を表示
5. プレミアム版で詳細情報を閲覧

## 📁 プロジェクト構造

```
nextjs-app/
├── app/
│   ├── api/              # API routes
│   ├── reading/          # 手相解析ページ
│   ├── pricing/          # 料金プラン
│   └── page.tsx          # ランディングページ
├── components/           # Reactコンポーネント
├── lib/                  # ユーティリティ
└── python/               # 手相解析Python
```

## 🔧 トラブルシューティング

### Pythonが見つからない

Renderで自動的にPython環境が設定されます。ローカルで`python3`が必要です。

### ビルドエラー

```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## 📝 ライセンス

MIT

## ⚠️ 注意

このアプリはエンターテイメント目的です。実際の運勢を保証するものではありません。
