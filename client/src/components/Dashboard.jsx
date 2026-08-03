import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaTasks, FaClock, FaSpinner, FaCheckCircle, FaCalendarDay, FaListUl, FaCalendarAlt } from 'react-icons/fa';
import Sidebar from './Sidebar';
import Header from './Header';
import TaskCard from './TaskCard';
import SearchFilterBar from './SearchFilterBar';
import Pagination from './Pagination';
import { getTasks, getDashboardStats, deleteTask } from '../services/api';

const TASKS_PER_PAGE = 6;

const Dashboard = () => {
  const location = useLocation();
  const mode =
    location.pathname === '/tasks/today' ? 'today' :
    location.pathname === '/tasks/later' ? 'later' :
    'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [currentPage, setCurrentPage] = useState(1);

  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, dueToday: 0 });

  // Debounce search input so we don't hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Reset to page 1 whenever filters/sort/mode change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterPriority, sortBy, mode]);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await getTasks({
        search: debouncedSearch || undefined,
        status: filterStatus,
        priority: filterPriority,
        sort: sortBy,
        page: currentPage,
        limit: TASKS_PER_PAGE,
        due: mode !== 'all' ? mode : undefined,
      });
      const { data, pagination } = res.data;
      setTasks(data || []);
      setTotalTasks(pagination?.total ?? 0);
      setTotalPages(pagination?.totalPages ?? 1);
    } catch (err) {
      setLoadError(err.response?.data?.message || 'Could not load tasks.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, filterStatus, filterPriority, sortBy, currentPage, mode]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data.data);
    } catch (err) {
      // Stats are supplementary; a failure here shouldn't block the task list
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleDeleteTask = useCallback(
    async (taskId) => {
      await deleteTask(taskId);
      fetchTasks();
      fetchStats();
    },
    [fetchTasks, fetchStats]
  );

  const hasActiveFilters = Boolean(debouncedSearch) || filterStatus !== 'All' || filterPriority !== 'All';

  const emptyState = (() => {
    if (mode === 'today') {
      return { title: 'No tasks due today', subtitle: "You're all caught up. Enjoy your day!" };
    }
    if (mode === 'later') {
      return { title: 'No upcoming tasks', subtitle: 'Nothing scheduled for later yet.' };
    }
    if (!hasActiveFilters) {
      return { title: 'No tasks yet', subtitle: 'Create your first task to get started.' };
    }
    return { title: 'No tasks found', subtitle: 'Try adjusting your search or filters.' };
  })();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main-col">
        <Header />
        <main className="app-content-scroll">
          <div className="dashboard-container">
            {mode === 'all' ? (
              <div className="grid-5-stats mb-8">
                <div className="stat-card">
                  <div>
                    <p className="stat-label">Total Tasks</p>
                    <p className="stat-value">{stats.total}</p>
                  </div>
                  <div className="stat-icon blue"><FaTasks /></div>
                </div>
                <div className="stat-card">
                  <div>
                    <p className="stat-label">Pending</p>
                    <p className="stat-value">{stats.pending}</p>
                  </div>
                  <div className="stat-icon amber"><FaClock /></div>
                </div>
                <div className="stat-card">
                  <div>
                    <p className="stat-label">In Progress</p>
                    <p className="stat-value">{stats.inProgress}</p>
                  </div>
                  <div className="stat-icon blue"><FaSpinner /></div>
                </div>
                <div className="stat-card">
                  <div>
                    <p className="stat-label">Completed</p>
                    <p className="stat-value">{stats.completed}</p>
                  </div>
                  <div className="stat-icon emerald"><FaCheckCircle /></div>
                </div>
                <div className="stat-card">
                  <div>
                    <p className="stat-label">Due Today</p>
                    <p className="stat-value">{stats.dueToday}</p>
                  </div>
                  <div className="stat-icon rose"><FaCalendarDay /></div>
                </div>
              </div>
            ) : (
              <div className="mb-8" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {mode === 'today' ? (
                  <FaCalendarDay style={{ color: '#e11d48', fontSize: '1.25rem' }} />
                ) : (
                  <FaCalendarAlt style={{ color: '#2563eb', fontSize: '1.25rem' }} />
                )}
                <h2 style={{ margin: 0 }}>{mode === 'today' ? "Today's Tasks" : 'Later Tasks'}</h2>
              </div>
            )}
            <div className='h-6'></div>
            <SearchFilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterStatus={filterStatus}
              onFilterStatusChange={setFilterStatus}
              filterPriority={filterPriority}
              onFilterPriorityChange={setFilterPriority}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />

            {loadError && <div className="alert-banner alert-error">{loadError}</div>}

            {isLoading ? (
              <div className="grid-3">
                {[...Array(TASKS_PER_PAGE)].map((_, i) => (
                  <div key={i} className="task-card" style={{ cursor: 'default' }}>
                    <div className="skeleton" style={{ height: 16, width: '65%', marginBottom: 12 }} />
                    <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 12, width: '80%' }} />
                  </div>
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <FaListUl style={{ fontSize: '2.5rem', color: '#cbd5e1', marginBottom: 16 }} />
                <p style={{ fontSize: '1.1rem', fontWeight: 500, color: '#64748b' }}>{emptyState.title}</p>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: 4 }}>{emptyState.subtitle}</p>
              </div>
            ) : (
              <div className="grid-3">
                {tasks.map((task) => (
                  <TaskCard key={task._id} task={task} onDelete={handleDeleteTask} />
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalTasks}
              itemsPerPage={TASKS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
