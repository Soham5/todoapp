import React from 'react';
import { getStreakMessage } from '../utils/progressCalculator';

const ProgressBar = ({ stats }) => {
  const { total, completed, pending, percentage } = stats;

  return (
    <div className="progress-section">
      <div className="progress-header">
        <h2 className="progress-title">Today's Progress</h2>
        <span className="progress-percentage">{percentage}%</span>
      </div>

      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="progress-message">{getStreakMessage(percentage)}</p>

      <div className="progress-stats">
        <div className="stat-item">
          <span className="stat-number">{total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-number stat-pending">{pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-item">
          <span className="stat-number stat-completed">{completed}</span>
          <span className="stat-label">Done</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
