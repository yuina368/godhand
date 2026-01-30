# 🚀 デプロイ方法の選択肢

Renderで問題が続く場合、以下の代替案があります。

---

## 🌟 おすすめ: Vercel（最も簡単）

**メリット**:
- Next.js公式ホスティング
- 無料枠が寛大
- GitHubと自動連携
- ビルドが高速
- **Pythonは動かないが、今回のアプリはフォールバック実装済みで問題なし**

### デプロイ手順（5分）:

1. https://vercel.com にアクセス
2. GitHubでサインアップ
3. 「Add New Project」→ `yuina368/godhand` を選択
4. **Root Directory**: 空欄のまま
5. **Framework Preset**: Next.js（自動検出）
6. 環境変数を追加:
```
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=（後で設定）
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PREMIUM_PRICE_ID=
STRIPE_ONETIME_PRICE_ID=
```
7. 「Deploy」をクリック

**完了！** 数分でデプロイ完了します。

デプロイ後、`NEXT_PUBLIC_BASE_URL`をVercelから提供されるURL（例：`https://godhand.vercel.app`）に更新。

---

## 🚂 Railway（Python対応）

**メリット**:
- Node.js + Python両方サポート
- 無料枠あり（$5/月クレジット）
- 設定が簡単

### デプロイ手順:

1. https://railway.app にアクセス
2. GitHubでサインアップ
3. 「New Project」→「Deploy from GitHub repo」
4. リポジトリ選択: `yuina368/godhand`
5. 環境変数を追加（Vercelと同じ）
6. 自動デプロイ開始

---

## 🎯 Netlify

**メリット**:
- 無料枠が寛大
- CDN高速配信
- 簡単設定

### デプロイ手順:

1. https://netlify.com にアクセス
2. 「Add new site」→「Import from Git」
3. GitHubリポジトリ選択
4. **Build command**: `npm run build`
5. **Publish directory**: `.next`
6. 環境変数を追加
7. Deploy

---

## 💡 既存アプリをそのまま使う

新しいNext.jsアプリがうまくいかない場合、**既存の FastAPI アプリ**（`/home/yui/Desktop/手相AI/`）をデプロイする方が簡単かもしれません。

### Renderで既存アプリをデプロイ:

1. 新しいWeb Service作成
2. リポジトリ: 同じもの
3. **Root Directory**: 空欄（またはnextjs-app以外）
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. デプロイ

こちらの方がシンプルで確実です。

---

## 📊 比較表

| プラットフォーム | 無料枠 | Python対応 | 簡単さ | おすすめ度 |
|---|---|---|---|---|
| **Vercel** | ◎ | × | ◎ | ★★★★★ |
| Railway | ○ | ◎ | ◎ | ★★★★☆ |
| Netlify | ◎ | △ | ◎ | ★★★☆☆ |
| Render | ○ | ◎ | △ | ★★☆☆☆ |
| 既存FastAPI | ○ | ◎ | ◎ | ★★★★☆ |

---

## 🎯 私のおすすめ

1. **最速で動かしたい** → **Vercel**（Python機能はモックで動作）
2. **Python機能も完全に動かしたい** → **Railway**
3. **シンプルに動かしたい** → **既存FastAPIアプリ**

どれを試してみますか？
