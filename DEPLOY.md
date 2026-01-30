# 手相AI Premium - デプロイガイド

## Renderへのデプロイ手順

### 1. GitHubリポジトリ作成

```bash
cd /home/yui/Desktop/手相AI/nextjs-app
git init
git add .
git commit -m "Initial commit: 手相AI Premium"
```

GitHubで新しいリポジトリを作成後:

```bash
git remote add origin https://github.com/YOUR_USERNAME/tesouai-premium.git
git branch -M main
git push -u origin main
```

### 2. Render設定

1. https://render.com にログイン
2. 「New +」→「Web Service」を選択
3. GitHubアカウントを接続
4. リポジトリを選択
5. 以下を設定:

```
Name: tesouai-premium
Environment: Node
Branch: main
Root Directory: (空欄のまま)
Build Command: chmod +x build.sh && ./build.sh
Start Command: npm start
```

### 3. 環境変数設定

Renderの「Environment」タブで以下を追加:

```
NEXT_PUBLIC_BASE_URL=https://your-app-name.onrender.com
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_PREMIUM_PRICE_ID=price_monthly_id
STRIPE_ONETIME_PRICE_ID=price_onetime_id
NODE_ENV=production
```

### 4. デプロイ開始

「Create Web Service」をクリック。自動的にデプロイが開始されます。

### 5. 自動Keep-Alive設定（重要！）

デプロイ完了後、cron-job.org で設定:

1. https://cron-job.org でアカウント作成
2. Create Cronjob:
   - URL: `https://your-app-name.onrender.com/api/keep-alive`
   - Schedule: `*/10 * * * *` (10分毎)
   - Save

これでRender無料枠でもスリープしなくなります。

### 6. StripeWebhook設定

Stripeダッシュボード → Developers → Webhooks → Add endpoint:

- URL: `https://your-app-name.onrender.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.deleted`

Signing secretをコピーして、環境変数 `STRIPE_WEBHOOK_SECRET` に設定。

## 完了！

https://your-app-name.onrender.com でアプリにアクセスできます。
