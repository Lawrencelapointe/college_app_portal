# 🎓 GlidrU

**Your personalized college selection companion - helping students organize and customize key questions for finding the perfect college match.**

---

*Copyright © 2025 Blue Sky Mind LLC. All rights reserved.*

*This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.*

---

## 📋 Overview

GlidrU is a modern React-based web application designed to streamline the college selection process with personalized user accounts and secure authentication. This tool helps students create and manage their own custom questions and criteria that guide their college search journey, providing a truly personalized approach to finding institutions that match their unique preferences, goals, and needs.

**Key Features:**
- **🔐 Secure User Authentication**: Firebase-powered login and registration system
- **👤 Personal Question Management**: Each user can create, edit, and organize their own custom college selection questions
- **💾 Cloud Data Storage**: User data securely stored and synchronized across devices
- **🎯 Personalized Experience**: Tailored college selection journey based on individual user preferences

## ✨ Features

### 🔐 User Authentication & Management
- **Firebase Authentication**: Secure user registration and login system
- **User Profiles**: Personalized user accounts with secure data management
- **Session Management**: Persistent login sessions across browser sessions
- **Password Security**: Firebase-powered secure password handling

### 📝 Personal Question Management
- **Custom Question Creation**: Users can create their own college selection questions
- **Question Organization**: Edit, delete, and reorder personal questions
- **User-Specific Data**: Each user's questions are private and personalized
- **Real-time Synchronization**: Questions sync instantly across all user devices

### 🎨 User Experience
- **Modern UI/UX**: Beautiful, responsive design with gradient backgrounds and smooth animations
- **📱 Mobile Responsive**: Optimized for all device sizes from desktop to mobile
- **🔄 Real-time Updates**: Dynamic content management with instant feedback
- **⚡ Fast Performance**: Lightweight React components with efficient rendering
- **🚀 Easy Development**: Simple startup script for local development

## 🛠️ Technologies Used

**Frontend:**
- React 18
- React Router for navigation
- Modern CSS with animations
- Responsive design principles

**Backend:**
- Node.js with Express
- Firebase Firestore for cloud database storage
- Firebase Authentication for user management
- User-specific data routing and security
- CORS enabled for cross-origin requests
- RESTful API design with user authentication middleware

**Cloud Services:**
- Firebase Authentication for user login/registration
- Firebase Firestore for real-time database
- Firebase SDK integration

**Development Tools:**
- Create React App for project scaffolding
- Hot reload for development
- Concurrent server management
- Python virtual environment for backend dependencies

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Python virtual environment (required for backend)
- lsof (for port detection; will be installed automatically if missing)
- Firebase account and project setup

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd glidru
   ```

2. **Activate the Python virtual environment:**
   ```bash
   source /home/lcl/LCLDEV/venvs/devenv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Firebase Setup:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password provider)
   - Create a Firestore database
   - Add your Firebase configuration to the project

5. **Start the application:**
   ```bash
   ./start.sh
   ```
   
   This script will:
    - Verify and install missing dependencies (Node.js, npm, lsof) with interactive prompts
    - Check for port conflicts
    - Start the backend server (port 3001)
    - Start the frontend React app (port 3000)
    - Open your default browser automatically

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
glidru/
├── src/                    # React frontend source
│   ├── components/         # React components
│   │   ├── Welcome.js      # Landing page component
│   │   ├── Questions.js    # User questions management page
│   │   ├── Login.js        # User authentication component
│   │   ├── Register.js     # User registration component
│   │   ├── Footer.js       # Copyright footer component
│   │   └── *.css          # Component stylesheets
│   ├── firebase/           # Firebase configuration
│   │   └── config.js       # Firebase project settings
│   ├── App.js             # Main React app component
│   └── index.js           # React app entry point
├── data/                   # Local data storage (legacy)
│   └── prompts_for_college_data.json  # Default question templates
├── public/                 # Static assets
├── server.js              # Express backend server with Firebase integration
├── start.sh               # Development startup script
├── package.json           # Project dependencies
├── LICENSE                # Commercial license
└── README.md              # This file
```

## 🌐 Application Routes

- **`/`** - Welcome page with project introduction
- **`/login`** - User authentication (login/register)
- **`/questions`** - Personal questions management interface (requires authentication)
- **`/profile`** - User profile management (requires authentication)

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
