import React, { useState, useEffect } from 'react';
import '../styles/TaskForm.css';

const TaskForm = ({ onAddTask, editingTask, onUpdateTask, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
    setError('');
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    
    if (!trimmedTitle) {
      setError('Task title is required');
      return;
    }
    
    if (trimmedTitle.length > 100) {
      setError('Task title must be less than 100 characters');
      return;
    }
    
    setError('');
    
    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: trimmedTitle,
        description: description.trim()
      });
    } else {
      onAddTask({
        title: trimmedTitle,
        description: description.trim()
      });
    }
    
    setTitle('');
    setDescription('');
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setError('');
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className="task-form-container">
      <form onSubmit={handleSubmit} className="task-form">
        <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
        
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className={error ? 'error' : ''}
            maxLength="100"
          />
          {error && <span className="error-message">{error}</span>}
          }
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
            rows="3"
            maxLength="500"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingTask ? 'Update Task' : 'Add Task'}
          </button>
          {editingTask && (
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;