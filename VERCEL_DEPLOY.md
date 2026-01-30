# 🚀 Vercelデプロイガイド（完全版）

## ステップ1: Vercelアカウント作成

1. https://vercel.com にアクセス
2. 「Sign Up」をクリック
3. **GitHubアカウントでサインアップ**（推奨）
4. GitHubの権限を許可

## ステップ2: プロジェクトをインポート

1. Vercelダッシュボードで **「Add New」** → **「Project」** をクリック
2. **「Import Git Repository」** を選択
3. リポジトリ検索で `godhand` を探す
4. **「Import」** をクリック

## ステップ3: プロジェクト設定

### 基本設定:
```
Project Name: godhand（または好きな名前）
Framework Preset: Next.js（自動検出されます）
Root Directory: ./（そのまま）
Build Command: npm run build（自動設定）
Output Directory: .next（自動設定）
Install Command: npm install（自動設定）
```

### 環境変数の追加:

**「Environment Variables」**セクションで以下を追加：

#### 必須:
```
NODE_ENV = production
```

#### Stripe（後で追加OK）:
```
STRIPE_SECRET_KEY = sk_test_your_key_here
STRIPE_WEBHOOK_SECRET = whsec_your_secret_here
STRIPE_PREMIUM_PRICE_ID = price_monthly_id
STRIPE_ONETIME_PRICE_ID = price_onetime_id
```

⚠️ `NEXT_PUBLIC_BASE_URL`は**デプロイ後**に設定します。

## ステップ4: デプロイ開始

1. **「Deploy」** ボタンをクリック
2. ビルドが開始されます（1-3分程度）
3. 成功すると 🎉 画面が表示されます

## ステップ5: URLを確認して環境変数を更新

1. デプロイ完了後、VercelからURLが提供されます
   - 例：`https://godhand-abc123.vercel.app`
2. **「Settings」** → **「Environment Variables」** に移動
3. 新しい環境変数を追加：
```
NEXT_PUBLIC_BASE_URL = https://your-actual-url.vercel.app
```
4. **「Redeploy」** をクリックして再デプロイ

## ステップ6: 自動Keep-Alive設定（重要！）

Vercelは自動でスケールするため、基本的にスリープしませんが、念のため設定：

### cron-job.org:
1. https://cron-job.org でアカウント作成
2. Create Cronjob:
   - **URL**: `https://your-app.vercel.app/api/keep-alive`
   - **Schedule**: `*/10 * * * *`（10分毎）
3. Save

## ステップ7: Stripe Webhook設定

1. Stripeダッシュボード → Developers → Webhooks
2. Add endpoint:
   - **URL**: `https://your-app.vercel.app/api/stripe/webhook`
   - **Events**: `checkout.session.completed`, `customer.subscription.deleted`
3. Signing secretをコピー
4. Vercelの環境変数`STRIPE_WEBHOOK_SECRET`に設定
5. Vercelで再デプロイ

## 🎉 完了！

アプリにアクセス:
```
https://your-app.vercel.app
```

---

## 🔄 今後の更新方法

GitHubにpushするだけで**自動デプロイ**されます！

```bash
git add .
git commit -m "更新内容"
git push origin main
```

Vercelが自動検知して数分でデプロイ完了。

---

## 🐛 トラブルシューティング

### デプロイが失敗する場合
- Vercelの「Deployments」タブ → 失敗したデプロイをクリック → ログ確認

### 環境変数が反映されない
- 環境変数追加後、必ず**Redeploy**が必要

### URLにアクセスできない
- デプロイが完了しているか確認
- ブラウザのキャッシュクリア

---

## 💡 Vercelの利点

- ✅ 無料枠が寛大（個人プロジェクトなら十分）
- ✅ 自動HTTPS対応
- ✅ グローバルCDN（高速配信）
- ✅ GitHubと自動連携
- ✅ プレビューURL（PR毎に自動生成）
- ✅ ゼロダウンタイムデプロイ

## 📊 無料枠の制限

- 帯域幅: 100GB/月
- ビルド時間: 6000分/月
- デプロイ数: 無制限

個人プロジェクトには十分すぎる容量です！

---

準備完了です。Vercelデプロイを始めましょう！
