/**
 * GlidrU - User Roles Utility
 * 
 * Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

const admin = require('firebase-admin');

/**
 * Set custom claims for a user
 * 
 * @param {string} uid - Firebase user ID
 * @param {Object} claims - Custom claims to set
 * @returns {Promise<void>}
 */
const setCustomClaims = async (uid, claims) => {
  try {
    // Get the current claims
    const user = await admin.auth().getUser(uid);
    const currentClaims = user.customClaims || {};
    
    // Merge with new claims
    const updatedClaims = { ...currentClaims, ...claims };
    
    // Set the custom claims
    await admin.auth().setCustomUserClaims(uid, updatedClaims);
    
    return true;
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw error;
  }
};

/**
 * Add roles to a user
 * 
 * @param {string} uid - Firebase user ID
 * @param {string|Array<string>} roles - Role(s) to add
 * @returns {Promise<void>}
 */
const addRoles = async (uid, roles) => {
  try {
    // Convert single role to array
    const rolesToAdd = Array.isArray(roles) ? roles : [roles];
    
    // Get the current user
    const user = await admin.auth().getUser(uid);
    const currentClaims = user.customClaims || {};
    
    // Get current roles or initialize empty array
    const currentRoles = currentClaims.roles || [];
    
    // Add new roles (avoiding duplicates)
    const updatedRoles = [...new Set([...currentRoles, ...rolesToAdd])];
    
    // Update claims with new roles
    await admin.auth().setCustomUserClaims(uid, {
      ...currentClaims,
      roles: updatedRoles
    });
    
    return true;
  } catch (error) {
    console.error('Error adding roles:', error);
    throw error;
  }
};

/**
 * Remove roles from a user
 * 
 * @param {string} uid - Firebase user ID
 * @param {string|Array<string>} roles - Role(s) to remove
 * @returns {Promise<void>}
 */
const removeRoles = async (uid, roles) => {
  try {
    // Convert single role to array
    const rolesToRemove = Array.isArray(roles) ? roles : [roles];
    
    // Get the current user
    const user = await admin.auth().getUser(uid);
    const currentClaims = user.customClaims || {};
    
    // Get current roles or initialize empty array
    const currentRoles = currentClaims.roles || [];
    
    // Remove specified roles
    const updatedRoles = currentRoles.filter(role => !rolesToRemove.includes(role));
    
    // Update claims with new roles
    await admin.auth().setCustomUserClaims(uid, {
      ...currentClaims,
      roles: updatedRoles
    });
    
    return true;
  } catch (error) {
    console.error('Error removing roles:', error);
    throw error;
  }
};

/**
 * Check if a user has a specific role
 * 
 * @param {string} uid - Firebase user ID
 * @param {string|Array<string>} roles - Role(s) to check
 * @returns {Promise<boolean>} - True if user has any of the specified roles
 */
const hasRole = async (uid, roles) => {
  try {
    // Convert single role to array
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    
    // Get the current user
    const user = await admin.auth().getUser(uid);
    const currentClaims = user.customClaims || {};
    
    // Get current roles or initialize empty array
    const currentRoles = currentClaims.roles || [];
    
    // Check if user has any of the specified roles
    return rolesToCheck.some(role => currentRoles.includes(role));
  } catch (error) {
    console.error('Error checking roles:', error);
    throw error;
  }
};

/**
 * Get all roles for a user
 * 
 * @param {string} uid - Firebase user ID
 * @returns {Promise<Array<string>>} - Array of roles
 */
const getUserRoles = async (uid) => {
  try {
    // Get the current user
    const user = await admin.auth().getUser(uid);
    const currentClaims = user.customClaims || {};
    
    // Return roles or empty array
    return currentClaims.roles || [];
  } catch (error) {
    console.error('Error getting user roles:', error);
    throw error;
  }
};

module.exports = {
  setCustomClaims,
  addRoles,
  removeRoles,
  hasRole,
  getUserRoles
};
