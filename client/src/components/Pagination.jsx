import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  if (!totalItems || totalItems <= itemsPerPage) return null;

  return (
    <div className="pagination-wrap">
      <span className="page-info">
        Page {currentPage} of {totalPages}
      </span>
      <div className="page-btns">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          <FaChevronLeft />
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? 'active' : ''}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
