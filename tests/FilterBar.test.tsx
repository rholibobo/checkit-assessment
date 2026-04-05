import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar, FilterValues } from "../components/shared/FilterBar";


const emptyFilters: FilterValues = {
  year: "",
  minRating: "",
  maxRating: "",
};

describe("FilterBar", () => {
  // ─── Rendering ───────────────────────────────────────────────────────────────

  it("renders year and rating select dropdowns", () => {
    render(
      <FilterBar
        values={emptyFilters}
        onChange={vi.fn()}
        onClear={vi.fn()}
        hasActiveFilters={false}
      />
    );
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rating/i)).toBeInTheDocument();
  });

  it("renders 'All years' as the default option in the year dropdown", () => {
    render(
      <FilterBar
        values={emptyFilters}
        onChange={vi.fn()}
        onClear={vi.fn()}
        hasActiveFilters={false}
      />
    );
    const yearSelect = screen.getByLabelText(/year/i);
    expect(within(yearSelect).getByText("All years")).toBeInTheDocument();
  });

  it("renders 'Any rating' as the default option in the rating dropdown", () => {
    render(
      <FilterBar
        values={emptyFilters}
        onChange={vi.fn()}
        onClear={vi.fn()}
        hasActiveFilters={false}
      />
    );
    const ratingSelect = screen.getByLabelText(/rating/i);
    expect(within(ratingSelect).getByText("Any rating")).toBeInTheDocument();
  });

  it("does not render 'Clear filters' button when hasActiveFilters is false", () => {
    render(
      <FilterBar
        values={emptyFilters}
        onChange={vi.fn()}
        onClear={vi.fn()}
        hasActiveFilters={false}
      />
    );
    expect(
      screen.queryByRole("button", { name: /clear filters/i })
    ).not.toBeInTheDocument();
  });

  it("does not render filter pills when hasActiveFilters is false", () => {
    render(
      <FilterBar
        values={emptyFilters}
        onChange={vi.fn()}
        onClear={vi.fn()}
        hasActiveFilters={false}
      />
    );
    expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();
  });

  // ─── Active filters UI ───────────────────────────────────────────────────────

  it("renders the 'Clear filters' button when hasActiveFilters is true", () => {
    render(
      <FilterBar
        values={{ ...emptyFilters, year: "2024" }}
        onChange={vi.fn()}
        onClear={vi.fn()}
        hasActiveFilters={true}
      />
    );
    expect(
      screen.getByRole("button", { name: /clear filters/i })
    ).toBeInTheDocument();
  });

  it("renders a year pill when a year filter is active", () => {
    render(
      <FilterBar
        values={{ ...emptyFilters, year: "2022" }}
        onChange={vi.fn()}
        onClear={vi.fn()}
        hasActiveFilters={true}
      />
    );
    expect(screen.getByText("2022")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove year filter/i })
    ).toBeInTheDocument();
  });

  it("renders a rating pill when a rating filter is active", () => {
    render(
      <FilterBar
        values={{ ...emptyFilters, minRating: "8", maxRating: "" }}
        onChange={vi.fn()}
        onClear={vi.fn()}
        hasActiveFilters={true}
      />
    );
    expect(screen.getByText("8+ Excellent")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove rating filter/i })
    ).toBeInTheDocument();
  });

  it("renders the correct label for 'Below 5' rating pill", () => {
    render(
      <FilterBar
        values={{ ...emptyFilters, minRating: "", maxRating: "5" }}
        onChange={vi.fn()}
        onClear={vi.fn()}
        hasActiveFilters={true}
      />
    );
    expect(screen.getByText("Below 5")).toBeInTheDocument();
  });

  it("renders both year and rating pills when both filters are active", () => {
    render(
      <FilterBar
        values={{ year: "2020", minRating: "7", maxRating: "" }}
        onChange={vi.fn()}
        onClear={vi.fn()}
        hasActiveFilters={true}
      />
    );
    expect(screen.getByText("2020")).toBeInTheDocument();
    expect(screen.getByText("7+ Great")).toBeInTheDocument();
  });

  // ─── Interactions ─────────────────────────────────────────────────────────────

  it("calls onChange with updated year when year select changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <FilterBar
        values={emptyFilters}
        onChange={handleChange}
        onClear={vi.fn()}
        hasActiveFilters={false}
      />
    );

    await user.selectOptions(screen.getByLabelText(/year/i), "2021");
    expect(handleChange).toHaveBeenCalledWith({
      year: "2021",
      minRating: "",
      maxRating: "",
    });
  });

  it("calls onChange with correct minRating when rating select changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <FilterBar
        values={emptyFilters}
        onChange={handleChange}
        onClear={vi.fn()}
        hasActiveFilters={false}
      />
    );

    // Select "8+ Excellent" (index 2)
    await user.selectOptions(screen.getByLabelText(/rating/i), "2");
    expect(handleChange).toHaveBeenCalledWith({
      year: "",
      minRating: "8",
      maxRating: "",
    });
  });

  it("calls onChange with maxRating set when 'Below 5' is selected", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <FilterBar
        values={emptyFilters}
        onChange={handleChange}
        onClear={vi.fn()}
        hasActiveFilters={false}
      />
    );

    // Select "Below 5" (index 6)
    await user.selectOptions(screen.getByLabelText(/rating/i), "6");
    expect(handleChange).toHaveBeenCalledWith({
      year: "",
      minRating: "",
      maxRating: "5",
    });
  });

  it("calls onClear when 'Clear filters' button is clicked", async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();

    render(
      <FilterBar
        values={{ ...emptyFilters, year: "2024" }}
        onChange={vi.fn()}
        onClear={handleClear}
        hasActiveFilters={true}
      />
    );

    await user.click(screen.getByRole("button", { name: /clear filters/i }));
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it("calls onChange clearing year when the year pill dismiss button is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <FilterBar
        values={{ year: "2023", minRating: "", maxRating: "" }}
        onChange={handleChange}
        onClear={vi.fn()}
        hasActiveFilters={true}
      />
    );

    await user.click(screen.getByRole("button", { name: /remove year filter/i }));
    expect(handleChange).toHaveBeenCalledWith({
      year: "",
      minRating: "",
      maxRating: "",
    });
  });

  it("calls onChange clearing rating when the rating pill dismiss button is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <FilterBar
        values={{ year: "", minRating: "7", maxRating: "" }}
        onChange={handleChange}
        onClear={vi.fn()}
        hasActiveFilters={true}
      />
    );

    await user.click(screen.getByRole("button", { name: /remove rating filter/i }));
    expect(handleChange).toHaveBeenCalledWith({
      year: "",
      minRating: "",
      maxRating: "",
    });
  });

  // ─── Controlled values ───────────────────────────────────────────────────────

  it("reflects the current year value in the year select", () => {
    render(
      <FilterBar
        values={{ ...emptyFilters, year: "2019" }}
        onChange={vi.fn()}
        onClear={vi.fn()}
        hasActiveFilters={true}
      />
    );
    const yearSelect = screen.getByLabelText(/year/i) as HTMLSelectElement;
    expect(yearSelect.value).toBe("2019");
  });

  it("reflects the current rating value in the rating select", () => {
    render(
      <FilterBar
        values={{ ...emptyFilters, minRating: "9", maxRating: "" }}
        onChange={vi.fn()}
        onClear={vi.fn()}
        hasActiveFilters={true}
      />
    );
    // index 1 = "9+ Masterpiece"
    const ratingSelect = screen.getByLabelText(/rating/i) as HTMLSelectElement;
    expect(ratingSelect.value).toBe("1");
  });
});