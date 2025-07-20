/**
 * GlidrU - Authentication Middleware
 * 
 * Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

const admin = require('firebase-admin');

/**
 * Middleware to verify Firebase ID token and attach user info to request
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyToken = async (req, res, next) => {
  // Get the ID token from the Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }
  
  // Extract the token from the Authorization header
  const idToken = authHeader.split('Bearer ')[1];
  
  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Attach the user info to the request object
    req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

/**
 * Middleware to check if user has required role
 * 
 * @param {string|Array<string>} requiredRoles - Role(s) required to access the route
 * @returns {Function} - Express middleware function
 */
const checkRole = (requiredRoles) => {
  // Convert single role to array
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  
  return (req, res, next) => {
    // First ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }
    
    // Check if user has any of the required roles
    const userRoles = req.user.roles || [];
    const hasRequiredRole = roles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
    }
    
    next();
  };
};

/**
 * Optional middleware to attach user info if token is present
 * Doesn't require authentication but will attach user info if available
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const attachUserIfAuthenticated = async (req, res, next) => {
  // Get the ID token from the Authorization header
  const authHeader = req.headers.authorization;
  
  // If no token is provided, continue without attaching user info
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  
  // Extract the token from the Authorization header
  const idToken = authHeader.split('Bearer ')[1];
  
  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Attach the user info to the request object
    req.user = decodedToken;
  } catch (error) {
    // Don't fail the request, just log the error
    console.error('Error verifying optional token:', error);
  }
  
  next();
};

module.exports = {
  verifyToken,
  checkRole,
  attachUserIfAuthenticated
};
