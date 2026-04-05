import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "../components/shared/BreadCrumb";


describe("Breadcrumb", () => {
  // ─── Rendering ──────────────────────────────────────────────────────────────

  it("renders a nav element with the correct aria-label", () => {
    render(<Breadcrumb items={[{ label: "Home", href: "/" }]} />);
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" })
    ).toBeInTheDocument();
  });

  it("renders all item labels", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Movies", href: "/movies" },
          { label: "Interstellar" },
        ]}
      />
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Movies")).toBeInTheDocument();
    expect(screen.getByText("Interstellar")).toBeInTheDocument();
  });

  // ─── Links ───────────────────────────────────────────────────────────────────

  it("renders non-last items with hrefs as anchor links", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Movies", href: "/movies" },
          { label: "Interstellar" },
        ]}
      />
    );
    const homeLink = screen.getByRole("link", { name: "Home" });
    const moviesLink = screen.getByRole("link", { name: "Movies" });

    expect(homeLink).toHaveAttribute("href", "/");
    expect(moviesLink).toHaveAttribute("href", "/movies");
  });

  it("does not render the last item as a link even if it has an href", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Interstellar", href: "/movies/157336" },
        ]}
      />
    );
    // "Home" should be a link, "Interstellar" (last item) should not
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Interstellar" })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Interstellar").tagName).toBe("SPAN");
  });

  it("renders an item without an href as a span, not a link", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home" }, // no href
          { label: "Movies" },
        ]}
      />
    );
    expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
    expect(screen.getByText("Home").tagName).toBe("SPAN");
  });

  // ─── Active page ─────────────────────────────────────────────────────────────

  it("marks the last item with aria-current='page'", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Interstellar" },
        ]}
      />
    );
    const current = screen.getByText("Interstellar");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("does not mark non-last items with aria-current", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Movies", href: "/movies" },
          { label: "Interstellar" },
        ]}
      />
    );
    expect(screen.getByText("Home")).not.toHaveAttribute("aria-current");
    expect(screen.getByText("Movies")).not.toHaveAttribute("aria-current");
  });

  // ─── Separators ──────────────────────────────────────────────────────────────

  it("renders separators between items but not after the last item", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Movies", href: "/movies" },
          { label: "Interstellar" },
        ]}
      />
    );
    // 3 items → 2 separators (chevron SVGs)
    const separators = document
      .querySelectorAll('svg[aria-hidden="true"]');
    expect(separators).toHaveLength(2);
  });

  it("renders no separators for a single item", () => {
    render(<Breadcrumb items={[{ label: "Home" }]} />);
    expect(document.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(0);
  });

  // ─── className ───────────────────────────────────────────────────────────────

  it("applies a custom className to the nav element", () => {
    render(
      <Breadcrumb items={[{ label: "Home" }]} className="my-custom-class" />
    );
    expect(screen.getByRole("navigation")).toHaveClass("my-custom-class");
  });

  it("uses an empty string as the default className", () => {
    render(<Breadcrumb items={[{ label: "Home" }]} />);
    // Should not throw and nav should be present
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  // ─── Edge cases ───────────────────────────────────────────────────────────────

  it("renders correctly with a single item", () => {
    render(<Breadcrumb items={[{ label: "Home", href: "/" }]} />);
    // Single item is always "last" — renders as span, not link
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders correctly with two items", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Detail" },
        ]}
      />
    );
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Detail" })).not.toBeInTheDocument();
  });
});