/**
 * GlidrU - Unauthorized Access Component
 * 
 * Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">
          <i className="fas fa-lock"></i>
        </div>
        
        <h1>Access Denied</h1>
        
        <p>
          You don't have permission to access this page. This area requires
          additional privileges or a premium membership.
        </p>
        
        <div className="unauthorized-actions">
          <Link to="/" className="home-button">
            Return to Home
          </Link>
          
          <Link to="/profile" className="profile-button">
            View Your Profile
          </Link>
        </div>
        
        <div className="unauthorized-help">
          <p>
            If you believe you should have access to this page, please contact support
            or check your account status.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
