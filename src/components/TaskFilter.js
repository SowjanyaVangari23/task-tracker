import React from 'react';
import '../styles/TaskFilter.css';

const TaskFilter = ({ currentFilter, onFilterChange, taskCounts }) => {
  const filters = [
    { key: 'all', label: 'All', count: taskCounts.all, emoji: '📋' },
    { key: 'pending', label: 'Pending', count: taskCounts.pending, emoji: '⏳' },
    { key: 'completed', label: 'Completed', count: taskCounts.completed, emoji: '✅' },
    { key: 'overdue', label: 'Overdue', count: taskCounts.overdue, emoji: '⚠️' }
  ];

  return (
    <div className="task-filter">
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`filter-btn ${currentFilter === filter.key ? 'active' : ''} ${filter.key === 'overdue' && filter.count > 0 ? 'urgent' : ''}`}
          >
            <span className="filter-emoji">{filter.emoji}</span>
            <span className="filter-label">{filter.label}</span>
            <span className="filter-count">{filter.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskFilter;