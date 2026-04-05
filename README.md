# Movies App

A Next.js movie browsing app built with the [TMDB API](https://developer.themoviedb.org/).

---

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **TMDB API v3**

---

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.development.local` file at the project root:

```bash
NEXT_PUBLIC_READ_ACCESS_TOKEN=your_read_access_token_here
```

Get your token from [TMDB API settings](https://www.themoviedb.org/settings/api).


### 3. Configure `next.config.ts`

```ts
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "image.tmdb.org",
      pathname: "/t/p/**",
    },
  ],
},
```

### 4. Run the dev server

```bash
npm run dev
```

---

## Project Structure

```
src/
  app/
    page.tsx                    # Listing page (ISR)
    error.tsx                   # Global error boundary
    not-found.tsx               # Global 404 page
    movies/
      [id]/
        page.tsx                # Detail page (SSG + ISR)
        loading.tsx             # Detail page skeleton
        error.tsx               # Detail page error boundary
    api/
      movies/
        route.ts                # GET /api/movies?page=
        search/
          route.ts              # GET /api/movies/search?query=&page=
  components/
    Breadcrumb.tsx              # Reusable breadcrumb nav
    EmptyState.tsx              # Reusable empty state
    MovieCard.tsx               # Card linking to detail page
    MovieDetailHero.tsx         # Hero section on detail page
    MovieDetailModal.tsx        # Full detail modal (alternative)
    MoviesContent.tsx           # Client component (search + pagination state)
    MoviesPagination.tsx        # Pagination wrapper
  lib/
    tmdb.ts                     # All TMDB fetch functions
  types/
    tmdb.ts                     # TypeScript interfaces
```

---

## Data Fetching Strategy

### Listing page (`/`)

Uses **ISR** (`revalidate: 3600`). The page is statically generated at build time and revalidated every hour. This means:

- First load is instant (served from cache)
- Content stays fresh without a full rebuild
- No server cost on every request

### Detail page (`/movies/[id]`)

Uses **SSG + ISR** via `generateStaticParams`. The first 60 movie pages (3 pages × 20 results) are pre-rendered at build time. Any movie ID beyond that is fetched on-demand and then cached.

---

## Pagination Decision: Pagination over Infinite Scroll

**Chose URL-based pagination** for the following reasons:

1. **SEO** — each page has a unique, crawlable URL (`/?page=3`). Infinite scroll produces a single URL that search engines can't index beyond the first viewport.
2. **Shareability** — users can copy and share a specific page, or bookmark where they left off.
3. **ISR compatibility** — Next.js can statically generate each numbered page at build time. Infinite scroll requires client-side fetching which bypasses ISR entirely.
4. **Accessibility** — keyboard navigation and screen readers work predictably with standard pagination links.
5. **Simplicity** — less JavaScript, no IntersectionObserver, no scroll position restoration needed.

---

## Image Fallback Strategy

Movie cards and the detail page both handle missing images gracefully:

- If `poster_path` is `null` → show a placeholder icon with the movie title
- If the image URL fails to load (`onError`) → fall back to the same placeholder
- If `backdrop_path` is `null` on the detail page → use a blurred, upscaled poster as the backdrop instead

---

## API Routes

The API routes exist to proxy TMDB requests from Client Components, keeping the token server-side.

| Route | Purpose |
|---|---|
| `GET /api/movies?page=` | Paginated popular movies |
| `GET /api/movies/search?query=&page=` | Movie search |

Server Components (`page.tsx`) call `lib/tmdb.ts` directly and never go through these routes.