import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import TaskCard from './TaskCard';

const DailyTodoList = ({ allTodos, completedTodos, parentTitle, onAdd, onDelete, onComplete, onDeleteCompleted, showCompletion = true }) => {
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
    <div className={showCompletion ? 'todo-section' : 'goal-panel'}>
      <div className="goal-panel-header">
        <h2 className="goal-panel-title">
          <span className="goal-panel-icon">{showCompletion ? '✅' : '📋'}</span>
          {showCompletion ? 'Daily Tasks' : 'Daily Goals'}
        </h2>
        <span className="goal-panel-count">{allTodos.length}</span>
      </div>
      {parentTitle && <p className="goal-panel-parent">For: {parentTitle}</p>}

      <div className={showCompletion ? 'todo-input-area' : 'goal-input-row'}>
        {showCompletion ? (
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
        ) : (
          <input
            type="text"
            className="goal-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a daily goal..."
          />
        )}
        <button
          className={showCompletion ? 'add-btn' : 'goal-add-btn'}
          onClick={handleAdd}
          disabled={!newTitle.trim()}
        >
          <FiPlus />
          {showCompletion && <span>Add</span>}
        </button>
      </div>

      {showCompletion && (
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
      )}

      <div className={showCompletion ? 'task-list' : 'goal-list'}>
        {(!showCompletion || activeTab === 'todo') && (
          <>
            {allTodos.length === 0 && (
              <div className="empty-state">
                <p>{showCompletion ? 'No pending tasks' : 'No daily goals yet'}</p>
                <span>{showCompletion ? 'Add a task above to get started' : 'Add a daily goal to track progress'}</span>
              </div>
            )}
            {allTodos.map((item, index) => (
              showCompletion ? (
                <TaskCard
                  key={index}
                  item={item}
                  index={index}
                  onDelete={onDelete}
                  onComplete={onComplete}
                  isCompleted={false}
                  showCompletion={showCompletion}
                />
              ) : (
                <div className="goal-item" key={index}>
                  <div className="goal-item-content">
                    <span className="goal-item-title">{item.title}</span>
                    {item.desc && <span className="goal-item-meta">{item.desc}</span>}
                  </div>
                  <div className="goal-item-actions">
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => onDelete(index)}
                      title="Delete goal"
                    >
                      <MdDeleteOutline />
                    </button>
                  </div>
                </div>
              )
            ))}
          </>
        )}

        {showCompletion && activeTab === 'completed' && (
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
