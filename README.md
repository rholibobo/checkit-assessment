# Movies App

A full-featured movie browsing application built with Next.js 15 and the TMDB API. Supports server-side rendering, static generation, search, filtering, pagination, and a full movie detail page — with tests covering key components.

---

## Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** (App Router) | Framework — routing, SSR, SSG, ISR, API routes |
| **TypeScript** | Type safety across all components, pages, and API routes |
| **Tailwind CSS** | Utility-first styling |
| **TMDB API v3** | Movie data — listings, search, discover, and detail |
| **Vitest** | Unit test runner |
| **React Testing Library** | Component testing |

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd movies-app
npm install
```

### 2. Set up environment variables

Create a `.env.development.local` file at the project root:

```bash
NEXT_PUBLIC_READ_ACCESS_TOKEN=your_read_access_token_here
```

Get your token from [TMDB API settings](https://www.themoviedb.org/settings/api).


### 3. Configure `next.config.ts`

Add TMDB's image CDN to the allowed remote patterns:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Project Structure

```
your-project/
├── .env.local                            ← TMDB_READ_ACCESS_TOKEN (never commit this)
├── next.config.ts                        ← image.tmdb.org remotePatterns
├── vitest.config.ts                      ← Vitest + jsdom + path aliases
├── README.md
│
└── src/
    ├── app/
    │   ├── page.tsx                      ← Listing page (ISR, revalidates hourly)
    │   ├── error.tsx                     ← Global error boundary (Client Component)
    │   ├── not-found.tsx                 ← Global 404 page
    │   │
    │   ├── movies/
    │   │   ├── loading.tsx               ← Listing page skeleton
    │   │   └── [id]/
    │   │       ├── page.tsx              ← Detail page (SSG + ISR + metadata)
    │   │       ├── loading.tsx           ← Detail page skeleton
    │   │       └── error.tsx             ← Detail page error boundary
    │   │
    │   └── api/
    │       └── movies/
    │           ├── route.ts              ← GET /api/movies?page=
    │           ├── search/
    │           │   └── route.ts          ← GET /api/movies/search?query=&page=&year=
    │           └── filter/
    │               └── route.ts          ← GET /api/movies/filter?year=&minRating=&maxRating=
    │
    ├── components/
    │   ├── ui/
    │   │   ├── TopPagination.tsx         ← Pagination + search + filter controls row
    │   │   └── Pagination.tsx            ← Prev / page numbers / next buttons
    │   │
    │   ├── shared/
    │   │   └── Button.tsx                ← Shared button primitive
    │   │
    │   ├── Breadcrumb.tsx                ← Reusable breadcrumb navigation
    │   ├── EmptyState.tsx                ← Reusable empty/error/offline state display
    │   ├── FilterBar.tsx                 ← Year and rating filter dropdowns with pills
    │   ├── MovieCard.tsx                 ← Movie card (poster, title, overview, metadata)
    │   ├── MovieDetailHero.tsx           ← Backdrop + poster + stats hero section
    │   ├── MovieDetailModal.tsx          ← Full detail overlay modal (alternative UX)
    │   ├── MoviesContent.tsx             ← Client component owning search/filter/page state
    │   └── MoviesPagination.tsx          ← Pagination wrapper wired to URL navigation
    │
    ├── lib/
    │   └── tmdb.ts                       ← fetchMovies, fetchMovieById, getPosterUrl, getBackdropUrl
    │
    ├── types/
    │   └── tmdb.ts                       ← TMDBMovie, TMDBMovieListResponse, and all nested types
    │
    ├── env.ts                            ← BASE_URL and READ_ACCESS_TOKEN exports
    │
    └── tests/
        ├── setup.tsx                     ← jest-dom, next/link, next/image, next/navigation mocks
        ├── Breadcrumb.test.tsx           ← 12 tests, 100% coverage
        ├── EmptyState.test.tsx           ← 16 tests, 100% coverage
        └── FilterBar.test.tsx            ← 17 tests, 100% coverage
