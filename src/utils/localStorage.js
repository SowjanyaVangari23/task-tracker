// Utility functions for localStorage operations

export const getStoredData = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setStoredData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const removeStoredData = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

// Specific functions for our app
export const getUsername = () => getStoredData('taskTracker_username');
export const setUsername = (username) => setStoredData('taskTracker_username', username);
export const removeUsername = () => removeStoredData('taskTracker_username');

export const getTasks = () => getStoredData('taskTracker_tasks', []);
export const setTasks = (tasks) => setStoredData('taskTracker_tasks', tasks);