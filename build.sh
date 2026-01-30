#!/bin/bash
set -e

echo "📦 Installing Node.js dependencies..."
npm install

echo "🐍 Checking Python environment..."
python3 --version || python --version

echo "🐍 Installing Python dependencies..."
pip3 install -r python/requirements.txt || pip install -r python/requirements.txt

echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build complete!"
