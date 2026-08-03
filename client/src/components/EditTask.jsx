import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaInfoCircle, FaSave } from 'react-icons/fa';
import Sidebar from './Sidebar';
import Header from './Header';
import { getTaskById, updateTask } from '../services/api';

const todayStr = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
  });
  const [originalStatus, setOriginalStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLockedByCompletion = originalStatus === 'Completed';

  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const res = await getTaskById(id);
        const task = res.data.data || res.data;
        setForm({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || 'Medium',
          status: task.status || 'Pending',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        });
        setOriginalStatus(task.status);
      } catch (err) {
        setLoadError(err.response?.data?.message || 'Could not load this task.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!isLockedByCompletion) {
      if (!form.title.trim()) next.title = 'Title is required';
      if (!form.dueDate) next.dueDate = 'Due date is required';
      else if (form.dueDate < todayStr()) next.dueDate = 'Due date cannot be in the past';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = isLockedByCompletion ? { status: form.status } : form;
      await updateTask(id, payload);
      setSuccessMessage('Task updated successfully.');
      setTimeout(() => navigate('/dashboard'), 700);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not update the task. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main-col">
        <Header />
        <main className="app-content-scroll flex-center" style={{ alignItems: 'flex-start' }}>
          <div className="edit-form-container">
            <h2>
              <FaEdit style={{ color: '#2563eb', marginRight: '12px' }} />
              Edit Task
            </h2>

            {isLoading ? (
              <div>
                <div className="skeleton" style={{ height: 48, borderRadius: 60, marginBottom: 16 }} />
                <div className="skeleton" style={{ height: 112, borderRadius: 24, marginBottom: 16 }} />
                <div className="skeleton" style={{ height: 48, borderRadius: 60 }} />
              </div>
            ) : loadError ? (
              <div className="alert-banner alert-error">{loadError}</div>
            ) : (
              <>
                {serverError && <div className="alert-banner alert-error">{serverError}</div>}
                {successMessage && <div className="alert-banner alert-success">{successMessage}</div>}
                {isLockedByCompletion && (
                  <div className="info-banner">
                    <FaInfoCircle />
                    <span>Completed tasks can only change status. Other fields are locked.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={handleChange('title')}
                      disabled={isLockedByCompletion}
                      className={`input-modern${errors.title ? ' error' : ''}`}
                    />
                    {errors.title && <p className="text-red-600 text-xs mt-2">{errors.title}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      value={form.description}
                      onChange={handleChange('description')}
                      disabled={isLockedByCompletion}
                      rows={4}
                      className="input-modern"
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Priority</label>
                      <select
                        value={form.priority}
                        onChange={handleChange('priority')}
                        disabled={isLockedByCompletion}
                        className="input-modern"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select value={form.status} onChange={handleChange('status')} className="input-modern">
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      min={todayStr()}
                      value={form.dueDate}
                      onChange={handleChange('dueDate')}
                      disabled={isLockedByCompletion}
                      className={`input-modern${errors.dueDate ? ' error' : ''}`}
                    />
                    {errors.dueDate && <p className="text-red-600 text-xs mt-2">{errors.dueDate}</p>}
                  </div>

                  <div className="action-buttons">
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                      <FaSave />
                      {isSubmitting ? 'Saving...' : 'Update Task'}
                    </button>
                    <button type="button" className="btn-outline" onClick={() => navigate('/dashboard')}>
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditTask;
