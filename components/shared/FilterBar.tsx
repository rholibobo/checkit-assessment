"use client";

const CURRENT_YEAR = new Date().getFullYear();

// Years from current back to 1970
const YEARS = Array.from(
  { length: CURRENT_YEAR - 1969 },
  (_, i) => CURRENT_YEAR - i
);

const RATING_OPTIONS = [
  { label: "Any rating", min: "", max: "" },
  { label: "9+ Masterpiece", min: "9", max: "" },
  { label: "8+ Excellent", min: "8", max: "" },
  { label: "7+ Great", min: "7", max: "" },
  { label: "6+ Good", min: "6", max: "" },
  { label: "5+ Average", min: "5", max: "" },
  { label: "Below 5", min: "", max: "5" },
];

export interface FilterValues {
  year: string;
  minRating: string;
  maxRating: string;
}

interface FilterBarProps {
  values: FilterValues;
  onChange: (filters: FilterValues) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function FilterBar({
  values,
  onChange,
  onClear,
  hasActiveFilters,
}: FilterBarProps) {
  const selectedRatingOption =
    RATING_OPTIONS.find(
      (o) => o.min === values.minRating && o.max === values.maxRating
    ) ?? RATING_OPTIONS[0];

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...values, year: e.target.value });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const opt = RATING_OPTIONS[parseInt(e.target.value, 10)];
    onChange({ ...values, minRating: opt.min, maxRating: opt.max });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Year filter */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] md:text-xs uppercase tracking-widest text-grey-500 font-medium">
          Year
        </label>
        <select
          value={values.year}
          onChange={handleYearChange}
          className="text-sm text-grey-800 border border-grey-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-grey-500 cursor-pointer min-w-30"
        >
          <option value="">All years</option>
          {YEARS.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Rating filter */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] md:text-xs uppercase tracking-widest text-grey-500 font-medium">
          Rating
        </label>
        <select
          value={String(
            RATING_OPTIONS.findIndex(
              (o) => o.min === values.minRating && o.max === values.maxRating
            )
          )}
          onChange={handleRatingChange}
          className="text-sm text-grey-800 border border-grey-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-grey-500 cursor-pointer min-w-40"
        >
          {RATING_OPTIONS.map((opt, i) => (
            <option key={i} value={String(i)}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] opacity-0 select-none">clear</span>
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-grey-500 hover:text-grey-900 border border-grey-300 rounded-lg px-3 py-2 bg-white hover:bg-grey-50 transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Clear filters
          </button>
        </div>
      )}

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-1 w-full">
          {values.year && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {values.year}
              <button
                onClick={() => onChange({ ...values, year: "" })}
                aria-label="Remove year filter"
                className="hover:opacity-70"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {(values.minRating || values.maxRating) && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {selectedRatingOption.label}
              <button
                onClick={() => onChange({ ...values, minRating: "", maxRating: "" })}
                aria-label="Remove rating filter"
                className="hover:opacity-70"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}