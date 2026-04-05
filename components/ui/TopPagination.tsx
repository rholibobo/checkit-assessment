"use client";

import React, { useState } from "react";
import { DocumentFilter, Trash } from "iconsax-reactjs";
import Button from "../shared/Button";
import Pagination from "../shared/Pagination";
import { FilterBar, FilterValues } from "../shared/FilterBar";

interface TopPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemLabel?: string; // e.g., "Artworks", "African Artist"
  onPageChange: (page: number) => void;
  onFilterClick?: () => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  isFilterOpen?: boolean;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  defaultSearchValue?: string;
  className?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  values: FilterValues;
  onChange: (filters: FilterValues) => void;
  onClear: () => void;
}

export default function TopPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemLabel = "Items",
  onPageChange,
  onFilterClick,
  onClearFilters,
  hasActiveFilters = false,
  isFilterOpen = false,
  onSearchChange,
  searchPlaceholder = "Search by Artist Name",
  defaultSearchValue = "",
  className = "",
  showFilters = true,
  showSearch = true,
  values,
  onChange,
  onClear,
}: TopPaginationProps) {
  const [searchValue, setSearchValue] = useState(defaultSearchValue ?? "");

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  return (
    <div className={`space-y-4 md:space-y-6 ${className}`}>
      <div>
        {/* Summary Text */}
        <p className="text-sm md:text-base text-grey-1000">
          <strong>
            {startItem} to {endItem}
          </strong>{" "}
          of{" "}
          <strong>
            {totalItems.toLocaleString('en-US')} <span className="text-primary">{itemLabel}</span>
          </strong>
        </p>
      </div>

      {/* Divider */}
      <div className="border-b border-grey-400"></div>
      <div className="grid grid-cols-12 mt-4 md:mt-8 gap-4 md:gap-0">
        <div className="col-span-12 md:col-span-4">
          <FilterBar
          values={values}
          onChange={onChange}
          onClear={onClear}
          hasActiveFilters={hasActiveFilters}
        />
        </div>
        
        {/* Controls Row */}
        <div className="col-span-12 md:col-span-8 flex items-center justify-between gap-3 md:gap-4">
          {/* Desktop filter buttons - hidden on mobile */}
          {showFilters && (
            <div className="hidden md:flex items-center gap-4">
              <Button
                onClick={onFilterClick}
                variant="outline"
                size="sm"
                className="font-semibold py-4 px-5 gap-2 text-sm"
                type="button"
              >
                <DocumentFilter size={18} color="var(--color-grey-900)" />
                <span>{isFilterOpen ? "Hide Filter" : "All Filters"}</span>
              </Button>
              {isFilterOpen && hasActiveFilters && onClearFilters && (
                <Button
                  onClick={onClearFilters}
                  variant="outline"
                  size="sm"
                  className="font-semibold py-4 px-5 gap-2 text-grey-700 text-sm"
                  type="button"
                >
                  <Trash size={18} color="var(--color-grey-700)" />
                  <span>Clear filters</span>
                </Button>
              )}
            </div>
          )}

          {/* Search input */}
          {showSearch && (
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="flex-1 max-w-sm px-3 py-3 md:px-4 md:py-4 border border-grey-400 rounded-md outline-none focus:border-grey-600 text-sm placeholder:text-grey-500"
            />
          )}

          {/* Mobile filter icon button */}
          {showFilters && (
            <button
              onClick={onFilterClick}
              className="md:hidden flex items-center justify-center w-11 h-11 border-0.5 border-grey-500 rounded-sm shrink-0 cursor-pointer"
              type="button"
              aria-label="Open filters"
            >
              <DocumentFilter size={20} color="var(--color-grey-900)" />
            </button>
          )}

          {/* Desktop pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            className="hidden md:flex w-[40%]"
          />
        </div>
      </div>
    </div>
  );
}
