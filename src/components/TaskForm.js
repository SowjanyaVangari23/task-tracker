import React, { useState, useEffect } from 'react';
import '../styles/TaskForm.css';

const TaskForm = ({ onAddTask, editingTask, onUpdateTask, onCancelEdit, categories }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [category, setCategory] = useState('general');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description || '');
            setPriority(editingTask.priority || 'medium');
            setCategory(editingTask.category || 'general');
            setDueDate(editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '');
        } else {
            setTitle('');
            setDescription('');
            setPriority('medium');
            setCategory('general');
            setDueDate('');
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

        const taskData = {
            title: trimmedTitle,
            description: description.trim(),
            priority,
            category: category.trim() || 'general',
            dueDate: dueDate ? new Date(dueDate + 'T23:59:59').toISOString() : null
        };

        if (editingTask) {
            onUpdateTask({
                ...editingTask,
                ...taskData
            });
        } else {
            onAddTask(taskData);
        }

        setTitle('');
        setDescription('');
        setPriority('medium');
        setCategory('general');
        setDueDate('');
    };

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setCategory('general');
        setDueDate('');
        setError('');
        if (onCancelEdit) {
            onCancelEdit();
        }
    };

    const priorityOptions = [
        { value: 'low', label: 'Low Priority', emoji: '🟢' },
        { value: 'medium', label: 'Medium Priority', emoji: '🟡' },
        { value: 'high', label: 'High Priority', emoji: '🔴' }
    ];

    return (
        <div className="task-form-container">
            <form onSubmit={handleSubmit} className="task-form">
                <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>

                <div className="form-row">
                    <div className="form-group flex-2">
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

                    </div>

                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="priority-select"
                        >
                            {priorityOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.emoji} {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">-- Select Category --</option>
                            {/* Render categories except 'all' */}
                            {categories
                                .filter((cat) => cat !== 'all')
                                .map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            {/* Add fixed category options if not already in the list */}
                            {["work", "personal", "study", "health", "shopping"].map((cat) =>
                                categories.includes(cat) ? null : (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>


                <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
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