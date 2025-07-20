#!/bin/bash

# GlidrU Startup Script
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

# Function to check command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get Node.js version
get_node_version() {
    if command_exists node; then
        node -v | cut -d'v' -f2
    else
        echo "not installed"
    fi
}

# Function to check dependencies
check_dependencies() {
    local missing_deps=()
    local has_issues=false
    
    echo -e "${YELLOW}🔍 Checking system dependencies...${NC}"
    echo -e "${BLUE}=================================${NC}"
    
    # Check Node.js
    if command_exists node; then
        local node_version=$(get_node_version)
        echo -e "${GREEN}✅ Node.js: v${node_version}${NC}"
    else
        echo -e "${RED}❌ Node.js: not installed${NC}"
        missing_deps+=("nodejs")
        has_issues=true
    fi
    
    # Check npm
    if command_exists npm; then
        local npm_version=$(npm -v)
        echo -e "${GREEN}✅ npm: v${npm_version}${NC}"
    else
        echo -e "${RED}❌ npm: not installed${NC}"
        missing_deps+=("npm")
        has_issues=true
    fi
    
    # Check lsof (for port checking)
    if command_exists lsof; then
        echo -e "${GREEN}✅ lsof: installed${NC}"
    else
        echo -e "${RED}❌ lsof: not installed${NC}"
        missing_deps+=("lsof")
        has_issues=true
    fi
    
    echo -e "${BLUE}=================================${NC}"
    
    if [ "$has_issues" = true ]; then
        echo -e "${YELLOW}⚠️  Missing dependencies detected!${NC}"
        echo -e "${YELLOW}The following dependencies need to be installed:${NC}"
        for dep in "${missing_deps[@]}"; do
            echo -e "  - ${RED}$dep${NC}"
        done
        echo ""
        
        # Provide installation instructions
        echo -e "${BLUE}Installation options:${NC}"
        echo -e "${YELLOW}1. Automatic installation (requires sudo)${NC}"
        echo -e "${YELLOW}2. Manual installation${NC}"
        echo -e "${YELLOW}3. Exit${NC}"
        echo ""
        read -p "Choose an option (1-3): " install_choice
        
        case $install_choice in
            1)
                echo -e "\n${YELLOW}🚀 Starting automatic installation...${NC}"
                
                # Install Node.js if missing
                if [[ " ${missing_deps[@]} " =~ " nodejs " ]]; then
                    echo -e "${BLUE}Installing Node.js...${NC}"
                    
                    # Detect OS and install accordingly
                    if [ -f /etc/debian_version ]; then
                        # Debian/Ubuntu
                        echo "Detected Debian/Ubuntu system"
                        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                        sudo apt-get install -y nodejs
                    elif [ -f /etc/redhat-release ]; then
                        # RHEL/CentOS/Fedora
                        echo "Detected Red Hat-based system"
                        curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
                        sudo yum install -y nodejs
                    elif [ "$(uname)" == "Darwin" ]; then
                        # macOS
                        echo "Detected macOS"
                        if command_exists brew; then
                            brew install node
                        else
                            echo -e "${RED}Homebrew not found. Please install Homebrew first:${NC}"
                            echo "/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                            exit 1
                        fi
                    else
                        echo -e "${RED}Unsupported OS. Please install Node.js manually.${NC}"
                        exit 1
                    fi
                fi
                
                # Install npm separately if missing
                if [[ " ${missing_deps[@]} " =~ " npm " ]]; then
                    echo -e "${BLUE}Installing npm...${NC}"
                    
                    if [ -f /etc/debian_version ]; then
                        # Debian/Ubuntu - npm is a separate package
                        sudo apt-get update && sudo apt-get install -y npm
                    elif [ -f /etc/redhat-release ]; then
                        # RHEL/CentOS/Fedora - npm usually comes with nodejs
                        sudo yum install -y npm
                    elif [ "$(uname)" == "Darwin" ]; then
                        # macOS - npm comes with node
                        echo "npm should have been installed with Node.js"
                    fi
                fi
                
                # Install lsof if missing
                if [[ " ${missing_deps[@]} " =~ " lsof " ]]; then
                    echo -e "${BLUE}Installing lsof...${NC}"
                    
                    if [ -f /etc/debian_version ]; then
                        sudo apt-get update && sudo apt-get install -y lsof
                    elif [ -f /etc/redhat-release ]; then
                        sudo yum install -y lsof
                    elif [ "$(uname)" == "Darwin" ]; then
                        # lsof is typically pre-installed on macOS
                        echo "lsof should be pre-installed on macOS"
                    fi
                fi
                
                echo -e "\n${GREEN}✅ Installation complete! Please run this script again.${NC}"
                exit 0
                ;;
            2)
                echo -e "\n${BLUE}Manual installation instructions:${NC}"
                echo ""
                
                if [[ " ${missing_deps[@]} " =~ " nodejs " ]] || [[ " ${missing_deps[@]} " =~ " npm " ]]; then
                    echo -e "${YELLOW}To install Node.js and npm:${NC}"
                    echo ""
                    echo "  Ubuntu/Debian:"
                    echo "    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -"
                    echo "    sudo apt-get install -y nodejs"
                    echo ""
                    echo "  Red Hat/CentOS/Fedora:"
                    echo "    curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -"
                    echo "    sudo yum install -y nodejs"
                    echo ""
                    echo "  macOS (with Homebrew):"
                    echo "    brew install node"
                    echo ""
                    echo "  Or visit: https://nodejs.org/en/download/"
                    echo ""
                fi
                
                if [[ " ${missing_deps[@]} " =~ " lsof " ]]; then
                    echo -e "${YELLOW}To install lsof:${NC}"
                    echo ""
                    echo "  Ubuntu/Debian:"
                    echo "    sudo apt-get update && sudo apt-get install -y lsof"
                    echo ""
                    echo "  Red Hat/CentOS/Fedora:"
                    echo "    sudo yum install -y lsof"
                    echo ""
                fi
                
                echo -e "${YELLOW}After installing, run this script again.${NC}"
                exit 0
                ;;
            3)
                echo -e "${YELLOW}Exiting...${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid choice. Exiting...${NC}"
                exit 1
                ;;
        esac
    else
        echo -e "${GREEN}✅ All dependencies are installed!${NC}\n"
    fi
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT SIGTERM

echo -e "${PURPLE}🚀 Starting GlidrU...${NC}"
echo -e "${BLUE}=================================${NC}\n"

# Check dependencies first
check_dependencies

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

# Check if node_modules exists or if Firebase is missing
echo -e "${YELLOW}🔍 Checking project dependencies...${NC}"

install_deps=false

# Check if node_modules directory exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 node_modules not found${NC}"
    install_deps=true
else
    # Check if Firebase is installed
    if [ ! -d "node_modules/firebase" ]; then
        echo -e "${YELLOW}📦 Firebase dependency missing${NC}"
        install_deps=true
    else
        echo -e "${GREEN}✅ Firebase dependency found${NC}"
    fi
fi

if [ "$install_deps" = true ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${GREEN}✅ All dependencies are present${NC}"
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
