"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-grey-300 mb-4">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-grey-900">Something went wrong</h1>
      <p className="text-grey-500 text-sm mt-2 max-w-sm">
        We ran into an unexpected error. You can try again or head back to the
        listing.
      </p>

      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg border border-grey-300 text-grey-700 hover:bg-grey-100 transition-colors"
        >
          Back to movies
        </Link>
      </div>
    </main>
  );
}