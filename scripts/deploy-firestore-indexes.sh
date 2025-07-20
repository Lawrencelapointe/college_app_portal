#!/bin/bash

# GlidrU - Deploy Firestore Indexes Script
# This script deploys Firestore indexes and security rules to Firebase

set -e

echo "🔥 GlidrU Firestore Index Deployment"
echo "===================================="

# Use local Firebase CLI from node_modules
FIREBASE_CMD="./node_modules/.bin/firebase"

# Check if Firebase CLI is installed locally
if [ ! -f "$FIREBASE_CMD" ]; then
    echo "❌ Firebase CLI not found. Installing locally..."
    npm install --save-dev firebase-tools
fi

echo "✅ Using local Firebase CLI from node_modules"

# Check if we're logged in to Firebase
echo "Checking Firebase authentication..."
if ! $FIREBASE_CMD projects:list &> /dev/null; then
    echo "📝 Please log in to Firebase:"
    $FIREBASE_CMD login
fi

# Deploy only Firestore indexes and rules
echo ""
echo "🚀 Deploying Firestore indexes and rules..."
$FIREBASE_CMD deploy --only firestore:indexes,firestore:rules --project glidru

echo ""
echo "✅ Deployment complete! Your Firestore indexes are being created."
echo "Note: Index creation may take a few minutes to complete."
