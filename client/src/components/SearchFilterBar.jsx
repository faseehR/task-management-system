import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';

const SearchFilterBar = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterPriority,
  onFilterPriorityChange,
  sortBy,
  onSortByChange,
}) => {
  const navigate = useNavigate();

  return (
    <div className="search-filter-bar">
      <div className="search-input-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <FaSearch
          style={{
            position: 'absolute',
            left: 12,
            color: '#94a3b8',
            fontSize: '0.9rem',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ paddingLeft: 36 }}
        />
      </div>
      <select value={filterStatus} onChange={(e) => onFilterStatusChange(e.target.value)}>
        <option value="All">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <select value={filterPriority} onChange={(e) => onFilterPriorityChange(e.target.value)}>
        <option value="All">All Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <select value={sortBy} onChange={(e) => onSortByChange(e.target.value)}>
        <option value="dueDate">Due Date</option>
        <option value="createdAt">Created</option>
        <option value="priority">Priority</option>
      </select>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navigate('/create-task');
        }}
        className="btn-primary"
        style={{ marginLeft: 'auto', padding: '10px 24px' }}
      >
        <FaPlus /> Create Task
      </a>
    </div>
  );
};

export default SearchFilterBar;