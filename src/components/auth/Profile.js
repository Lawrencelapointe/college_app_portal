/**
 * GlidrU - User Profile Component
 * 
 * Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import './Profile.css';

const Profile = () => {
  const { currentUser, getIdToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const [resending, setResending] = useState(false);
  
  const handleResendVerificationEmail = async () => {
    try {
      setResending(true);
      setError('');
      setResendSuccess('');
      
      await sendEmailVerification(currentUser);
      
      setResendSuccess('Verification email sent! Please check your inbox.');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setResendSuccess('');
      }, 5000);
    } catch (error) {
      console.error('Error sending verification email:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else {
        setError('Failed to send verification email. Please try again.');
      }
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setResending(false);
    }
  };
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Get the ID token for API call
        const token = await getIdToken();
        
        if (!token) {
          throw new Error('No authentication token available');
        }
        
        // Fetch user profile from backend
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [currentUser, getIdToken]);
  
  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }
  
  if (!currentUser) {
    return <div className="profile-error">Please log in to view your profile.</div>;
  }
  
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Your Profile</h2>
          {!currentUser.emailVerified && (
            <button 
              className="resend-email-btn"
              onClick={handleResendVerificationEmail}
              disabled={resending}
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </button>
          )}
        </div>
        
        {error && <div className="profile-error">{error}</div>}
        {resendSuccess && <div className="profile-success">{resendSuccess}</div>}
        
        <div className="profile-info">
          <div className="profile-avatar">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" />
            ) : (
              <div className="profile-avatar-placeholder">
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
              </div>
            )}
          </div>
          
          <div className="profile-details">
            <div className="profile-field">
              <label>Name:</label>
              <span>{currentUser.displayName || 'Not provided'}</span>
            </div>
            
            <div className="profile-field">
              <label>Email:</label>
              <span>{currentUser.email}</span>
              {currentUser.emailVerified ? (
                <span className="verified-badge">Verified</span>
              ) : (
                <span className="unverified-badge">Not Verified</span>
              )}
            </div>
            
            {profile && profile.roles && profile.roles.length > 0 && (
              <div className="profile-field">
                <label>Membership:</label>
                <div className="role-badges">
                  {profile.roles.map(role => (
                    <span key={role} className={`role-badge ${role}`}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="profile-field">
              <label>Account Created:</label>
              <span>
                {currentUser.metadata?.creationTime 
                  ? new Date(currentUser.metadata.creationTime).toLocaleDateString() 
                  : 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
