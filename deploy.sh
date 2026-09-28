#!/bin/bash

# Lead Enrichment App - Quick Deploy Script
# This script helps you push to GitHub for one-click deployment

echo "🚀 Lead Enrichment App - Deployment Helper"
echo "=========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   https://git-scm.com/downloads"
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI not found. Installing..."
    echo "   Visit: https://cli.github.com/ to install"
    echo ""
    echo "OR manually create a GitHub repo and push:"
    echo "   1. Go to https://github.com/new"
    echo "   2. Create a new repository called 'lead-enrichment-app'"
    echo "   3. Run these commands:"
    echo ""
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Lead Enrichment Web App'"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/lead-enrichment-app.git"
    echo "   git push -u origin main"
    echo ""
    exit 1
fi

echo "✅ Git and GitHub CLI detected!"
echo ""

# Initialize git if not already
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Lead Enrichment Web App"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "🔐 Authenticating with GitHub..."
gh auth status || gh auth login

echo ""
echo "📤 Creating GitHub repository and pushing code..."

# Create repo and push
gh repo create lead-enrichment-app --public --source=. --push || {
    echo "⚠️  Repository might already exist. Pushing to existing repo..."
    git push
}

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "=========================================="
echo "🎉 READY FOR ONE-CLICK DEPLOYMENT!"
echo "=========================================="
echo ""
echo "Choose a platform and deploy:"
echo ""
echo "1️⃣  RAILWAY (Recommended - Fastest)"
echo "   → Visit: https://railway.app/new"
echo "   → Click 'Deploy from GitHub repo'"
echo "   → Select your 'lead-enrichment-app' repository"
echo "   → Click Deploy"
echo ""
echo "2️⃣  RENDER (Great Free Tier)"
echo "   → Visit: https://render.com/deploy"
echo "   → Click 'New +' → 'Web Service'"
echo "   → Connect your GitHub repository"
echo "   → Click 'Create Web Service'"
echo ""
echo "3️⃣  HEROKU (Classic & Reliable)"
echo "   → Run: heroku create lead-enrichment-webverse"
echo "   → Run: git push heroku main"
echo ""
echo "📖 Full deployment guide: See DEPLOY.md"
echo ""
echo "🌐 Your app will be live in 2-5 minutes!"
echo ""
