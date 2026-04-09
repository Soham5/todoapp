import React, { useState } from 'react';
import { FiPlus, FiChevronRight } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';

const WeeklyGoals = ({ goals, parentTitle, onAdd, onDelete, onSelect, selectedId }) => {
  const [newGoal, setNewGoal] = useState('');

  const handleAdd = () => {
    if (!newGoal.trim()) return;
    onAdd(newGoal.trim());
    setNewGoal('');
  };

  return (
    <div className="goal-panel">
      <div className="goal-panel-header">
        <h2 className="goal-panel-title">
          <span className="goal-panel-icon">📋</span>
          Weekly Goals
        </h2>
        <span className="goal-panel-count">{goals.length}</span>
      </div>
      {parentTitle && <p className="goal-panel-parent">For: {parentTitle}</p>}

      <div className="goal-input-row">
        <input
          type="text"
          className="goal-input"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a weekly goal..."
        />
        <button className="goal-add-btn" onClick={handleAdd} disabled={!newGoal.trim()}>
          <FiPlus />
        </button>
      </div>

      <div className="goal-list">
        {goals.length === 0 && (
          <div className="empty-state">
            <p>No weekly goals yet</p>
            <span>Break your monthly goal into weekly targets</span>
          </div>
        )}
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`goal-item ${selectedId === goal.id ? 'goal-item--selected' : ''}`}
            onClick={() => onSelect(goal.id)}
          >
            <div className="goal-item-content">
              <span className="goal-item-title">{goal.title}</span>
              <span className="goal-item-meta">
                {goal.dailyTasks?.length || 0} daily tasks
              </span>
            </div>
            <div className="goal-item-actions">
              <button
                className="action-btn action-btn--delete"
                onClick={(e) => { e.stopPropagation(); onDelete(goal.id); }}
                title="Delete goal"
              >
                <MdDeleteOutline />
              </button>
              <FiChevronRight className="goal-item-arrow" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyGoals;
