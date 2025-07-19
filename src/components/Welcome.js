/**
 * College App Portal - Welcome Component
 * 
 * Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import './Welcome.css';

const Welcome = () => {
  return (
    <>
      <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">🎓 College Selection Portal</h1>
        <p className="welcome-subtitle">
          Your personalized guide to finding the perfect college
        </p>
        <div className="welcome-description">
          <p>
            Welcome to your college selection tool! This portal helps you organize 
            and customize the key questions that will guide your college search journey.
          </p>
          <p>
            Get started by exploring the questions that will help you identify 
            colleges that match your preferences, goals, and needs.
          </p>
        </div>
        <div className="welcome-actions">
          <Link to="/questions" className="primary-button">
            View Questions
          </Link>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Welcome;
