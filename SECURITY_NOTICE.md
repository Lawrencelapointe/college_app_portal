# GlidrU Security Notice

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

**Last Updated:** July 19, 2025
