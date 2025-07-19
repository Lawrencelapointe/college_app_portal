/**
 * GlidrU - Backend Server
 * 
 * Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const QUESTIONS_FILE = path.join(__dirname, 'data', 'prompts_for_college_data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Read questions from file
const readQuestionsFromFile = async () => {
  try {
    const data = await fs.readFile(QUESTIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading questions file:', error);
    return [];
  }
};

// Write questions to file
const writeQuestionsToFile = async (questions) => {
  try {
    await fs.writeFile(QUESTIONS_FILE, JSON.stringify(questions, null, 4));
    return true;
  } catch (error) {
    console.error('Error writing questions file:', error);
    return false;
  }
};

// API Routes
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await readQuestionsFromFile();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load questions' });
  }
});

app.post('/api/questions', async (req, res) => {
  try {
    const newQuestion = req.body;
    
    // Validate required fields
    if (!newQuestion.SHORT_NAME || !newQuestion.PROMPT || !newQuestion.CLASS || !newQuestion.VALUE_TYPE) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const questions = await readQuestionsFromFile();
    
    // Check if SHORT_NAME already exists
    if (questions.some(q => q.SHORT_NAME === newQuestion.SHORT_NAME)) {
      return res.status(400).json({ error: 'Question with this short name already exists' });
    }
    
    questions.push(newQuestion);
    
    const success = await writeQuestionsToFile(questions);
    if (success) {
      res.status(201).json(newQuestion);
    } else {
      res.status(500).json({ error: 'Failed to save question' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add question' });
  }
});

app.put('/api/questions/:shortName', async (req, res) => {
  try {
    const { shortName } = req.params;
    const updatedQuestion = req.body;
    
    const questions = await readQuestionsFromFile();
    const questionIndex = questions.findIndex(q => q.SHORT_NAME === shortName);
    
    if (questionIndex === -1) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    // If SHORT_NAME is being changed, check for conflicts
    if (updatedQuestion.SHORT_NAME !== shortName) {
      if (questions.some(q => q.SHORT_NAME === updatedQuestion.SHORT_NAME)) {
        return res.status(400).json({ error: 'Question with this short name already exists' });
      }
    }
    
    questions[questionIndex] = updatedQuestion;
    
    const success = await writeQuestionsToFile(questions);
    if (success) {
      res.json(updatedQuestion);
    } else {
      res.status(500).json({ error: 'Failed to update question' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update question' });
  }
});

app.delete('/api/questions/:shortName', async (req, res) => {
  try {
    const { shortName } = req.params;
    
    const questions = await readQuestionsFromFile();
    const initialLength = questions.length;
    const filteredQuestions = questions.filter(q => q.SHORT_NAME !== shortName);
    
    if (filteredQuestions.length === initialLength) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const success = await writeQuestionsToFile(filteredQuestions);
    if (success) {
      res.json({ message: 'Question deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete question' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
