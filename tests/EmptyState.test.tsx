import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "../components/shared/EmptyState";


describe("EmptyState", () => {
  // ─── Default variant (noData) ────────────────────────────────────────────────

  it("renders the default noData variant when no variant is provided", () => {
    render(<EmptyState />);
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
    expect(
      screen.getByText("There's no data to display at the moment. Check back later.")
    ).toBeInTheDocument();
  });

  // ─── All built-in variants ───────────────────────────────────────────────────

  it("renders the search variant with correct default title and description", () => {
    render(<EmptyState variant="search" />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your search term or using different keywords.")
    ).toBeInTheDocument();
  });

  it("renders the error variant with correct default content", () => {
    render(<EmptyState variant="error" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText("We ran into an error loading this content. Please try again.")
    ).toBeInTheDocument();
  });

  it("renders the offline variant with correct default content", () => {
    render(<EmptyState variant="offline" />);
    expect(screen.getByText("You're offline")).toBeInTheDocument();
    expect(
      screen.getByText("Check your internet connection and try again.")
    ).toBeInTheDocument();
  });

  it("renders the custom variant with its default title", () => {
    render(<EmptyState variant="custom" />);
    expect(screen.getByText("Nothing to show")).toBeInTheDocument();
  });

  // ─── Custom overrides ────────────────────────────────────────────────────────

  it("overrides the default title with a custom title", () => {
    render(<EmptyState variant="search" title='No results for "batman"' />);
    expect(screen.getByText('No results for "batman"')).toBeInTheDocument();
    expect(screen.queryByText("No results found")).not.toBeInTheDocument();
  });

  it("overrides the default description with a custom description", () => {
    render(
      <EmptyState
        variant="error"
        description="Custom error message here."
      />
    );
    expect(screen.getByText("Custom error message here.")).toBeInTheDocument();
    expect(
      screen.queryByText("We ran into an error loading this content. Please try again.")
    ).not.toBeInTheDocument();
  });

  it("does not render a description paragraph when description is empty string", () => {
    render(<EmptyState variant="custom" description="" />);
    // custom variant has empty default description — no <p> should render
    const paragraphs = document.querySelectorAll("p");
    expect(paragraphs).toHaveLength(0);
  });

  it("renders a custom icon when provided", () => {
    render(
      <EmptyState
        variant="noData"
        icon={<span data-testid="custom-icon">★</span>}
      />
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("applies a custom className to the root element", () => {
    const { container } = render(
      <EmptyState className="my-custom-class" />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  // ─── Actions ─────────────────────────────────────────────────────────────────

  it("renders no action buttons when actions prop is not provided", () => {
    render(<EmptyState />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders no action buttons when actions is an empty array", () => {
    render(<EmptyState actions={[]} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a primary action button with correct label", () => {
    render(
      <EmptyState
        actions={[{ label: "Try again", onClick: vi.fn() }]}
      />
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("calls the action onClick handler when the button is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <EmptyState
        actions={[{ label: "Try again", onClick: handleClick }]}
      />
    );

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders multiple action buttons", () => {
    render(
      <EmptyState
        actions={[
          { label: "Try again", onClick: vi.fn() },
          { label: "Go home", onClick: vi.fn(), variant: "outline" },
        ]}
      />
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go home" })).toBeInTheDocument();
  });

  it("calls each action's handler independently", async () => {
    const user = userEvent.setup();
    const handlePrimary = vi.fn();
    const handleOutline = vi.fn();

    render(
      <EmptyState
        actions={[
          { label: "Primary", onClick: handlePrimary },
          { label: "Outline", onClick: handleOutline, variant: "outline" },
        ]}
      />
    );

    await user.click(screen.getByRole("button", { name: "Primary" }));
    expect(handlePrimary).toHaveBeenCalledTimes(1);
    expect(handleOutline).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Outline" }));
    expect(handleOutline).toHaveBeenCalledTimes(1);
  });

  it("applies outline styles when action variant is 'outline'", () => {
    render(
      <EmptyState
        actions={[{ label: "Cancel", onClick: vi.fn(), variant: "outline" }]}
      />
    );
    const btn = screen.getByRole("button", { name: "Cancel" });
    expect(btn).toHaveClass("border");
  });

  it("applies primary styles when action variant is not specified", () => {
    render(
      <EmptyState
        actions={[{ label: "Confirm", onClick: vi.fn() }]}
      />
    );
    const btn = screen.getByRole("button", { name: "Confirm" });
    expect(btn).toHaveClass("bg-primary");
  });
});