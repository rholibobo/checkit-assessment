"use client";

import Pagination from "../shared/Pagination";


interface BottomPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemLabel?: string; // 
  onPageChange: (page: number) => void;
  className?: string;
  summaryFormat?: "short" | "long"; // "1 to 24 of 1+ Million" vs "1 to 24 of 1,234,567"
}

export default function BottomPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemLabel = "Items",
  onPageChange,
  className = "",
  summaryFormat = "short",
}: BottomPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const formatTotal = () => {
    if (summaryFormat === "short" && totalItems >= 1000000) {
      return `1+ Million ${itemLabel}`;
    } else if (summaryFormat === "short" && totalItems >= 1000) {
      return `${(totalItems / 1000).toFixed(0)}+ Thousand ${itemLabel}`;
    } else {
      return `${totalItems.toLocaleString()} ${itemLabel}`;
    }
  };

  return (
    <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${className}`}>
      {/* Left Side - Summary Text */}
      <p className="text-grey-900 text-xs md:text-sm text-center md:text-left">
        <strong>{startItem} to {endItem}</strong> of {formatTotal()}
      </p>

      {/* Right Side - Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
