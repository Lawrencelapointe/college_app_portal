/**
 * GlidrU - User Management Routes
 * 
 * Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { addRoles, removeRoles, getUserRoles } = require('../utils/userRoles');

// Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    
    // Get user from Firestore (if exists)
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    
    // Return combined data
    res.json({
      uid: req.user.uid,
      email: req.user.email,
      emailVerified: req.user.email_verified,
      displayName: req.user.name,
      roles: req.user.roles || [],
      ...userData
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { displayName, photoURL, ...otherData } = req.body;
    
    // Update Auth profile if needed
    if (displayName || photoURL) {
      const updateParams = {};
      if (displayName) updateParams.displayName = displayName;
      if (photoURL) updateParams.photoURL = photoURL;
      
      await admin.auth().updateUser(uid, updateParams);
    }
    
    // Update Firestore profile
    // Filter out sensitive fields that shouldn't be directly updated
    const filteredData = { ...otherData };
    delete filteredData.email;
    delete filteredData.emailVerified;
    delete filteredData.roles;
    delete filteredData.uid;
    
    await admin.firestore().collection('users').doc(uid).set(filteredData, { merge: true });
    
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Admin routes - require admin role
// Get all users (admin only)
router.get('/all', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    // Get users from Firebase Auth (limited to 1000)
    const listUsersResult = await admin.auth().listUsers(1000);
    
    // Map to simplified user objects
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      disabled: user.disabled,
      roles: (user.customClaims && user.customClaims.roles) || []
    }));
    
    res.json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

// Get user by ID (admin only)
router.get('/:uid', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { uid } = req.params;
    
    // Get user from Firebase Auth
    const user = await admin.auth().getUser(uid);
    
    // Get user data from Firestore
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    
    // Combine Auth and Firestore data
    const combinedData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      disabled: user.disabled,
      roles: (user.customClaims && user.customClaims.roles) || [],
      ...userData
    };
    
    res.json(combinedData);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user roles (admin only)
router.post('/:uid/roles', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { uid } = req.params;
    const { roles, action } = req.body;
    
    if (!roles || !Array.isArray(roles) || !action) {
      return res.status(400).json({ error: 'Invalid request. Provide roles array and action (add/remove)' });
    }
    
    if (action === 'add') {
      await addRoles(uid, roles);
    } else if (action === 'remove') {
      await removeRoles(uid, roles);
    } else {
      return res.status(400).json({ error: 'Invalid action. Use "add" or "remove"' });
    }
    
    // Get updated roles
    const updatedRoles = await getUserRoles(uid);
    
    res.json({ 
      success: true, 
      message: `Roles ${action}ed successfully`, 
      roles: updatedRoles 
    });
  } catch (error) {
    console.error('Error updating user roles:', error);
    res.status(500).json({ error: 'Failed to update user roles' });
  }
});

// Disable/enable user (admin only)
router.put('/:uid/status', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { uid } = req.params;
    const { disabled } = req.body;
    
    if (typeof disabled !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request. Provide disabled status (boolean)' });
    }
    
    await admin.auth().updateUser(uid, { disabled });
    
    res.json({ 
      success: true, 
      message: `User ${disabled ? 'disabled' : 'enabled'} successfully` 
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

module.exports = router;
