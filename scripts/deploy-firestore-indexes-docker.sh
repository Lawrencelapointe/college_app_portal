#!/bin/bash

# GlidrU - Deploy Firestore Indexes Script (Docker Version)
# This script uses Docker to run Firebase CLI without requiring Node.js 20+

set -e

echo "🔥 GlidrU Firestore Index Deployment (Docker)"
echo "============================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker is installed"

# Run Firebase deployment using Docker
echo ""
echo "🐳 Running Firebase CLI in Docker container..."
echo "Note: You may be prompted to authenticate with Firebase"
echo ""

docker run --rm -it \
  -v "$PWD:/app" \
  -w /app \
  -p 9005:9005 \
  node:20-slim \
  bash -c "
    npm install -g firebase-tools && \
    firebase login --no-localhost && \
    firebase deploy --only firestore:indexes,firestore:rules --project glidru
  "

echo ""
echo "✅ Deployment complete! Your Firestore indexes are being created."
echo "Note: Index creation may take a few minutes to complete."
