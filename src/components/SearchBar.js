import React from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ searchQuery, onSearchChange, categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <div className="search-icon">🔍</div>
        <input
          type="text"
          placeholder="Search tasks by title, description, or category..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="clear-search"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      
      {categories.length > 1 && (
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchBar;