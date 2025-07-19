/**
 * College App Portal - Question Group Component
 * 
 * Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

import React, { useState } from 'react';

const QuestionGroup = ({ className, icon, questions, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getValueTypeColor = (valueType) => {
    const colors = {
      'BOOLEAN': '#4CAF50',
      'INTEGER': '#2196F3', 
      'STRING': '#FF9800'
    };
    return colors[valueType] || '#9E9E9E';
  };

  const getFriendlyValueType = (valueType) => {
    const friendlyNames = {
      'BOOLEAN': 'Yes/No',
      'INTEGER': 'Number',
      'STRING': 'Short answer'
    };
    return friendlyNames[valueType] || valueType;
  };

  const formatPrompt = (prompt) => {
    // Replace [college_name] with a styled placeholder
    return prompt.replace(/\[college_name\]/g, '[COLLEGE]');
  };

  const handleDeleteClick = (shortName, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this question?')) {
      onDelete(shortName);
    }
  };

  return (
    <div className="question-group">
      <div 
        className="group-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="group-title">
          <span className="group-icon">{icon}</span>
          <span className="group-name">{className}</span>
          <span className="question-count">({questions.length} questions)</span>
        </div>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </div>
      
      {isExpanded && (
        <div className="questions-list">
          {questions.map((question, index) => (
            <div key={question.SHORT_NAME} className="question-item">
              <div className="question-content">
                <div className="question-prompt">
                  {formatPrompt(question.PROMPT)}
                </div>
                <div className="question-actions">
                  <span 
                    className="value-type-badge"
                    style={{ backgroundColor: getValueTypeColor(question.VALUE_TYPE) }}
                    title={`Expected response type: ${getFriendlyValueType(question.VALUE_TYPE)}`}
                  >
                    {getFriendlyValueType(question.VALUE_TYPE)}
                  </span>
                  <button 
                    className="edit-btn"
                    onClick={() => onEdit(question)}
                    title="Edit question"
                  >
                    ✏️
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={(e) => handleDeleteClick(question.SHORT_NAME, e)}
                    title="Delete question"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionGroup;