```

---

## Features

### Listing Page (`/`)

- **ISR** — statically generated at build time, revalidated every hour
- Displays 20 movies per page from TMDB's popular movies endpoint
- Responsive grid: 1 columns on mobile → 3 on tablet → 4 on desktop → 5 on wide screens
- Each card shows: poster image, title, 2-line clamped overview, release date, vote count, score badge, and genre pills
- Graceful image fallback — placeholder icon shown if `poster_path` is null or the image fails to load

### Search

- Debounced search input (350ms) — fires after the user stops typing
- Calls `/api/movies/search` which proxies TMDB's `/search/movie` endpoint
- Year filter is passed alongside the search query when both are active
- URL updates on every search so results are shareable (`/?q=inception`)

### Filtering

Two filters available in the `FilterBar`:

| Filter | Options | API param |
|---|---|---|
| **Year** | All years / 1970–present | `primary_release_year` |
| **Rating** | Any / 9+ / 8+ / 7+ / 6+ / 5+ / Below 5 | `vote_average.gte` / `vote_average.lte` |

- Filter state is reflected in the URL (`/?year=2024&minRating=7`)
- Active filters shown as dismissible pills
- Filters use TMDB's `/discover/movie` endpoint which natively supports all combinations
- A minimum vote count of 100 is enforced when filtering by rating to avoid obscure films dominating results

### URL-Driven State

All search, filter, and pagination state lives in the URL:

```
/?q=batman&year=2022&minRating=8&page=2
/?year=2024
/?q=inception
```

Every URL is fully shareable and produces the same results when opened directly.

### Detail Page (`/movies/[id]`)

- **SSG + ISR** — first 60 movies (3 pages × 20) pre-rendered at build time via `generateStaticParams`, remaining IDs fetched on demand and cached
- Full metadata export: `title`, `description`, `og:image`, `og:type: video.movie`, Twitter card
- Sections: backdrop hero, poster, title, tagline, score, genres, overview, stats grid (release date, runtime, budget, revenue), production companies, countries, languages, external links (TMDB, IMDb, official site)
- Calls `notFound()` for invalid or non-existent IDs → renders the global 404 page
- Breadcrumb navigation back to the listing

### Breadcrumb

Reusable `<Breadcrumb>` component that accepts an array of `{ label, href? }` items. The last item is always rendered as plain text with `aria-current="page"`. All others render as links.

### Empty States

Reusable `<EmptyState>` component with 5 built-in variants:

| Variant | When used |
|---|---|
| `search` | Query or filter returned no results |
| `noData` | List is empty with no active filters |
| `error` | Fetch failed |
| `offline` | Network error |
| `custom` | Bring your own icon and copy |

All variants accept custom `title`, `description`, `icon`, and `actions` overrides.

### Error Handling

- `app/error.tsx` — global error boundary with "Try again" reset and "Back to movies" link
- `app/movies/[id]/error.tsx` — scoped error boundary for the detail page
- `app/not-found.tsx` — rendered by `notFound()` for invalid movie IDs
- All API routes return structured `{ error: string }` JSON with correct HTTP status codes

---

## Data Fetching Strategy

### Listing page

Uses **ISR** (`next: { revalidate: 3600 }`). The page is statically generated at build time and revalidated every hour:

- First load is instant — served from the static cache
- Content stays fresh without a full rebuild
- No per-request server cost

### Detail page

Uses **SSG + ISR** via `generateStaticParams`. The 60 most popular movies are pre-rendered at build time. Any ID beyond that is fetched on-demand and then ISR-cached for subsequent requests.

### Server Components vs API routes

Server Components (`page.tsx` files) call `lib/tmdb_query.ts` directly — no API round trip needed. API routes exist only for Client Component fetches (search, filter, load more) where the request originates in the browser.

```
Browser request
  └── page.tsx (Server Component)
        └── lib/tmdb_query.ts → TMDB API directly  ✓

User types in search box
  └── MoviesContent.tsx (Client Component)
        └── /api/movies/search (API Route)
              └── TMDB API  ✓  (token never leaves the server)
```

---

## API Routes

| Route | Query params | TMDB endpoint | Used by |
|---|---|---|---|
| `GET /api/movies` | `page` | `/movie/popular` | MoviesContent (default) |
| `GET /api/movies/search` | `query`, `page`, `year` | `/search/movie` | MoviesContent (search) |
| `GET /api/movies/filter` | `page`, `year`, `minRating`, `maxRating` | `/discover/movie` | MoviesContent (filters) |

---

## Pagination Decision: Pagination over Infinite Scroll

URL-based pagination was chosen over infinite scroll for the following reasons:

1. **SEO** — each page has a unique, crawlable URL (`/?page=3`). Infinite scroll produces a single URL that search engines cannot index beyond the initial viewport.
2. **Shareability** — users can copy, share, or bookmark a specific page and return to the exact same results.
3. **ISR compatibility** — Next.js can statically generate each numbered page. Infinite scroll requires client-side fetching on every load, bypassing ISR entirely.
4. **Accessibility** — keyboard navigation and screen readers handle standard pagination links predictably without custom ARIA management.
5. **Simplicity** — no `IntersectionObserver`, no scroll position restoration, less JavaScript overall.

---

## Image Fallback Strategy

Both `MovieCard` and `MovieDetailHero` handle missing images at two levels:

1. `poster_path` is `null` → render a placeholder icon with the movie title
2. Image URL is valid but fails to load (`onError`) → fall back to the same placeholder
3. `backdrop_path` is `null` on the detail page → use a blurred, scaled-up version of the poster as the backdrop instead of leaving the area empty

---

## Testing

Tests are written with **Vitest** and **React Testing Library**. Three components are tested with 100% coverage.

### Run tests

```bash
npm test                  # run all tests once
npm run test:watch        # watch mode — reruns on file changes
npm run test:coverage     # run with v8 coverage report
```

### Test files

| File | Component | Tests | What's covered |
|---|---|---|---|
| `Breadcrumb.test.tsx` | `Breadcrumb` | 12 | Nav landmark, link vs span rendering, last item never a link, `aria-current`, separator count, custom className, edge cases |
| `EmptyState.test.tsx` | `EmptyState` | 16 | All 5 variants, custom title/description/icon overrides, empty description edge case, zero/multiple actions, click handlers, primary vs outline styles |
| `FilterBar.test.tsx` | `FilterBar` | 17 | Default render, conditional clear button and pills, year/rating select interactions, `onChange` shape for all rating options including "Below 5", pill dismiss buttons, controlled value reflection |

### Mocks

`src/tests/setup.tsx` mocks the following for all test files:

- `next/link` → plain `<a>` tag
- `next/image` → plain `<img>` tag
- `next/navigation` → `useRouter`, `useSearchParams`, `usePathname` stubs

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TMDB_READ_ACCESS_TOKEN` | Yes | TMDB API Read Access Token. Server-only — no `NEXT_PUBLIC_` prefix. |