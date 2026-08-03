import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegClock, FaRegCalendarAlt, FaPen, FaTrashAlt } from 'react-icons/fa';

const priorityClass = (priority) => ({
  High: 'badge-high',
  Medium: 'badge-medium',
  Low: 'badge-low',
}[priority] || 'badge-medium');

const statusClass = (status) => ({
  Pending: 'badge-pending',
  'In Progress': 'badge-in-progress',
  Completed: 'badge-completed',
}[status] || 'badge-pending');

const formatShortDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

const TaskCard = ({ task, onDelete }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!task) return null;

  const taskId = task._id || task.id;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setIsDeleting(true);
    try {
      await onDelete(taskId);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="task-card" onClick={() => navigate(`/task/${taskId}`)}>
      <div className="card-header">
        <h4 className="card-title">{task.title}</h4>
        <span className={`badge-priority ${priorityClass(task.priority)}`}>{task.priority}</span>
      </div>

      <p className="card-description">{task.description || 'No description'}</p>

      <div className="card-meta">
        <span className="meta-item" title="Created on">
          <FaRegClock />
          {formatShortDate(task.createdAt) || 'No date'}
        </span>
        <span className="meta-item" title="Due on">
          <FaRegCalendarAlt />
          {formatShortDate(task.dueDate) || 'No date'}
        </span>
      </div>

      <div className="card-footer">
        <span className={`badge-status ${statusClass(task.status)}`}>{task.status}</span>
        <div className="card-actions">
          <button
            title="Edit task"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/edit-task/${taskId}`);
            }}
          >
            <FaPen />
          </button>
          <button className="delete" title="Delete task" disabled={isDeleting} onClick={handleDelete}>
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
