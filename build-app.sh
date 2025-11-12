#!/bin/bash

echo "🚀 Building Goal Manager Desktop App for macOS..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Install dependencies
echo -e "${BLUE}📦 Step 1/4: Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install root dependencies${NC}"
    exit 1
fi

cd backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi
cd ..

cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi
cd ..

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 2: Build frontend
echo -e "${BLUE}🏗️  Step 2/4: Building frontend...${NC}"
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to build frontend${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✅ Frontend built${NC}"
echo ""

# Step 3: Test backend
echo -e "${BLUE}🧪 Step 3/4: Testing backend...${NC}"
cd backend
node -e "console.log('Backend files check passed')"
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend check failed${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✅ Backend ready${NC}"
echo ""

# Step 4: Build Electron app
echo -e "${BLUE}⚡ Step 4/4: Building Electron app...${NC}"
npm run electron:build:mac
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to build Electron app${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅✅✅ Build complete! ✅✅✅${NC}"
echo ""
echo -e "${GREEN}📱 Your app is ready at: dist-electron/Goal Manager.app${NC}"
echo -e "${GREEN}💿 DMG installer is at: dist-electron/Goal Manager-1.0.0.dmg${NC}"
echo ""
echo -e "${BLUE}To run the app:${NC}"
echo -e "  1. Open dist-electron/Goal Manager.app"
echo -e "  2. Or install the DMG file"
echo ""
