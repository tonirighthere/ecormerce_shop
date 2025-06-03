import React, { useState } from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const [inputPage, setInputPage] = useState(currentPage);

  // Update inputPage when currentPage changes
  React.useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  // it hơn 2 trang thì không hiển thị pagination
  if (totalPages <= 1) return null;

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/, ""); // Allow only numbers
    setInputPage(value);
  };

  const handleInputBlur = () => {
    let page = Number(inputPage);
    if (!page || page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setInputPage(page);
    if (page !== currentPage) onPageChange(page);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <button
        disabled={currentPage === 1 || totalPages === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg 
          hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Previous page"
        
      >
        Prev
      </button>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            bg-white text-gray-900 shadow-sm"
          aria-label={`Page number, current page is ${currentPage}`}
        />
        <span className="text-gray-600 font-medium">of {totalPages}</span>
      </div>
      <button
        disabled={currentPage === totalPages || totalPages === 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg 
          hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;