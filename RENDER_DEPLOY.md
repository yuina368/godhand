# 🚀 Renderデプロイ手順（完全版）

## ステップ1: Renderアカウント作成

1. https://render.com にアクセス
2. GitHubアカウントでサインアップ

## ステップ2: 新しいWebサービス作成

1. Renderダッシュボードで **「New +」** → **「Web Service」** をクリック
2. GitHubリポジトリを接続
3. リポジトリ選択: **`yuina368/godhand`** を選択

## ステップ3: サービス設定

以下の設定を入力：

```
Name: tesouai-premium（または好きな名前）
Region: Oregon (US West)
Branch: main
Root Directory: 空欄のまま
Runtime: Node
Build Command: chmod +x build.sh && ./build.sh
Start Command: npm start
```

**Instance Type**: Free を選択

## ステップ4: 環境変数設定

「Environment Variables」セクションで **「Add Environment Variable」** をクリックし、以下を追加：

### 必須の環境変数:

```
NODE_ENV=production
PYTHON_VERSION=3.11.0
NEXT_PUBLIC_BASE_URL=https://your-app-name.onrender.com
```

### Stripe設定（後で追加可能）:

```
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
STRIPE_PREMIUM_PRICE_ID=price_monthly_id
STRIPE_ONETIME_PRICE_ID=price_onetime_id
```

⚠️ **重要**: `NEXT_PUBLIC_BASE_URL` は、デプロイ後にRenderから割り当てられるURL（例：`https://tesouai-premium.onrender.com`）に変更してください。

## ステップ5: デプロイ開始

1. **「Create Web Service」** をクリック
2. ビルドが自動的に開始されます（5-10分程度）
3. ログを確認してエラーがないことを確認

## ステップ6: デプロイ確認

✅ デプロイ成功後、以下のURLでアクセス可能：
```
https://your-app-name.onrender.com
```

## ステップ7: 自動Keep-Alive設定（超重要！）

Render無料枠は15分間アクセスがないとスリープします。これを防ぐために自動pingを設定：

### cron-job.org で設定:

1. https://cron-job.org でアカウント作成（無料）
2. **「Create cronjob」** をクリック
3. 設定入力:
   - **Title**: 手相AI Keep-Alive
   - **URL**: `https://your-app-name.onrender.com/api/keep-alive`
   - **Execution schedule**: **Every 10 minutes** (`*/10 * * * *`)
   - **Enabled**: チェック
4. **「Create」** をクリック

これでアプリが常に起動状態を維持します！

## ステップ8: Stripe Webhook設定（決済機能を使う場合）

1. Stripeダッシュボード → **Developers** → **Webhooks**
2. **「Add endpoint」** をクリック
3. 設定:
   - **Endpoint URL**: `https://your-app-name.onrender.com/api/stripe/webhook`
   - **Events to send**: `checkout.session.completed`, `customer.subscription.deleted`
4. **「Add endpoint」** をクリック
5. **Signing secret** をコピー
6. Renderの環境変数 `STRIPE_WEBHOOK_SECRET` に設定
7. Renderで **「Manual Deploy」** → **「Deploy latest commit」** で再デプロイ

## トラブルシューティング

### ビルドエラーが出る場合:

- Renderのログを確認
- Python環境変数が設定されているか確認
- `build.sh` に実行権限があるか確認

### アプリにアクセスできない:

- デプロイが完了しているか確認
- URLが正しいか確認（`https://`で始まる）
- ブラウザのキャッシュをクリア

### Pythonエラーが出る:

- `python/requirements.txt` が正しいか確認
- OpenCVの依存関係はRenderが自動インストール

## 完了チェックリスト

- [ ] Renderでサービスを作成
- [ ] 環境変数を全て設定
- [ ] デプロイが成功
- [ ] URLでアクセス可能
- [ ] cron-job.orgで自動pingを設定
- [ ] Stripe Webhook設定（決済機能を使う場合）

## 🎉 完了！

これで手相AI Premiumがオンラインで稼働しています！
