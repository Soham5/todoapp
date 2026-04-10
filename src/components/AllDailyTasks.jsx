import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';

const AllDailyTasks = ({ yearlyGoals, onComplete, onDelete }) => {
  const [activeTab, setActiveTab] = useState('todo');

  // Flatten all daily tasks across the goal tree with their path context
  const allPending = [];
  const allCompleted = [];

  yearlyGoals.forEach((yg) => {
    (yg.monthlyGoals || []).forEach((mg) => {
      (mg.weeklyGoals || []).forEach((wg) => {
        const path = `${yg.title} › ${mg.title} › ${wg.title}`;
        (wg.dailyTasks || []).forEach((task, i) => {
          allPending.push({ ...task, _path: path, _ygId: yg.id, _mgId: mg.id, _wgId: wg.id, _index: i });
        });
        (wg.completedTasks || []).forEach((task, i) => {
          allCompleted.push({ ...task, _path: path, _ygId: yg.id, _mgId: mg.id, _wgId: wg.id, _index: i });
        });
      });
    });
  });

  const pendingCount = allPending.length;
  const completedCount = allCompleted.length;

  return (
    <div className="todo-section">
      <div className="goal-panel-header">
        <h2 className="goal-panel-title">
          <span className="goal-panel-icon">📌</span>
          All Daily Tasks
        </h2>
        <span className="goal-panel-count">{pendingCount + completedCount}</span>
      </div>

      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'todo' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('todo')}
        >
          Pending
          {pendingCount > 0 && <span className="tab-badge">{pendingCount}</span>}
        </button>
        <button
          className={`tab-btn ${activeTab === 'completed' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
          {completedCount > 0 && <span className="tab-badge tab-badge--done">{completedCount}</span>}
        </button>
      </div>

      <div className="task-list">
        {activeTab === 'todo' && (
          <>
            {pendingCount === 0 && (
              <div className="empty-state">
                <p>No pending tasks across any goal</p>
                <span>Add tasks inside your weekly goals</span>
              </div>
            )}
            {allPending.map((task, i) => (
              <div className="task-card" key={`${task._wgId}-${task._index}`}>
                <div className="task-card-content">
                  <div className="task-card-header">
                    <span className="task-number">#{i + 1}</span>
                    <h3 className="task-title">{task.title}</h3>
                  </div>
                  {task.desc && <p className="task-desc">{task.desc}</p>}
                  <span className="task-goal-path">{task._path}</span>
                </div>
                <div className="task-card-actions">
                  <button
                    className="action-btn action-btn--complete"
                    onClick={() => onComplete(task._ygId, task._mgId, task._wgId, task._index)}
                    title="Mark complete"
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="action-btn action-btn--delete"
                    onClick={() => onDelete(task._ygId, task._mgId, task._wgId, task._index, false)}
                    title="Delete task"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {completedCount === 0 && (
              <div className="empty-state">
                <p>No completed tasks yet</p>
                <span>Complete tasks to see them here</span>
              </div>
            )}
            {allCompleted.map((task, i) => (
              <div className="task-card task-card--completed" key={`${task._wgId}-done-${task._index}`}>
                <div className="task-card-content">
                  <h3 className="task-title">{task.title}</h3>
                  {task.desc && <p className="task-desc">{task.desc}</p>}
                  {task.completedAt && (
                    <span className="task-completed-time">Completed at {task.completedAt}</span>
                  )}
                  <span className="task-goal-path">{task._path}</span>
                </div>
                <div className="task-card-actions">
                  <button
                    className="action-btn action-btn--delete"
                    onClick={() => onDelete(task._ygId, task._mgId, task._wgId, task._index, true)}
                    title="Delete task"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default AllDailyTasks;
