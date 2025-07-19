/**
 * GlidrU - Footer Component
 * 
 * Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="copyright-notice">
          © 2025 Blue Sky Mind LLC. All rights reserved.
        </p>
        <div className="footer-links">
          <span className="company-info">Blue Sky Mind LLC</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
