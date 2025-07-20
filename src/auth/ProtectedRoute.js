/**
 * GlidrU - Protected Route Component
 * 
 * Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './ProtectedRoute.css';

/**
 * ProtectedRoute component to restrict access to authenticated users
 * Optionally can require specific roles
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {Array<string>|string} [props.requiredRoles] - Optional role or array of roles required to access this route
 * @returns {React.ReactNode} - Either the children or a redirect to login/unauthorized
 */
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { currentUser, loading, userRoles, hasRole, getIdTokenResult } = useAuth();
  const location = useLocation();
  const [checkingRoles, setCheckingRoles] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  
  // Convert single role to array for consistency
  const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  
  // Effect to check roles when component mounts or when dependencies change
  useEffect(() => {
    const checkAccess = async () => {
      if (!currentUser || rolesToCheck.length === 0) {
        setHasAccess(!!currentUser); // Access granted if user is logged in and no roles required
        setCheckingRoles(false);
        return;
      }
      
      // Force a token refresh to get the latest roles
      await getIdTokenResult(true);
      
      // Check if user has any of the required roles
      const access = rolesToCheck.some(role => hasRole(role));
      setHasAccess(access);
      setCheckingRoles(false);
    };
    
    if (currentUser && rolesToCheck.length > 0) {
      setCheckingRoles(true);
      checkAccess();
    } else {
      setHasAccess(!!currentUser);
    }
  }, [currentUser, rolesToCheck, hasRole, getIdTokenResult]);
  
  // If still loading auth state or checking roles, show loading indicator
  if (loading || checkingRoles) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If roles are required but user doesn't have them
  if (rolesToCheck.length > 0 && !hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and has required roles (if any)
  return children;
};

export default ProtectedRoute;
