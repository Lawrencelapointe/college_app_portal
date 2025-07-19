/**
 * College App Portal - Question Form Component
 * 
 * Copyright © 2025 Blue Sky Mind LLC. All rights reserved.
 * 
 * This software is proprietary and confidential. Unauthorized copying,
 * distribution, or use is strictly prohibited.
 */

import React, { useState, useEffect } from 'react';

const QuestionForm = ({ question, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    CLASS: '',
    SHORT_NAME: '',
    PROMPT: '',
    VALUE_TYPE: 'STRING'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (question) {
      setFormData(question);
    } else {
      setFormData({
        CLASS: '',
        SHORT_NAME: '',
        PROMPT: '',
        VALUE_TYPE: 'STRING'
      });
    }
  }, [question]);

  const classOptions = ['General', 'Geography', 'Academic', 'Soccer'];
  const valueTypeOptions = [
    { value: 'STRING', label: 'Short answer' },
    { value: 'INTEGER', label: 'Number' },
    { value: 'BOOLEAN', label: 'Yes/No' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.CLASS.trim()) {
      newErrors.CLASS = 'Class is required';
    }

    if (!formData.SHORT_NAME.trim()) {
      newErrors.SHORT_NAME = 'Short name is required';
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(formData.SHORT_NAME)) {
      newErrors.SHORT_NAME = 'Short name must be a valid identifier (letters, numbers, underscores only)';
    }

    if (!formData.PROMPT.trim()) {
      newErrors.PROMPT = 'Prompt is required';
    }

    if (!formData.VALUE_TYPE) {
      newErrors.VALUE_TYPE = 'Value type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const isEditing = !!question;

  return (
    <div className="question-form-overlay">
      <div className="question-form">
        <div className="form-header">
          <h2>{isEditing ? 'Edit Question' : 'Add New Question'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="class">Class *</label>
              <select
                id="class"
                value={formData.CLASS}
                onChange={(e) => handleChange('CLASS', e.target.value)}
                className={errors.CLASS ? 'error' : ''}
              >
                <option value="">Select a class...</option>
                {classOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.CLASS && <span className="error-text">{errors.CLASS}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="valueType">Value Type *</label>
              <select
                id="valueType"
                value={formData.VALUE_TYPE}
                onChange={(e) => handleChange('VALUE_TYPE', e.target.value)}
                className={errors.VALUE_TYPE ? 'error' : ''}
              >
                {valueTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.VALUE_TYPE && <span className="error-text">{errors.VALUE_TYPE}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="shortName">Short Name *</label>
            <input
              type="text"
              id="shortName"
              value={formData.SHORT_NAME}
              onChange={(e) => handleChange('SHORT_NAME', e.target.value)}
              placeholder="e.g., student_body_size"
              className={errors.SHORT_NAME ? 'error' : ''}
              disabled={isEditing} // Don't allow editing SHORT_NAME as it's used as key
            />
            {errors.SHORT_NAME && <span className="error-text">{errors.SHORT_NAME}</span>}
            {isEditing && <small className="help-text">Short name cannot be changed when editing</small>}
          </div>

          <div className="form-group">
            <label htmlFor="prompt">Prompt *</label>
            <textarea
              id="prompt"
              value={formData.PROMPT}
              onChange={(e) => handleChange('PROMPT', e.target.value)}
              placeholder="Enter the question prompt. Use [college_name] as a placeholder..."
              rows={4}
              className={errors.PROMPT ? 'error' : ''}
            />
            {errors.PROMPT && <span className="error-text">{errors.PROMPT}</span>}
            <small className="help-text">Use [college_name] as a placeholder for the college name</small>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {isEditing ? 'Update Question' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
