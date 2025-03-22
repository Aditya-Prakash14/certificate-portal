#!/bin/bash

# Color variables for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${CYAN}TEKRONFEST DEPLOYMENT SCRIPT${NC}"
echo -e "${BLUE}=========================================${NC}"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${RED}Netlify CLI is not installed.${NC}"
    echo -e "${CYAN}Installing Netlify CLI globally...${NC}"
    npm install -g netlify-cli
fi

# Clean up any previous builds
echo -e "${CYAN}Cleaning up previous builds...${NC}"
rm -rf dist

# Install dependencies
echo -e "${CYAN}Installing dependencies...${NC}"
npm install

# Build the project
echo -e "${CYAN}Building the project...${NC}"
npm run build

# Build success check
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Build successful!${NC}"
    
    # Check if the dist directory exists
    if [ -d "dist" ]; then
        echo -e "${CYAN}Preparing for Netlify deployment...${NC}"
        
        # Prompt for deployment
        echo -e "${BLUE}Options:${NC}"
        echo -e "1. Deploy to Netlify now"
        echo -e "2. Generate a preview link"
        echo -e "3. Exit"
        read -p "Choose an option (1-3): " choice
        
        case $choice in
            1)
                echo -e "${CYAN}Deploying to Netlify production...${NC}"
                netlify deploy --prod
                ;;
            2)
                echo -e "${CYAN}Generating a preview link...${NC}"
                netlify deploy --open
                ;;
            3)
                echo -e "${CYAN}Exiting. You can deploy manually later using: ${GREEN}netlify deploy --prod${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid option. Exiting.${NC}"
                exit 1
                ;;
        esac
    else
        echo -e "${RED}Build directory 'dist' not found.${NC}"
        exit 1
    fi
else
    echo -e "${RED}Build failed.${NC}"
    exit 1
fi 