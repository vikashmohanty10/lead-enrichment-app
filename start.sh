#!/bin/bash

# Lead Enrichment Web App - Start Script
# Webverse Innovators

echo "🚀 Starting Lead Enrichment Web App..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if Flask is installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
fi

# Create database directory if it doesn't exist
mkdir -p database

# Start the application
echo "✅ Starting server on http://localhost:8080"
echo ""
echo "📊 Access the dashboard at: http://localhost:8080"
echo "➕ Add new leads at: http://localhost:8080/new-lead"
echo "📋 View all leads at: http://localhost:8080/leads"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 app.py
