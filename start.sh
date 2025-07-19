#!/bin/bash

# College App Portal Startup Script
# Runs both backend and frontend servers
#
# Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
#
# This software is proprietary and confidential. Unauthorized copying,
# distribution, or use is strictly prohibited.

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to handle cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    # Kill all background jobs
    jobs -p | xargs -r kill
    echo -e "${GREEN}Servers stopped.${NC}"
    exit 0
}

# Function to check if a port is in use
check_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}🔄 Killing process $pid on port $port...${NC}"
        kill -9 $pid
        sleep 1
        return 0
    else
        return 1
    fi
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT SIGTERM

echo -e "${PURPLE}🚀 Starting College App Portal...${NC}"
echo -e "${BLUE}=================================${NC}"

# Check for port conflicts
echo -e "${YELLOW}🔍 Checking for port conflicts...${NC}"

PORT_CONFLICTS=false

if check_port 3000; then
    echo -e "${RED}⚠️  Port 3000 is already in use${NC}"
    PORT_CONFLICTS=true
fi

if check_port 3001; then
    echo -e "${RED}⚠️  Port 3001 is already in use${NC}"
    PORT_CONFLICTS=true
fi

if [ "$PORT_CONFLICTS" = true ]; then
    echo -e "${YELLOW}Would you like to kill the existing processes? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        kill_port 3000
        kill_port 3001
        echo -e "${GREEN}✅ Existing processes terminated${NC}"
    else
        echo -e "${RED}❌ Cannot start servers with ports in use${NC}"
        echo -e "${YELLOW}💡 Try different ports or kill existing processes manually${NC}"
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
fi

# Start backend server
echo -e "${GREEN}🔧 Starting backend server on port 3001...${NC}"
npm run server &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo -e "${GREEN}🎨 Starting frontend server on port 3000...${NC}"
npm start &
FRONTEND_PID=$!

echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}✅ Both servers are starting up!${NC}"
echo -e "${YELLOW}📱 Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}🔧 Backend:  http://localhost:3001${NC}"
echo -e "${BLUE}=================================${NC}"
echo -e "${PURPLE}Press Ctrl+C to stop all servers${NC}"

# Wait for background processes
wait
