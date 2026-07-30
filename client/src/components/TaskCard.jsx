// TaskCard.jsx - Updated with better error handling
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TaskCard = ({ task, getPriorityColor }) => {
  const navigate = useNavigate();

  if (!task) return null;

  const handleCardClick = () => {
    navigate(`/task/${task.id}`);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-800 text-sm flex-1 line-clamp-2">{task.title}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 whitespace-nowrap ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      
      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description || 'No description'}</p>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-[10px]">
            {getInitials(task.assignee)}
          </div>
          <span className="text-gray-500 truncate max-w-[80px]">{task.assignee || 'Unassigned'}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">{task.dueDate || 'No date'}</span>
        </div>
      </div>

      {/* Status badge */}
      <div className="mt-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          task.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
          'bg-emerald-100 text-emerald-700'
        }`}>
          {task.status}
        </span>
      </div>

      {/* Actions - appear on hover */}
      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/edit-task/${task.id}`);
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button 
          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Soft delete functionality
            if (window.confirm('Are you sure you want to delete this task?')) {
              console.log('Task deleted:', task.id);
            }
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;