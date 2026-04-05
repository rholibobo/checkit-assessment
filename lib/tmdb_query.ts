import { BASE_URL, READ_ACCESS_TOKEN } from "@/env";
import { TMDBMovie, TMDBMovieListResponse } from "@/types/tmdb";


const headers = {
  accept: "application/json",
  Authorization: `Bearer ${READ_ACCESS_TOKEN}`,
};

export const TMDB_IMG_BASE = "https://image.tmdb.org/t/p";

export function getPosterUrl(path: string | null, size = "w500"): string | null {
  if (!path) return null;
  return `${TMDB_IMG_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size = "w1280"): string | null {
  if (!path) return null;
  return `${TMDB_IMG_BASE}/${size}${path}`;
}

export async function fetchMovies(page = 1): Promise<TMDBMovieListResponse> {
  const response = await fetch(
    `${BASE_URL}/movie/popular?page=${page}&language=en-US`,
    {
      headers,
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) throw new Error(`Failed to fetch movies: ${response.status}`);

  return response.json();
}

export async function fetchMovieById(id: number): Promise<TMDBMovie> {
  const response = await fetch(
    `${BASE_URL}/movie/${id}`,
    {
      headers,
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) throw new Error(`Failed to fetch movie ${id}: ${response.status}`);

  return response.json();
}