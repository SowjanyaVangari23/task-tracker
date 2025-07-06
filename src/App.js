import React, { useState, useEffect, useMemo } from 'react';
import Login from './components/Login';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import { getUsername, setUsername, removeUsername, getTasks, setTasks } from './utils/localStorage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasksState] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  // Load user and tasks from localStorage on component mount
  useEffect(() => {
    const storedUsername = getUsername();
    if (storedUsername) {
      setUser(storedUsername);
    }
    
    const storedTasks = getTasks();
    setTasksState(storedTasks);
  }, []);

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
  };

  const generateId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  };

  const handleAddTask = (taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description,
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

  // Filter tasks based on current filter
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // Calculate task counts
  const taskCounts = useMemo(() => {
    return {
      all: tasks.length,
      pending: tasks.filter(task => !task.completed).length,
      completed: tasks.filter(task => task.completed).length
    };
  }, [tasks]);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Task Tracker</h1>
          <div className="user-info">
            <span>Welcome, {user}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
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
          />
          
          <div className="tasks-section">
            <TaskFilter
              currentFilter={filter}
              onFilterChange={setFilter}
              taskCounts={taskCounts}
            />
            
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