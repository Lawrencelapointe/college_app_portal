/**
 * GlidrU - Backend Server
 * 
 * Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

// Initialize Firebase Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require('./server/config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

// Import routes and middleware
const userRoutes = require('./server/routes/userRoutes');
const { verifyToken, checkRole, attachUserIfAuthenticated } = require('./server/middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;
const QUESTIONS_FILE = path.join(__dirname, 'data', 'prompts_for_college_data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Apply optional auth middleware to all routes
// This will attach user info to req.user if a valid token is provided
app.use(attachUserIfAuthenticated);

// API Routes
app.use('/api/user', userRoutes);

// Firestore collection reference for user questions
const questionsCollection = db.collection('questions');

// Get questions for a specific user
const getUserQuestions = async (userId) => {
  try {
    console.log(`Getting questions for user: ${userId}`);
    
    const snapshot = await questionsCollection
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const questions = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      questions.push({ id: doc.id, ...data });
    });
    
    console.log(`Found ${questions.length} questions for user ${userId}`);
    
    // Debug: Check for any questions without userId
    const allSnapshot = await questionsCollection.get();
    let legacyCount = 0;
    allSnapshot.forEach(doc => {
      const data = doc.data();
      if (!data.userId) {
        legacyCount++;
        console.log(`WARNING: Question ${doc.id} has no userId field`);
      }
    });
    if (legacyCount > 0) {
      console.log(`WARNING: Found ${legacyCount} legacy questions without userId`);
    }
    
    return questions;
  } catch (error) {
    console.error('Error reading user questions:', error);
    return [];
  }
};

// Add a question for a user
const addUserQuestion = async (userId, questionData) => {
  try {
    const docRef = await questionsCollection.add({
      ...questionData,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { id: docRef.id, ...questionData };
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};

// Update a question for a user
const updateUserQuestion = async (userId, questionId, questionData) => {
  try {
    const docRef = questionsCollection.doc(questionId);
    const doc = await docRef.get();
    
    if (!doc.exists || doc.data().userId !== userId) {
      throw new Error('Question not found or unauthorized');
    }
    
    await docRef.update({
      ...questionData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { id: questionId, ...questionData };
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

// Delete a question for a user
const deleteUserQuestion = async (userId, questionId) => {
  try {
    console.log(`Attempting to delete question ${questionId} for user ${userId}`);
    
    const docRef = questionsCollection.doc(questionId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log(`Question ${questionId} does not exist in database`);
      throw new Error('Question not found or unauthorized');
    }
    
    const questionData = doc.data();
    console.log(`Question ${questionId} has userId: ${questionData.userId}, requesting userId: ${userId}`);
    
    if (questionData.userId !== userId) {
      console.log(`User ${userId} not authorized to delete question owned by ${questionData.userId}`);
      throw new Error('Question not found or unauthorized');
    }
    
    await docRef.delete();
    console.log(`Successfully deleted question ${questionId}`);
    return true;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

// API Routes

// Get questions - now requires authentication to get user-specific questions
app.get('/api/questions', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const questions = await getUserQuestions(userId);
    res.json(questions);
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json({ error: 'Failed to load questions' });
  }
});

// Protected routes - require authentication
app.post('/api/questions', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const newQuestion = req.body;
    
    // Validate required fields
    if (!newQuestion.SHORT_NAME || !newQuestion.PROMPT || !newQuestion.CLASS || !newQuestion.VALUE_TYPE) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if SHORT_NAME already exists for this user
    const existingQuestions = await getUserQuestions(userId);
    if (existingQuestions.some(q => q.SHORT_NAME === newQuestion.SHORT_NAME)) {
      return res.status(400).json({ error: 'Question with this short name already exists' });
    }
    
    const savedQuestion = await addUserQuestion(userId, newQuestion);
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// Update endpoint now uses questionId instead of shortName
app.put('/api/questions/:questionId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { questionId } = req.params;
    const updatedQuestion = req.body;
    
    // Validate required fields
    if (!updatedQuestion.SHORT_NAME || !updatedQuestion.PROMPT || !updatedQuestion.CLASS || !updatedQuestion.VALUE_TYPE) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if SHORT_NAME is being changed and if it conflicts with another question
    const existingQuestions = await getUserQuestions(userId);
    const currentQuestion = existingQuestions.find(q => q.id === questionId);
    
    if (!currentQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    if (updatedQuestion.SHORT_NAME !== currentQuestion.SHORT_NAME) {
      if (existingQuestions.some(q => q.id !== questionId && q.SHORT_NAME === updatedQuestion.SHORT_NAME)) {
        return res.status(400).json({ error: 'Question with this short name already exists' });
      }
    }
    
    const savedQuestion = await updateUserQuestion(userId, questionId, updatedQuestion);
    res.json(savedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// Delete endpoint now uses questionId instead of shortName
app.delete('/api/questions/:questionId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { questionId } = req.params;
    
    await deleteUserQuestion(userId, questionId);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    if (error.message === 'Question not found or unauthorized') {
      res.status(404).json({ error: 'Question not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete question' });
    }
  }
});



// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
