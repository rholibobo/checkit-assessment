import { MovieDetailHero } from "@/components/home/MovieDetailHero";
import { Breadcrumb } from "@/components/shared/BreadCrumb";
import { fetchMovieById, fetchMovies, getPosterUrl } from "@/lib/tmdb_query";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";



interface MoviePageProps {
  params: Promise<{ id: string }>;
}

// ─── Static Params (SSG) ──────────────────────────────────────────────────────
// Pre-renders the first 3 pages (60 movies) at build time.
// Any ID beyond this is fetched on-demand and cached via ISR.

export async function generateStaticParams() {
  try {
    const pages = await Promise.all([
      fetchMovies(1),
      fetchMovies(2),
      fetchMovies(3),
    ]);

    return pages
      .flatMap((data) => data.results)
      .map((movie) => ({ id: String(movie.id) }));
  } catch {
    return [];
  }
}

// ─── Metadata 

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  if (isNaN(movieId)) return { title: "Movie Not Found" };

  try {
    const movie = await fetchMovieById(movieId);
    const ogImage = getPosterUrl(movie.poster_path, "w500");

    return {
      title: `${movie.title}${movie.release_date ? ` (${new Date(movie.release_date).getFullYear()})` : ""}`,
      description: movie.overview
        ? movie.overview.slice(0, 160)
        : `Details for ${movie.title}`,
      openGraph: {
        title: movie.title,
        description: movie.overview ?? "",
        images: ogImage ? [{ url: ogImage, width: 500, alt: movie.title }] : [],
        type: "video.movie",
      },
      twitter: {
        card: "summary_large_image",
        title: movie.title,
        description: movie.overview?.slice(0, 200) ?? "",
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch {
    return { title: "Movie Not Found" };
  }
}

// ─── Page 

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  if (isNaN(movieId)) notFound();

  let movie;
  try {
    movie = await fetchMovieById(movieId);
  } catch {
    notFound();
  }


  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Movies", href: "/movies" },
    { label: movie.title },
  ];

  return (
    <main className="min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Hero section */}
      <MovieDetailHero movie={movie} />

      {/* Body content */}
      <div className="px-4 sm:px-6 lg:px-8 mt-10 max-w-5xl space-y-10">

        {/* Overview */}
        {movie.overview && (
          <section>
            <h2 className="text-xs md:text-base uppercase tracking-widest text-grey-500 font-medium mb-3">
              Overview
            </h2>
            <p className="text-grey-700 leading-relaxed text-base md:text-lg max-w-3xl">
              {movie.overview}
            </p>
          </section>
        )}

        {/* Production info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

          {/* Production companies */}
          {movie.production_companies.length > 0 && (
            <section>
              <h2 className="text-xs md:text-base uppercase tracking-widest text-grey-600 font-medium mb-3">
                Production
              </h2>
              <div className="flex flex-wrap gap-2">
                {movie.production_companies.map((c) => (
                  <span
                    key={c.id}
                    className="text-sm text-grey-700 bg-grey-100 border border-grey-200 px-3 py-1.5 rounded-lg"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Countries */}
          {movie.production_countries.length > 0 && (
            <section>
              <h2 className="text-xs md:text-base uppercase tracking-widest text-grey-500 font-medium mb-3">
                Countries
              </h2>
              <div className="flex flex-wrap gap-2">
                {movie.production_countries.map((c) => (
                  <span
                    key={c.iso_3166_1}
                    className="text-sm text-grey-700 bg-grey-100 border border-grey-200 px-3 py-1.5 rounded-lg"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {movie.spoken_languages.length > 0 && (
            <section>
              <h2 className="text-xs md:text-base uppercase tracking-widest text-grey-500 font-medium mb-3">
                Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {movie.spoken_languages.map((l) => (
                  <span
                    key={l.iso_639_1}
                    className="text-sm text-grey-700 bg-grey-100 border border-grey-200 px-3 py-1.5 rounded-lg"
                  >
                    {l.english_name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* External links */}
        <section>
          <h2 className="text-xs md:text-base uppercase tracking-widest text-grey-500 font-medium mb-3">
            Links
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`https://www.themoviedb.org/movie/${movie.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-grey-700 hover:text-grey-900 bg-grey-100 hover:bg-grey-200 border border-grey-200 px-4 py-2 rounded-lg transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              TMDB
            </Link>

            {movie.imdb_id && (
              <Link
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-grey-700 hover:text-grey-900 bg-grey-100 hover:bg-grey-200 border border-grey-200 px-4 py-2 rounded-lg transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                IMDb
              </Link>
            )}

            {movie.homepage && (
              <Link
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-grey-700 hover:text-grey-900 bg-grey-100 hover:bg-grey-200 border border-grey-200 px-4 py-2 rounded-lg transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Official site
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}