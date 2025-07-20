/**
 * GlidrU - User Roles Utility for Frontend
 * 
 * Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

import { auth } from '../firebaseConfig';

/**
 * Get the current user's ID token result which contains custom claims
 * @returns {Promise<Object>} The decoded ID token with claims
 */
export const getCurrentUserClaims = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }
    
    // Force token refresh if it's older than 5 minutes
    const tokenResult = await user.getIdTokenResult(true);
    return tokenResult.claims;
  } catch (error) {
    console.error('Error getting user claims:', error);
    return null;
  }
};

/**
 * Check if the current user has a specific role
 * @param {string|Array<string>} roles - Role(s) to check
 * @returns {Promise<boolean>} True if user has any of the specified roles
 */
export const hasRole = async (roles) => {
  try {
    const claims = await getCurrentUserClaims();
    if (!claims) return false;
    
    // Convert single role to array
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    
    // Check if user has roles property and if they have any of the specified roles
    return claims.roles && 
           Array.isArray(claims.roles) && 
           rolesToCheck.some(role => claims.roles.includes(role));
  } catch (error) {
    console.error('Error checking user roles:', error);
    return false;
  }
};

/**
 * Get all roles for the current user
 * @returns {Promise<Array<string>>} Array of roles
 */
export const getUserRoles = async () => {
  try {
    const claims = await getCurrentUserClaims();
    if (!claims || !claims.roles || !Array.isArray(claims.roles)) {
      return [];
    }
    
    return claims.roles;
  } catch (error) {
    console.error('Error getting user roles:', error);
    return [];
  }
};

/**
 * Check if the current user is an admin
 * @returns {Promise<boolean>} True if user is an admin
 */
export const isAdmin = async () => {
  return hasRole('admin');
};

/**
 * Check if the current user is a premium user
 * @returns {Promise<boolean>} True if user is a premium user
 */
export const isPremium = async () => {
  return hasRole('premium');
};

/**
 * Helper function to check if a user has a specific role synchronously
 * This is useful for components that need to render based on roles
 * Note: This should be used with the useEffect hook to update state when roles change
 * @param {Object} user - Firebase user object
 * @param {string} role - Role to check
 * @returns {boolean} True if user has the role (based on cached claims)
 */
export const hasRoleSync = (user, role) => {
  if (!user || !user.claims || !user.claims.roles) {
    return false;
  }
  
  return Array.isArray(user.claims.roles) && user.claims.roles.includes(role);
};

export default {
  getCurrentUserClaims,
  hasRole,
  getUserRoles,
  isAdmin,
  isPremium,
  hasRoleSync
};
