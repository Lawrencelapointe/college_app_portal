# 🎓 GlidrU

**Your personalized college selection companion - helping students organize and customize key questions for finding the perfect college match.**

---

*Copyright © 2025 Blue Sky Mind LLC. All rights reserved.*

*This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.*

---

## 📋 Overview

GlidrU is a modern React-based web application designed to streamline the college selection process. This tool helps students organize important questions and criteria that guide their college search journey, providing a personalized approach to finding institutions that match their preferences, goals, and needs.

## ✨ Features

- **🎨 Modern UI/UX**: Beautiful, responsive design with gradient backgrounds and smooth animations
- **📝 Interactive Questions**: Customizable question sets to guide your college selection journey
- **🔄 Real-time Updates**: Dynamic content management with instant feedback
- **📱 Mobile Responsive**: Optimized for all device sizes
- **⚡ Fast Performance**: Lightweight React components with efficient rendering
- **🚀 Easy Deployment**: Simple startup script for development

## 🛠️ Technologies Used

**Frontend:**
- React 18
- React Router for navigation
- Modern CSS with animations
- Responsive design principles

**Backend:**
- Node.js with Express
- JSON-based data storage
- CORS enabled for cross-origin requests
- RESTful API design

**Development Tools:**
- Create React App for project scaffolding
- Hot reload for development
- Concurrent server management

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd college_app_portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   ./start.sh
   ```
   
   This script will:
   - Check for port conflicts
   - Start the backend server (port 3001)
   - Start the frontend React app (port 3000)
   - Open your browser automatically

### Manual Start (Alternative)

If you prefer to start services manually:

```bash
# Start backend server
npm run server

# In a new terminal, start frontend
npm start
```

## 🏗️ Project Structure

```
college_app_portal/
├── src/                    # React frontend source
│   ├── components/         # React components
│   │   ├── Welcome.js      # Landing page component
│   │   ├── Questions.js    # Questions management page
│   │   ├── Footer.js       # Copyright footer component
│   │   └── *.css          # Component stylesheets
│   ├── App.js             # Main React app component
│   └── index.js           # React app entry point
├── data/                   # Data storage
│   └── prompts_for_college_data.json  # Question data
├── public/                 # Static assets
├── server.js              # Express backend server
├── start.sh               # Development startup script
├── package.json           # Project dependencies
├── LICENSE                # Commercial license
└── README.md              # This file
```

## 🌐 Application Routes

- **`/`** - Welcome page with project introduction
- **`/questions`** - Interactive questions management interface

## 🔧 Development

### Available Scripts

- **`npm start`** - Start React development server
- **`npm run server`** - Start Express backend server
- **`npm run dev`** - Start both frontend and backend concurrently
- **`npm test`** - Run test suite
- **`npm run build`** - Build production version

### API Endpoints

- **`GET /api/questions`** - Retrieve all questions
- **`POST /api/questions`** - Create/update questions
- **`GET /`** - Serve React application

### Port Configuration

- **Frontend (React)**: `http://localhost:3000`
- **Backend (Express)**: `http://localhost:3001`

## 🎨 Design Features

- **Gradient Backgrounds**: Modern purple-to-blue gradients
- **Card-based Layout**: Clean, organized content presentation
- **Smooth Animations**: Fade-in effects and hover states
- **Professional Typography**: Clean, readable font choices
- **Responsive Grid**: Adapts to all screen sizes

## 📄 License

**Proprietary Software**

This software is the exclusive property of Blue Sky Mind LLC. All rights reserved.

- ❌ **No copying, distribution, or modification** without explicit written permission
- ❌ **No reverse engineering** or decompilation
- ❌ **No public redistribution** in any form
- ✅ **Licensed for authorized use only**

For licensing inquiries, contact Blue Sky Mind LLC.

## 🚨 Troubleshooting

### Common Issues

**Port 3000 already in use:**
- The startup script will detect this and offer to kill existing processes
- Alternatively, manually stop other services using port 3000

**Dependencies not installing:**
- Ensure you have Node.js v14+ installed
- Try deleting `node_modules/` and running `npm install` again

**Backend not connecting:**
- Verify the backend server is running on port 3001
- Check firewall settings if applicable

## 🤝 Development Guidelines

1. **Code Style**: Follow existing patterns and formatting
2. **Components**: Keep React components modular and reusable  
3. **Commits**: Use meaningful commit messages
4. **Testing**: Test all changes before committing
5. **Documentation**: Update README for significant changes

## 📞 Support

For technical support or feature requests related to this proprietary software, contact the development team at Blue Sky Mind LLC.

---

**Built with ❤️ by Blue Sky Mind LLC**

*GlidrU - Empowering students to find their perfect college match through technology.*
