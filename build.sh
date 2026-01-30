#!/bin/bash
set -e

echo "📦 Installing Node.js dependencies..."
npm ci --prefer-offline --no-audit

echo "🏗️ Building Next.js application..."
NODE_OPTIONS="--max-old-space-size=2048" npm run build

echo "✅ Build complete!"
