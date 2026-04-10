import React from 'react';


const LEVELS = ['yearly', 'monthly', 'weekly', 'daily'];
const LEVEL_LABELS = {
  yearly: 'Yearly Goals',
  monthly: 'Monthly Goals',
  weekly: 'Weekly Goals',
  daily: 'Daily Goals',
};

const PlannerBoard = ({ activeLevel, breadcrumbs, onNavigate }) => {
  return (
    <div className="planner-nav">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="breadcrumb-sep">›</span>}
            <button
              className={`breadcrumb-btn ${i === breadcrumbs.length - 1 ? 'breadcrumb-btn--active' : ''}`}
              onClick={() => onNavigate(crumb.level)}
            >
              {crumb.label}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Level indicator pills */}
      <div className="level-pills">
        {LEVELS.map((level) => (
          <span
            key={level}
            className={`level-pill ${activeLevel === level ? 'level-pill--active' : ''}`}
          >
            {LEVEL_LABELS[level]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PlannerBoard;
