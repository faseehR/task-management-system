// Dashboard.jsx - Updated with proper spacing and all features
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import TaskCard from './TaskCard';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  
  // Sample tasks data
  const [tasks] = useState([
    {
      id: 1,
      title: 'Design Landing Page',
      description: 'Create wireframes and high-fidelity mockups for the new homepage',
      priority: 'High',
      status: 'In Progress',
      dueDate: '2026-08-05',
      assignee: 'John Doe',
      createdAt: '2026-07-20'
    },
    {
      id: 2,
      title: 'API Integration',
      description: 'Connect frontend with backend endpoints for task CRUD operations',
      priority: 'Medium',
      status: 'Pending',
      dueDate: '2026-07-30',
      assignee: 'Jane Smith',
      createdAt: '2026-07-21'
    },
    {
      id: 3,
      title: 'Write Documentation',
      description: 'Update README and API documentation for the project',
      priority: 'Low',
      status: 'Completed',
      dueDate: '2026-08-10',
      assignee: 'Mike Johnson',
      createdAt: '2026-07-22'
    },
    {
      id: 4,
      title: 'User Authentication',
      description: 'Implement JWT authentication and protected routes',
      priority: 'High',
      status: 'In Progress',
      dueDate: '2026-08-01',
      assignee: 'John Doe',
      createdAt: '2026-07-23'
    },
    {
      id: 5,
      title: 'Database Schema Design',
      description: 'Design MongoDB schemas for users and tasks',
      priority: 'Medium',
      status: 'Pending',
      dueDate: '2026-07-28',
      assignee: 'Sarah Wilson',
      createdAt: '2026-07-24'
    },
    {
      id: 6,
      title: 'Testing & QA',
      description: 'Write unit tests and perform quality assurance',
      priority: 'Low',
      status: 'Completed',
      dueDate: '2026-08-15',
      assignee: 'Mike Johnson',
      createdAt: '2026-07-25'
    }
  ]);

  // Calculate statistics
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const dueTodayTasks = tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).length;

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter and sort tasks
  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    // Search
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }
    
    // Filter by priority
    if (filterPriority !== 'All') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }
    
    // Sort
    switch(sortBy) {
      case 'dueDate':
        filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case 'createdAt':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{totalTasks}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Pending</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{pendingTasks}</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">In Progress</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{inProgressTasks}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Completed</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{completedTasks}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Due Today</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{dueTodayTasks}</p>
                  </div>
                  <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:min-w-[200px]">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <select 
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="All">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="dueDate">Sort by Due Date</option>
                    <option value="createdAt">Sort by Created Date</option>
                    <option value="priority">Sort by Priority</option>
                  </select>
                </div>
                <button 
                  onClick={() => window.location.href = '/create-task'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Task
                </button>
              </div>
            </div>

            {/* Task Cards Grid - with proper spacing */}
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 text-lg font-medium">No tasks found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    getPriorityColor={getPriorityColor}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredTasks.length > 0 && (
              <div className="mt-6 flex justify-between items-center text-sm text-gray-500 border-t border-gray-200 pt-4">
                <span>Showing 1-{Math.min(filteredTasks.length, 6)} of {filteredTasks.length} tasks</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 font-medium border border-blue-200">
                    1
                  </button>
                  <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    2
                  </button>
                  <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    3
                  </button>
                  <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;