import React, { useState, useEffect, useMemo } from 'react';
import Login from './components/Login';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import SearchBar from './components/SearchBar';
import DarkModeToggle from './components/DarkModeToggle';
import { getUsername, setUsername, removeUsername, getTasks, setTasks, getDarkMode, setDarkMode } from './utils/localStorage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasksState] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [darkMode, setDarkModeState] = useState(false);

  // Load user, tasks, and dark mode from localStorage on component mount
  useEffect(() => {
    const storedUsername = getUsername();
    if (storedUsername) {
      setUser(storedUsername);
    }
    
    const storedTasks = getTasks();
    setTasksState(storedTasks);

    const storedDarkMode = getDarkMode();
    setDarkModeState(storedDarkMode);
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    setTasks(tasks);
  }, [tasks]);

  const handleLogin = (username) => {
    setUsername(username);
    setUser(username);
  };

  const handleLogout = () => {
    removeUsername();
    setUser(null);
    setTasksState([]);
    setFilter('all');
    setEditingTask(null);
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkModeState(newDarkMode);
    setDarkMode(newDarkMode);
  };

  const generateId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  };

  const handleAddTask = (taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority || 'medium',
      category: taskData.category || 'general',
      dueDate: taskData.dueDate || null,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTasksState(prevTasks => [newTask, ...prevTasks]);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasksState(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    setEditingTask(null);
  };

  const handleToggleComplete = (taskId) => {
    setTasksState(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasksState(prevTasks => prevTasks.filter(task => task.id !== taskId));
    if (editingTask && editingTask.id === taskId) {
      setEditingTask(null);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // Get unique categories from tasks
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(tasks.map(task => task.category))];
    return ['all', ...uniqueCategories.filter(cat => cat && cat !== 'all')];
  }, [tasks]);

  // Filter tasks based on current filter, search query, and category
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by completion status
    switch (filter) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'overdue':
        filtered = filtered.filter(task => {
          if (!task.dueDate || task.completed) return false;
          return new Date(task.dueDate) < new Date();
        });
        break;
      default:
        break;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        task.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      // First sort by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Then by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
      if (priorityDiff !== 0) return priorityDiff;

      // Then by due date (closest first)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;

      // Finally by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, filter, searchQuery, selectedCategory]);

  // Calculate task counts
  const taskCounts = useMemo(() => {
    const now = new Date();
    return {
      all: tasks.length,
      pending: tasks.filter(task => !task.completed).length,
      completed: tasks.filter(task => task.completed).length,
      overdue: tasks.filter(task => {
        if (!task.dueDate || task.completed) return false;
        return new Date(task.dueDate) < now;
      }).length
    };
  }, [tasks]);

  if (!user) {
    return <Login onLogin={handleLogin} darkMode={darkMode} onDarkModeToggle={handleDarkModeToggle} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Task Tracker</h1>
          <div className="header-actions">
            <DarkModeToggle darkMode={darkMode} onToggle={handleDarkModeToggle} />
            <div className="user-info">
              <span>Welcome, {user}!</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <TaskForm
            onAddTask={handleAddTask}
            editingTask={editingTask}
            onUpdateTask={handleUpdateTask}
            onCancelEdit={handleCancelEdit}
            categories={categories}
          />
          
          <div className="tasks-section">
            <div className="tasks-controls">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              
              <TaskFilter
                currentFilter={filter}
                onFilterChange={setFilter}
                taskCounts={taskCounts}
              />
            </div>
            
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;