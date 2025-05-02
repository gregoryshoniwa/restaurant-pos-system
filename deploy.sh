#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Clean up previous builds
echo "🧹 Cleaning up previous builds..."
rm -rf .next out build.zip

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create production build
echo "🛠️ Creating production build..."
npm run build

if [ ! -d "out" ]; then
    echo "❌ Build failed - 'out' directory not created"
    exit 1
fi

# Create zip file
echo "📚 Creating deployment package..."
cd out
zip -r ../build.zip *
cd ..

echo "✅ Build completed successfully!"
echo "📁 Your deployment package is ready: build.zip"
echo ""
echo "Next steps:"
echo "1. Upload build.zip to your cPanel account"
echo "2. Extract the contents to your public_html directory"
echo "3. Set up .htaccess file as described in DEPLOYMENT.md"
echo "4. Test your deployment using the checklist in DEPLOYMENT.md"
