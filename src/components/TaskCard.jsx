import React from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';

const TaskCard = ({ item, index, onDelete, onComplete, isCompleted }) => {
  return (
    <div className={`task-card ${isCompleted ? 'task-card--completed' : ''}`}>
      <div className="task-card-content">
        <div className="task-card-header">
          {!isCompleted && <span className="task-number">#{index + 1}</span>}
          <h3 className="task-title">{item.title}</h3>
        </div>
        {item.desc && <p className="task-desc">{item.desc}</p>}
        {isCompleted && item.completedAt && (
          <span className="task-completed-time">Completed at {item.completedAt}</span>
        )}
      </div>

      <div className="task-card-actions">
        {!isCompleted && (
          <button
            className="action-btn action-btn--complete"
            onClick={() => onComplete(index)}
            title="Mark complete"
          >
            <FaCheck />
          </button>
        )}
        <button
          className="action-btn action-btn--delete"
          onClick={() => onDelete(index)}
          title="Delete task"
        >
          <MdDeleteOutline />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
