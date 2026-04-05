"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TMDBMovie, TMDBMovieListResponse } from "@/types/tmdb";
import { FilterBar, FilterValues } from "../shared/FilterBar";
import { MoviesPagination } from "../MoviesPagination";
import { EmptyState } from "../shared/EmptyState";
import { MovieCard } from "./MovieCard";
import BottomPagination from "../ui/BottomPagination";

interface MoviesContentProps {
  initialData: TMDBMovieListResponse;
  initialPage: number;
}

// Build a URL search string from all filter state
function buildUrl(params: {
  query: string;
  year: string;
  minRating: string;
  maxRating: string;
  page: number;
}): string {
  const sp = new URLSearchParams();
  if (params.query) sp.set("q", params.query);
  if (params.year) sp.set("year", params.year);
  if (params.minRating) sp.set("minRating", params.minRating);
  if (params.maxRating) sp.set("maxRating", params.maxRating);
  if (params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return qs ? `/movies?${qs}` : "/movies";
}

// Decide which API endpoint to call based on current filter state
function buildEndpoint(params: {
  query: string;
  year: string;
  minRating: string;
  maxRating: string;
  page: number;
}): string {
  const { query, year, minRating, maxRating, page } = params;

  if (query.trim()) {
    // Search endpoint — TMDB search doesn't support year/rating filters natively,
    // so we pass year as an additional hint when present
    const sp = new URLSearchParams({ query, page: String(page) });
    if (year) sp.set("year", year);
    return `/api/movies/search?${sp.toString()}`;
  }

  if (year || minRating || maxRating) {
    // Discover endpoint — supports all filter combinations
    const sp = new URLSearchParams({ page: String(page) });
    if (year) sp.set("year", year);
    if (minRating) sp.set("minRating", minRating);
    if (maxRating) sp.set("maxRating", maxRating);
    return `/api/movies/filter?${sp.toString()}`;
  }

  // Default popular movies
  return `/api/movies?page=${page}`;
}

export function MoviesContent({
  initialData,
  initialPage,
}: MoviesContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial state from URL
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [filters, setFilters] = useState<FilterValues>({
    year: searchParams.get("year") ?? "",
    minRating: searchParams.get("minRating") ?? "",
    maxRating: searchParams.get("maxRating") ?? "",
  });
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<TMDBMovieListResponse>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track the debounce timer
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasActiveFilters =
    !!filters.year || !!filters.minRating || !!filters.maxRating;

  const isFiltered = !!query.trim() || hasActiveFilters;

  // Core fetch function
  const fetchData = useCallback(
    async (params: {
      query: string;
      year: string;
      minRating: string;
      maxRating: string;
      page: number;
      pushUrl?: boolean;
    }) => {
      setLoading(true);
      setError(null);

      if (params.pushUrl !== false) {
        router.push(
          buildUrl({
            query: params.query,
            year: params.year,
            minRating: params.minRating,
            maxRating: params.maxRating,
            page: params.page,
          }),
          { scroll: false },
        );
      }

      try {
        const endpoint = buildEndpoint(params);
        const res = await fetch(endpoint);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error ?? `Request failed (${res.status})`);
        }
        const result: TMDBMovieListResponse = await res.json();
        setData(result);
        setPage(params.page);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  // Debounced search — fires when query changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchData({ query, ...filters, page: 1 });
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Filters change fires immediately (no debounce needed for dropdowns)
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    fetchData({ query, ...newFilters, page: 1 });
  };

  const handleClearFilters = () => {
    const cleared: FilterValues = { year: "", minRating: "", maxRating: "" };
    setFilters(cleared);
    fetchData({ query, ...cleared, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    fetchData({ query, ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (value: string) => {
    setQuery(value);
    // actual fetch is handled by the debounced useEffect above
  };

  const handleClearAll = () => {
    setQuery("");
    const cleared: FilterValues = { year: "", minRating: "", maxRating: "" };
    setFilters(cleared);
    fetchData({ query: "", ...cleared, page: 1 });
  };

  return (
    <div className="space-y-6 mt-8">
    
      {/* Search + pagination row */}
      <MoviesPagination
        currentPage={page}
        totalPages={data.total_pages}
        totalItems={data.total_results}
        itemsPerPage={20}
        showSearch={true}
        onSearchChange={handleSearchChange}
        searchValue={query}
        onPageChange={handlePageChange}
        values={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />


      {/* Divider */}
      <div className="border-t border-grey-200" />

      {/* Grid area */}
      <div className="relative min-h-100">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-xl">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {error ? (
          <EmptyState
            variant="error"
            description={error}
            actions={[
              {
                label: "Try again",
                onClick: () => fetchData({ query, ...filters, page }),
              },
            ]}
          />
        ) : data.results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {data.results.map((movie: TMDBMovie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <EmptyState
            variant={isFiltered ? "search" : "noData"}
            title={
              query
                ? `No results for "${query}"`
                : hasActiveFilters
                  ? "No movies match your filters"
                  : undefined
            }
            description={
              isFiltered ? "Try adjusting your search or filters." : undefined
            }
            actions={
              isFiltered
                ? [{ label: "Clear all", onClick: handleClearAll }]
                : undefined
            }
          />
        )}
      </div>

      <div className="mt-8">
        <BottomPagination
          currentPage={page}
          totalPages={data.total_pages}
          totalItems={data.total_results}
          itemsPerPage={20}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
