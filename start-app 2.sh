#!/bin/bash

# Goal Manager Launch Script
echo "🎯 Starting Goal Manager..."

cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Launch Electron app
echo "🚀 Launching Goal Manager Desktop App..."
npx electron .
