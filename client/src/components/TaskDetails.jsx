import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSpinner, FaRegCalendarAlt, FaRegClock, FaPen, FaLayerGroup, FaHashtag, FaTrash } from 'react-icons/fa';
import Sidebar from './Sidebar';
import Header from './Header';
import { getTaskById, deleteTask } from '../services/api';

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

const TaskDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const res = await getTaskById(id);
        setTask(res.data.data || res.data);
      } catch (err) {
        setLoadError(err.response?.data?.message || 'Could not load this task.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setIsDeleting(true);
    try {
      await deleteTask(id);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete this task.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main-col">
        <Header />
        <main className="app-content-scroll flex-center" style={{ alignItems: 'flex-start' }}>
          {isLoading ? (
            <div className="task-details-container">
              <div className="skeleton" style={{ height: 32, width: '50%', marginBottom: 16 }} />
              <div className="skeleton" style={{ height: 16, width: '100%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 16, width: '75%' }} />
            </div>
          ) : loadError ? (
            <div className="alert-banner alert-error" style={{ maxWidth: 820, width: '100%' }}>
              {loadError}
            </div>
          ) : task ? (
            <div className="task-details-container">
              <div className="detail-header">
                <h1 className="detail-title">{task.title}</h1>
                <span className={`badge-priority ${priorityClass(task.priority)}`} style={{ fontSize: '0.75rem', padding: '6px 18px' }}>
                  {task.priority}
                </span>
              </div>

              <div className="detail-badges">
                <span
                  className={`badge-status ${statusClass(task.status)}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.75rem',
                    padding: '6px 18px',
                  }}
                >
                  <FaSpinner /> {task.status}
                </span>
              </div>

              <div className="detail-description">
                <p>{task.description || 'No description provided.'}</p>
              </div>

              <div className="detail-meta-grid">
                <div className="detail-meta-item">
                  <FaRegCalendarAlt />
                  <span>
                    <span className="label">Due Date</span>{' '}
                    <span className="value">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        : 'No date'}
                    </span>
                  </span>
                </div>
                <div className="detail-meta-item">
                  <FaRegClock />
                  <span>
                    <span className="label">Created</span>{' '}
                    <span className="value">
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })
                        : '—'}
                    </span>
                  </span>
                </div>
                <div className="detail-meta-item">
                  <FaPen />
                  <span>
                    <span className="label">Last Updated</span>{' '}
                    <span className="value">
                      {task.updatedAt
                        ? new Date(task.updatedAt).toLocaleString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })
                        : '—'}
                    </span>
                  </span>
                </div>
                <div className="detail-meta-item">
                  <FaLayerGroup />
                  <span>
                    <span className="label">Priority</span>{' '}
                    <span className="value" style={{ color: task.priority === 'High' ? '#dc2626' : undefined }}>
                      {task.priority}
                    </span>
                  </span>
                </div>
                <div className="detail-meta-item">
                  <FaHashtag />
                  <span>
                    <span className="label">Task ID</span>{' '}
                    <span className="value" style={{ fontFamily: 'monospace' }}>
                      {task._id || task.id}
                    </span>
                  </span>
                </div>
              </div>

              <div className="detail-actions">
                <button className="btn-primary" onClick={() => navigate(`/edit-task/${task._id || task.id}`)}>
                  <FaPen /> Edit Task
                </button>
                <button className="btn-outline-danger" disabled={isDeleting} onClick={handleDelete}>
                  <FaTrash /> {isDeleting ? 'Deleting...' : 'Delete Task'}
                </button>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default TaskDetails;