import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import TaskCard from './TaskCard';

const DailyTodoList = ({ allTodos, completedTodos, onAdd, onDelete, onComplete, onDeleteCompleted }) => {
  const [activeTab, setActiveTab] = useState('todo');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAdd({ title: newTitle.trim(), desc: newDesc.trim() });
    setNewTitle('');
    setNewDesc('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="todo-section">
      <div className="todo-input-area">
        <div className="input-group">
          <input
            type="text"
            className="todo-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
          />
          <input
            type="text"
            className="todo-input todo-input--desc"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a description (optional)"
          />
        </div>
        <button className="add-btn" onClick={handleAdd} disabled={!newTitle.trim()}>
          <FiPlus />
          <span>Add</span>
        </button>
      </div>

      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'todo' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('todo')}
        >
          Pending
          {allTodos.length > 0 && <span className="tab-badge">{allTodos.length}</span>}
        </button>
        <button
          className={`tab-btn ${activeTab === 'completed' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
          {completedTodos.length > 0 && <span className="tab-badge tab-badge--done">{completedTodos.length}</span>}
        </button>
      </div>

      <div className="task-list">
        {activeTab === 'todo' && (
          <>
            {allTodos.length === 0 && (
              <div className="empty-state">
                <p>No pending tasks</p>
                <span>Add a task above to get started</span>
              </div>
            )}
            {allTodos.map((item, index) => (
              <TaskCard
                key={index}
                item={item}
                index={index}
                onDelete={onDelete}
                onComplete={onComplete}
                isCompleted={false}
              />
            ))}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {completedTodos.length === 0 && (
              <div className="empty-state">
                <p>No completed tasks yet</p>
                <span>Complete a task to see it here</span>
              </div>
            )}
            {completedTodos.map((item, index) => (
              <TaskCard
                key={index}
                item={item}
                index={index}
                onDelete={onDeleteCompleted}
                isCompleted={true}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DailyTodoList;
