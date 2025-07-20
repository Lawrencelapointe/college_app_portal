/**
 * GlidrU - Questions Component
 * 
 * Copyright 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuestionGroup from './QuestionGroup';
import QuestionForm from './QuestionForm';
import Footer from './Footer';
import { useAuth } from '../auth/AuthContext';
import './Questions.css';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, getIdToken, currentUser } = useAuth();

  useEffect(() => {
    // Clear questions when user logs out
    if (!currentUser) {
      setQuestions([]);
      setGroupedQuestions({});
      setLoading(false);
      return;
    }
    
    // Load questions for the current user
    loadQuestions();
  }, [currentUser]); // Re-run when currentUser changes
  
  // Ensure we have a fresh token before making API requests
  const getAuthHeaders = async () => {
    // Default headers without authentication
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Only add authorization if we can get a token
    try {
      if (getIdToken) {
        const currentToken = await getIdToken(false);
        if (currentToken) {
          headers['Authorization'] = `Bearer ${currentToken}`;
        }
      }
    } catch (error) {
      console.warn('Could not get auth token:', error);
    }
    
    return headers;
  };

  const loadQuestions = async () => {
    try {
      console.log('Loading questions for user:', currentUser?.uid, currentUser?.email);
      const headers = await getAuthHeaders();
      console.log('Request headers:', headers);
      
      const response = await fetch('http://localhost:3001/api/questions', {
        headers
      });
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      console.log('Received questions:', data.length, 'questions');
      setQuestions(data);
      groupQuestionsByClass(data);
    } catch (error) {
      console.error('Error loading questions:', error);
      // Fallback to empty array if API call fails
      setQuestions([]);
      setGroupedQuestions({});
    } finally {
      setLoading(false);
    }
  };

  const groupQuestionsByClass = (questionsData) => {
    const grouped = questionsData.reduce((acc, question) => {
      const className = question.CLASS;
      if (!acc[className]) {
        acc[className] = [];
      }
      acc[className].push(question);
      return acc;
    }, {});
    setGroupedQuestions(grouped);
  };

  const handleAddQuestion = async (newQuestion) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('http://localhost:3001/api/questions', {
        method: 'POST',
        headers,
        body: JSON.stringify(newQuestion),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add question');
      }
      
      const savedQuestion = await response.json();
      const updatedQuestions = [...questions, savedQuestion];
      setQuestions(updatedQuestions);
      groupQuestionsByClass(updatedQuestions);
      setShowAddForm(false);
      console.log('Added question:', savedQuestion);
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Failed to add question: ' + error.message);
    }
  };

  const handleEditQuestion = async (updatedQuestion) => {
    try {
      const headers = await getAuthHeaders();
      const url = editingQuestion 
        ? `http://localhost:3001/api/questions/${editingQuestion.id}`
        : 'http://localhost:3001/api/questions';
      const method = editingQuestion ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(updatedQuestion),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update question');
      }
      
      const savedQuestion = await response.json();
      const updatedQuestions = questions.map(q => 
        q.id === editingQuestion.id ? savedQuestion : q
      );
      setQuestions(updatedQuestions);
      groupQuestionsByClass(updatedQuestions);
      setEditingQuestion(null);
      console.log('Updated question:', savedQuestion);
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Failed to update question: ' + error.message);
    }
  };

  const handleDeleteQuestion = async (question) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(`http://localhost:3001/api/questions/${question.id}`, {
          method: 'DELETE',
          headers
        });

        if (response.ok) {
          const updatedQuestions = questions.filter(q => q.id !== question.id);
          setQuestions(updatedQuestions);
          groupQuestionsByClass(updatedQuestions);
          console.log('Deleted question:', question.id);
        } else {
          const error = await response.json();
          console.error('Error deleting question:', error);
        }
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  const getClassIcon = (className) => {
    const icons = {
      'General': '🎓',
      'Geography': '🌍', 
      'Academic': '📚',
      'Soccer': '⚽'
    };
    return icons[className] || '📋';
  };

  if (loading) {
    return (
      <div className="questions-container">
        <div className="loading">Loading questions...</div>
      </div>
    );
  }

  return (
    <>
      <div className="questions-container">
        <div className="questions-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <div className="header-content">
            <h1>GlidrU Question Manager</h1>
            <button 
              className="add-button"
              onClick={() => setShowAddForm(true)}
            >
              + Add Question
            </button>
          </div>
        </div>

        {(showAddForm || editingQuestion) && (
          <QuestionForm
            question={editingQuestion}
            onSave={editingQuestion ? handleEditQuestion : handleAddQuestion}
            onCancel={() => {
              setShowAddForm(false);
              setEditingQuestion(null);
            }}
          />
        )}

        <div className="questions-content">
          {Object.keys(groupedQuestions).length === 0 ? (
            <div className="empty-state">
              <p>No questions found. Click "Add Question" to get started!</p>
            </div>
          ) : (
            Object.entries(groupedQuestions).map(([className, classQuestions]) => (
              <QuestionGroup
                key={className}
                className={className}
                icon={getClassIcon(className)}
                questions={classQuestions}
                onEdit={setEditingQuestion}
                onDelete={handleDeleteQuestion}
              />
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Questions;
