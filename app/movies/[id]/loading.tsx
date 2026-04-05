export default function Loading() {
  return (
    <main className="min-h-screen">
      {/* Backdrop skeleton */}
      <div className="w-full h-56 sm:h-72 lg:h-96 bg-grey-100 animate-pulse" />

      <div className="px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-10 pb-16">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          {/* Poster skeleton */}
          <div className="w-36 sm:w-44 lg:w-52 shrink-0">
            <div className="aspect-[2/3] w-full rounded-xl bg-grey-200 animate-pulse" />
          </div>

          {/* Info skeleton */}
          <div className="flex flex-col gap-4 pt-2 sm:pt-16 flex-1">
            <div className="h-8 w-2/3 rounded-lg bg-grey-200 animate-pulse" />
            <div className="h-4 w-1/3 rounded bg-grey-200 animate-pulse" />
            <div className="flex gap-2">
              {[80, 60, 90, 70].map((w, i) => (
                <div
                  key={i}
                  className="h-6 rounded-full bg-grey-200 animate-pulse"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 w-24 rounded-lg bg-grey-100 animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Overview skeleton */}
        <div className="mt-10 max-w-3xl space-y-3">
          <div className="h-4 w-24 rounded bg-grey-200 animate-pulse" />
          <div className="h-3.5 w-full rounded bg-grey-100 animate-pulse" />
          <div className="h-3.5 w-full rounded bg-grey-100 animate-pulse" />
          <div className="h-3.5 w-4/5 rounded bg-grey-100 animate-pulse" />
        </div>
      </div>
    </main>
  );
}