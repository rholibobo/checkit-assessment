import Image from "next/image";
import { TMDBMovie } from "@/types/tmdb";
import { getBackdropUrl, getPosterUrl } from "@/lib/tmdb_query";
import StatPill from "../shared/StatPill";
import { formatRuntime } from "@/utils/formatRuntime";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatVotes } from "@/utils/formatVotes";

interface MovieDetailHeroProps {
  movie: TMDBMovie;
}

export function MovieDetailHero({ movie }: MovieDetailHeroProps) {
  const posterSrc = getPosterUrl(movie.poster_path, "w500");
  const backdropSrc = getBackdropUrl(movie.backdrop_path, "w1280");

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  const releaseFormatted = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "TBA";

  const scoreColor =
    movie.vote_average >= 7.5
      ? "text-emerald-600"
      : movie.vote_average >= 5
        ? "text-amber-600"
        : "text-rose-600";

  return (
    <div className="flex flex-col">
      {/* Backdrop */}
      <div className="relative w-full h-56 sm:h-72 lg:h-96 overflow-hidden bg-grey-100">
        {backdropSrc ? (
          <>
            <Image
              src={backdropSrc}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-white via-white/20 to-transparent" />
          </>
        ) : posterSrc ? (
          <>
            <Image
              src={posterSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center blur-xl scale-110 opacity-30"
            />
            <div className="absolute inset-0 bg-linear-to-t from-white via-white/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-grey-100" />
        )}
      </div>

      {/* Content — poster overlaps backdrop */}
      <div className="px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-10">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          {/* Poster */}
          <div className="w-36 sm:w-44 lg:w-52 shrink-0">
            <div className="relative aspect-2/3 w-full rounded-xl overflow-hidden border border-grey-200 shadow-xl bg-grey-100">
              {posterSrc ? (
                <Image
                  src={posterSrc}
                  alt={`${movie.title} poster`}
                  fill
                  sizes="(max-width: 640px) 144px, (max-width: 1024px) 176px, 208px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-grey-400"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 pt-2 sm:pt-16 flex-1 min-w-0">
            {/* Title */}
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-grey-900 leading-tight">
                  {movie.title}
                </h1>
                {releaseYear && (
                  <span className="text-lg text-grey-600 font-normal shrink-0">
                    ({releaseYear})
                  </span>
                )}
              </div>
              {movie.original_title !== movie.title && (
                <p className="text-sm text-grey-600 mt-0.5 italic">
                  {movie.original_title}
                </p>
              )}
              {movie.tagline && (
                <p className="text-sm text-grey-600 mt-1 italic">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Score + badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-primary-500 shrink-0"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span
                  className={`text-xl font-bold tabular-nums ${scoreColor}`}
                >
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-sm text-grey-500">/ 10</span>
              </div>
              <span className="text-sm text-grey-500">
                {formatVotes(movie.vote_count)} votes
              </span>
              {movie.adult && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-600 border border-rose-200">
                  18+
                </span>
              )}
              {movie.status && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-grey-100 text-grey-600 border border-grey-200">
                  {movie.status}
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs font-medium px-3 py-1 rounded-full border border-grey-300 text-grey-700 bg-white"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-2">
              <StatPill label="Release" value={releaseFormatted} />
              <StatPill label="Runtime" value={formatRuntime(movie.runtime)} />
              <StatPill
                label="Language"
                value={movie.original_language.toUpperCase()}
              />
              <StatPill label="Budget" value={formatCurrency(movie.budget)} />
              <StatPill label="Revenue" value={formatCurrency(movie.revenue)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
