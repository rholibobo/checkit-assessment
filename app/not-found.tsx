import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-grey-200 select-none">404</p>

      <h1 className="text-2xl font-bold text-grey-900 mt-4">Page not found</h1>
      <p className="text-grey-500 text-sm mt-2 max-w-sm">
        The movie or page you&apos;re looking for doesn&apos;t exist or may have
        been removed.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to movies
      </Link>
    </main>
  );
}