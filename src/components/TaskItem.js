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

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)} day(s)`, status: 'overdue' };
    } else if (diffDays === 0) {
      return { text: 'Due today', status: 'today' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', status: 'tomorrow' };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, status: 'soon' };
    } else {
      return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), status: 'future' };
    }
  };

  const getPriorityInfo = (priority) => {
    const priorities = {
      low: { emoji: '🟢', label: 'Low', class: 'low' },
      medium: { emoji: '🟡', label: 'Medium', class: 'medium' },
      high: { emoji: '🔴', label: 'High', class: 'high' }
    };
    return priorities[priority] || priorities.medium;
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

  const priorityInfo = getPriorityInfo(task.priority);
  const dueDateInfo = task.dueDate ? formatDueDate(task.dueDate) : null;

  return (
    <div className={`task-item ${task.completed ? 'completed' : 'pending'} priority-${priorityInfo.class} ${dueDateInfo?.status || ''}`}>
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
            <div className="task-title-row">
              <h4 className="task-title">{task.title}</h4>
              <div className="task-badges">
                <span className={`priority-badge priority-${priorityInfo.class}`}>
                  {priorityInfo.emoji} {priorityInfo.label}
                </span>
                {task.category && task.category !== 'general' && (
                  <span className="category-badge">
                    🏷️ {task.category}
                  </span>
                )}
              </div>
            </div>
            
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            
            <div className="task-meta">
              <span className="task-date">
                Created: {formatDate(task.createdAt)}
              </span>
              {dueDateInfo && (
                <span className={`due-date due-${dueDateInfo.status}`}>
                  📅 {dueDateInfo.text}
                </span>
              )}
            </div>
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