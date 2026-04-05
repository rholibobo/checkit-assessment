import { MoviesContent } from "@/components/home/MovieContent";
import { EmptyState } from "@/components/shared/EmptyState";

import HeaderText from "@/components/shared/HeaderText";

import { fetchMovies } from "@/lib/tmdb_query";
import { Suspense } from "react";

interface MoviesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: MoviesPageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));

  const data = await fetchMovies(currentPage);

  return (
    <main className="app-container py-24">
      <HeaderText
        title="Explore Popular Movies"
        description="Explore popular movies, search by title, and filter by year or rating to find exactly what you're looking for."
        className="text-start w-full md:w-[60%] space-y-4"
      />

    

      <Suspense fallback={null}>
        <MoviesContent initialData={data} initialPage={currentPage} />
      </Suspense>
    </main>
  );
}
