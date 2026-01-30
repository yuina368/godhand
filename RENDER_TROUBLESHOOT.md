# 🔍 Renderデプロイエラーの対処法

## ステップ1: ログを確認する

1. Renderダッシュボードを開く
2. `tesouai-premium`サービスをクリック
3. 左メニューの **「Logs」** をクリック
4. エラーが出ている部分をスクロールして確認

**よくあるエラー**:
- `FATAL ERROR: Reached heap limit` → メモリ不足
- `Error: Command failed` → ビルドコマンド失敗
- `ModuleNotFoundError` → Python依存関係の問題

## ステップ2: 簡易デプロイ（推奨）

エラーが続く場合、まず**Pythonなし**でデプロイして動作確認：

### Renderの設定を以下に変更:

```
Build Command: npm install && npm run build
Start Command: npm start
```

これでNext.jsアプリだけがデプロイされます。
手相解析は一時的にモックデータで動作します（既にフォールバック実装済み）。

## ステップ3: 環境変数確認

最低限必要な環境変数:
```
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-app.onrender.com
```

Stripe関連は後で追加OK。

## よくある原因と解決策

### メモリ不足の場合
- Renderの無料枠はメモリ512MB制限
- `build.sh`を使わず、直接`npm install && npm run build`を使用

### ビルド時間超過
- 無料枠は10分制限
- `npm ci`より`npm install`が速い場合がある

### Node.jsバージョン
- Render設定の「Environment」タブで確認
- Node 18以上を推奨

## 次のステップ

1. 上記の簡易デプロイを試す
2. 成功したらURLにアクセス
3. 動作確認後、Python機能は別途追加

ログのエラーメッセージを教えていただければ、具体的に対処できます！
