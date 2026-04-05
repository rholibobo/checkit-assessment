"use client";

import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";


export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  const handlePrevious = () => {
    if (safeCurrentPage > 1) {
      onPageChange(safeCurrentPage - 1);
    }
  };

  const handleNext = () => {
    if (safeCurrentPage < totalPages) {
      onPageChange(safeCurrentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== safeCurrentPage) {
      onPageChange(page);
    }
  };

  // Only show up to 6 page buttons, but never exceed totalPages
  const getPageNumbers = () => {
    const maxVisible = 6;
    const actualTotal = Math.max(1, totalPages); // At least 1 page
    return Array.from(
      { length: Math.min(maxVisible, actualTotal) },
      (_, i) => i + 1
    );
  };

  const pageNumbers = getPageNumbers();
  const canGoPrevious = safeCurrentPage > 1;
  const canGoNext = safeCurrentPage < totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center md:justify-end gap-4 md:gap-8 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={!canGoPrevious}
        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
          canGoPrevious
            ? "border-primary hover:bg-grey-100 cursor-pointer"
            : "border-grey-400 cursor-not-allowed opacity-50"
        }`}
        aria-label="Previous page"
      >
        <ArrowLeft2
          size={16}
          color={
            canGoPrevious ? "var(--color-grey-1000)" : "var(--color-grey-400)"
          }
        />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center justify-between gap-2 md:gap-4">
        {pageNumbers.map((page, index) => {
          if (typeof page === "string") {
            return <span key={`ellipsis-${index}`}>...</span>;
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`text-xs md:text-sm font-medium transition-colors ${
                isActive
                  ? "border border-primary px-2 py-1 md:px-3 rounded text-primaryText font-semibold"
                  : "text-grey-500 hover:text-primaryText cursor-pointer"
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!canGoNext}
        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
          canGoNext
            ? "border-primary hover:bg-grey-100 cursor-pointer"
            : "border-grey-400 cursor-not-allowed opacity-50"
        }`}
        aria-label="Next page"
      >
        <ArrowRight2
          size={16}
          color={canGoNext ? "var(--color-primary)" : "var(--color-grey-400)"}
        />
      </button>
    </div>
  );
}
