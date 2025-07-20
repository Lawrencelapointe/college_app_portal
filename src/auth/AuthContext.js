/**
 * GlidrU - Authentication Context
 * 
 * Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getCurrentUserClaims, getUserRoles } from './userRoles';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and provides auth context
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Re-enable loading state
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [userClaims, setUserClaims] = useState(null);

  // Sign up function
  const signup = async (email, password, displayName) => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      return userCredential.user;
    } catch (error) {
      setError(formatAuthError(error));
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setError(formatAuthError(error));
      throw error;
    }
  };

  // Google sign-in function
  const signInWithGoogle = async () => {
    try {
      setError('');
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return userCredential.user;
    } catch (error) {
      setError(formatAuthError(error));
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
    } catch (error) {
      setError(formatAuthError(error));
      throw error;
    }
  };

  // Password reset function
  const resetPassword = async (email) => {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(formatAuthError(error));
      throw error;
    }
  };

  // Get ID token for backend API calls
  const getIdToken = async (forceRefresh = false) => {
    if (!currentUser) return null;
    try {
      const token = await currentUser.getIdToken(forceRefresh);
      setToken(token);
      return token;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  };
  
  // Get ID token result with claims
  const getIdTokenResult = async (forceRefresh = false) => {
    if (!currentUser) return null;
    try {
      const tokenResult = await currentUser.getIdTokenResult(forceRefresh);
      setUserClaims(tokenResult.claims);
      if (tokenResult.claims.roles) {
        setUserRoles(tokenResult.claims.roles);
      }
      return tokenResult;
    } catch (error) {
      console.error('Error getting ID token result:', error);
      return null;
    }
  };
  
  // Check if user has a specific role
  const hasRole = (role) => {
    if (!userRoles || !userRoles.length) return false;
    return userRoles.includes(role);
  };
  
  // Check if user is admin
  const isAdmin = () => hasRole('admin');
  
  // Check if user is premium
  const isPremium = () => hasRole('premium');

  // Format Firebase auth errors to user-friendly messages
  const formatAuthError = (error) => {
    const errorCode = error.code;
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or try logging in.';
      case 'auth/invalid-email':
        return 'The email address is not valid.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please check your email or sign up.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again or reset your password.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completing the sign-in process.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email but different sign-in credentials.';
      case 'auth/operation-not-allowed':
        return 'This operation is not allowed. Please contact support.';
      case 'auth/requires-recent-login':
        return 'This operation requires a recent login. Please log in again.';
      default:
        return `Authentication error: ${error.message}`;
    }
  };

  // Effect to handle auth state changes
  useEffect(() => {
    console.log('AuthContext: Setting up authentication observer');
    
    // Set a very quick timeout as a safety net
    const authTimeout = setTimeout(() => {
      console.warn('Auth check timeout - proceeding without auth');
      setLoading(false);
    }, 2000); // 2 second timeout
    
    let unsubscribe = null;
    
    try {
      // Set up the auth state observer
      unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          console.log('Auth state changed:', user ? 'User logged in' : 'No user');
          clearTimeout(authTimeout);
          
          // Handle the user state synchronously first
          setCurrentUser(user);
          setLoading(false);
          
          // Handle async operations separately
          if (user) {
            // Don't wait for these operations
            getIdToken().catch(err => console.error('Error getting token:', err));
            getIdTokenResult(true).catch(err => console.error('Error getting token result:', err));
          } else {
            setToken(null);
            setUserRoles([]);
            setUserClaims(null);
          }
        },
        (error) => {
          console.error('Auth observer error:', error);
          clearTimeout(authTimeout);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Error setting up auth observer:', error);
      clearTimeout(authTimeout);
      setLoading(false);
    }
    
    // Cleanup function
    return () => {
      clearTimeout(authTimeout);
      if (unsubscribe) {
        unsubscribe();
      }
    };
    
    /* OLD CODE - KEEPING FOR REFERENCE

    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        // Clear the timeout since auth state has changed
        clearTimeout(authTimeout);
        
        setCurrentUser(user);
        if (user) {
          try {
            // Get the ID token when user is authenticated
            await getIdToken();
            
            // Get user claims and roles
            const tokenResult = await getIdTokenResult(true);
            
            // Refresh token every 30 minutes to ensure claims are up to date
            const refreshInterval = setInterval(() => {
              getIdTokenResult(true).catch(err => {
                console.error('Error refreshing token:', err);
              });
            }, 30 * 60 * 1000); // 30 minutes
            
            return () => clearInterval(refreshInterval);
          } catch (error) {
            console.error('Error during authentication initialization:', error);
          }
        } else {
          setToken(null);
          setUserRoles([]);
          setUserClaims(null);
        }
        setLoading(false);
      }, (error) => {
        // Handle auth observer error
        console.error('Auth state observer error:', error);
        clearTimeout(authTimeout);
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => {
        clearTimeout(authTimeout);
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth state observer:', error);
      clearTimeout(authTimeout);
      setLoading(false);
      return () => {}; // Return empty cleanup function
    }
    */
  }, []);

  // Context value to be provided
  const value = {
    currentUser,
    token,
    loading,
    error,
    userRoles,
    userClaims,
    signup,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    getIdToken,
    getIdTokenResult,
    hasRole,
    isAdmin,
    isPremium,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="loading-container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100%'
        }}>
          <div className="loading-spinner" style={{
            border: '4px solid rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            marginBottom: '10px'
          }}></div>
          <p>Loading application...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
