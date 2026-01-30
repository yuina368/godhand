#!/bin/bash
# Render用デプロイスクリプト

echo "📦 Installing Node.js dependencies..."
npm install

echo "🐍 Installing Python dependencies..."
pip install -r python/requirements.txt

echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build complete!"
