import React, { useState } from 'react';
import '../styles/TaskItem.css';

const TaskItem = ({ task, onToggleComplete, onDeleteTask, onEditTask }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDeleteTask(task.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : 'pending'}`}>
      <div className="task-content">
        <div className="task-header">
          <div className="task-checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              id={`task-${task.id}`}
            />
            <label htmlFor={`task-${task.id}`} className="checkbox-label">
              <span className="checkmark"></span>
            </label>
          </div>
          
          <div className="task-info">
            <h4 className="task-title">{task.title}</h4>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            <span className="task-date">
              Created: {formatDate(task.createdAt)}
            </span>
          </div>
        </div>
        
        <div className="task-actions">
          <button
            onClick={() => onEditTask(task)}
            className="btn btn-edit"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={handleDeleteClick}
            className="btn btn-delete"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this task?</p>
          <div className="confirmation-actions">
            <button onClick={handleConfirmDelete} className="btn btn-danger">
              Yes, Delete
            </button>
            <button onClick={handleCancelDelete} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;