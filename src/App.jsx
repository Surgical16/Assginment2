import React, { useState, useEffect } from 'react';
import './TodoApp.css';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [error, setError] = useState('');

  useEffect(() => {
    const sampleTasks = [
      { id: 1, text: 'Completed Assignment 2 of Celebal', completed: false, createdAt: new Date('2025-06-12') },
      { id: 2, text: 'Build To-do App', completed: true, createdAt: new Date('2025-06-10') },
    ];
    setTasks(sampleTasks);
  }, []);

  const addTask = () => {
    const trimmedInput = inputValue.trim();

    if (!trimmedInput) {
      setError('Task cannot be empty');
      return;
    }

    if (trimmedInput.length > 100) {
      setError('Task must be less than 100 characters');
      return;
    }

    if (tasks.some(task => task.text.toLowerCase() === trimmedInput.toLowerCase())) {
      setError('Task already exists');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: trimmedInput,
      completed: false,
      createdAt: new Date()
    };

    setTasks([...tasks, newTask]);
    setInputValue('');
    setError('');
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.text.localeCompare(b.text);
      case 'status':
        return a.completed - b.completed;
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1>My To-Do List</h1>
        <p>Celebal Assignment 2</p>
      </div>

      <div className="task-input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          maxLength={100}
        />
        <button onClick={addTask}>
          + Add
        </button>
      </div>
      {error && (
        <p className="error-message">{error}</p>
      )}

      <div className="controls-bar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="alphabetical">Sort A-Z</option>
          <option value="status">Sort by Status</option>
        </select>

        <div className="task-stats">
          {completedCount} of {totalCount} completed
        </div>
      </div>

      <div className="todo-list">
        {sortedTasks.length === 0 ? (
          <div className="empty-message">
            {filter === 'all' ? 'No tasks yet. Add one above!' : `No ${filter} tasks.`}
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div key={task.id} className="todo-item">
              <button
  onClick={() => toggleTask(task.id)}
  className={`complete ${task.completed ? 'checked' : ''}`}
>
  {task.completed && <span>✓</span>}
</button>

              <span
                className={`task-text ${task.completed ? 'completed' : ''}`}
              >
                {task.text}
              </span>

              <span className="task-date">
                {task.createdAt.toLocaleDateString()}
              </span>

              <button
                onClick={() => removeTask(task.id)}
                className="delete"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {totalCount > 0 && (
        <div className="progress-container">
          <div className="progress-label">
            Progress: {Math.round((completedCount / totalCount) * 100)}%
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;

