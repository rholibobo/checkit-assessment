// components/MoviesPagination.tsx
"use client";

import { useRouter } from "next/navigation";
import TopPagination from "./ui/TopPagination";
import { FilterValues } from "./shared/FilterBar";

interface MoviesPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  searchValue?: string;
  showSearch?: boolean;
  onSearchChange?: (value: string) => void;
  onPageChange?: (page: number) => void;
  values: FilterValues;
  onChange: (filters: FilterValues) => void;
  onClear: () => void;
  hasActiveFilters: boolean
}

export function MoviesPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  searchValue,
  onSearchChange,
  onPageChange,
  values,
  onChange,
  onClear,
  hasActiveFilters = false,
  
}: MoviesPaginationProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/movies?page=${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <TopPagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      itemLabel="Popular Movies"
      onPageChange={onPageChange ?? handlePageChange}
      showFilters={false}
      defaultSearchValue={searchValue}
      searchPlaceholder="Search Movie"
      onSearchChange={onSearchChange}
      values={values}
      onChange={onChange}
      onClear={onClear}
      hasActiveFilters={hasActiveFilters}
    />
  );
}
