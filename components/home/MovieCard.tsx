"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { TMDBMovie } from "@/types/tmdb";
import { getPosterUrl } from "@/lib/tmdb_query";


interface MovieCardProps {
  movie: TMDBMovie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);

  const posterSrc = getPosterUrl(movie.poster_path);
  const showFallback = !posterSrc || imgError;

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  const formattedDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "TBA";

  const voteFormatted =
    movie.vote_count >= 1000
      ? `${(movie.vote_count / 1000).toFixed(1)}k`
      : movie.vote_count.toString();

  const scoreColor =
    movie.vote_average >= 7.5
      ? "text-emerald-400"
      : movie.vote_average >= 5
        ? "text-amber-400"
        : "text-rose-400";

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group relative flex flex-col bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60"
    >
        {/* Poster */}
        <div className="relative aspect-2/3 w-full overflow-hidden bg-zinc-800">
          {showFallback ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 px-4 text-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-zinc-600"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="text-zinc-600 text-xs leading-tight line-clamp-2">
                {movie.title}
              </span>
            </div>
          ) : (
            <Image
              src={posterSrc}
              alt={`${movie.title} poster`}
              fill
              priority
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          )}

          {/* Score badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-amber-400 shrink-0"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className={`text-xs font-semibold tabular-nums ${scoreColor}`}>
              {movie.vote_average.toFixed(1)}
            </span>
          </div>

          {movie.adult && (
            <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              18+
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-2 p-3 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-sm font-semibold text-white leading-snug line-clamp-1 flex-1">
              {movie.title}
            </h2>
            {releaseYear && (
              <span className="text-xs text-zinc-500 shrink-0 mt-0.5">
                {releaseYear}
              </span>
            )}
          </div>

          {movie.overview && (
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
              {movie.overview}
            </p>
          )}

          {movie.genres?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto pt-1">
              {movie.genres.slice(0, 3).map((g) => (
                <span
                  key={g.id}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-zinc-800 mt-1">
            <span className="text-[11px] text-zinc-500">{formattedDate}</span>
            <span className="text-[11px] text-zinc-500 flex items-center gap-1">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-zinc-600"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {voteFormatted}
            </span>
          </div>
        </div>
    </Link>
  );
}