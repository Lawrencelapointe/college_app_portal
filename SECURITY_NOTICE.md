# GlidrU Security Notice

## Authentication System

GlidrU implements a secure authentication system using Firebase Authentication and Firebase Admin SDK. This document outlines the security practices and considerations for the application.

## ⚠️ Important: Credential Files Are Tracked in This Repository

This private repository intentionally tracks the following sensitive files:

1. **`.env`** - Contains Firebase client-side configuration
2. **`server/config/serviceAccountKey.json`** - Contains Firebase Admin SDK service account credentials

### Why These Files Are Tracked

- This is a **private repository** with controlled access
- Credentials need to propagate across the development team
- Simplifies deployment and development workflow

### Security Considerations

- **NEVER** make this repository public
- Only grant repository access to trusted team members
- Rotate credentials regularly
- Monitor Firebase usage for any unauthorized access
- Use HTTPS in production environments
- Keep Firebase SDK versions updated

### If You Fork This Repository

If you fork or clone this repository:
1. **Immediately** add these files to your `.gitignore`
2. Generate your own Firebase credentials
3. Never commit these files to a public repository

### Files Containing Sensitive Data

- `.env`
- `server/config/serviceAccountKey.json`

### To Re-secure These Files

To stop tracking these files and secure them:

1. Add them back to `.gitignore`
2. Remove them from git tracking: 
   ```bash
   git rm --cached .env
   git rm --cached server/config/serviceAccountKey.json
   ```
3. Commit the changes

---

## Authentication Implementation

### Frontend Security

- Firebase Authentication is used for user authentication (email/password and social logins)
- Authentication state is managed through React Context API
- Protected routes prevent unauthorized access to restricted content
- JWT tokens are securely stored and managed
- User roles control access to premium features

### Backend Security

- Firebase Admin SDK verifies ID tokens on all protected routes
- Express middleware validates authentication before allowing access to protected resources
- Role-based access control restricts endpoints based on user permissions
- No sensitive operations can be performed without proper authentication
- User claims are managed securely through Firebase custom claims

### Environment Variables

- All sensitive configuration is stored in environment variables
- `.env.example` provides a template for required variables
- Production credentials should be managed through secure CI/CD pipelines

### Best Practices

- No plaintext passwords are stored
- Authentication errors provide minimal information to prevent enumeration attacks
- Token validation occurs on every protected request
- CORS is properly configured to prevent unauthorized cross-origin requests

**Last Updated:** July 19, 2025
