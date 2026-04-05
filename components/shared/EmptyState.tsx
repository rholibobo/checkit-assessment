"use client";

import React from "react";

type EmptyStateVariant = "search" | "noData" | "error" | "offline" | "custom";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline";
}

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  actions?: EmptyStateAction[];
  icon?: React.ReactNode;
  className?: string;
}

const defaultContent: Record<
  EmptyStateVariant,
  { title: string; description: string; icon: React.ReactNode }
> = {
  search: {
    title: "No results found",
    description: "Try adjusting your search term or using different keywords.",
    icon: (
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
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
        <path d="M8 11h6M11 8v6" opacity="0.4" />
      </svg>
    ),
  },
  noData: {
    title: "Nothing here yet",
    description: "There's no data to display at the moment. Check back later.",
    icon: (
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
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  error: {
    title: "Something went wrong",
    description: "We ran into an error loading this content. Please try again.",
    icon: (
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
    ),
  },
  offline: {
    title: "You're offline",
    description: "Check your internet connection and try again.",
    icon: (
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
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <circle cx="12" cy="20" r="1" fill="currentColor" />
      </svg>
    ),
  },
  custom: {
    title: "Nothing to show",
    description: "",
    icon: (
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
        <path d="M8 12h8M12 8v8" opacity="0.4" />
      </svg>
    ),
  },
};

export function EmptyState({
  variant = "noData",
  title,
  description,
  actions,
  icon,
  className = "",
}: EmptyStateProps) {
  const defaults = defaultContent[variant];

  const resolvedIcon = icon ?? defaults.icon;
  const resolvedTitle = title ?? defaults.title;
  const resolvedDescription = description ?? defaults.description;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 py-20 gap-4 ${className}`}
    >
      {/* Icon */}
      <div className="text-grey-400 shrink-0">{resolvedIcon}</div>

      {/* Text */}
      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-base font-semibold text-grey-900">
          {resolvedTitle}
        </h3>
        {resolvedDescription && (
          <p className="text-sm md:text-base text-grey-500 leading-relaxed">
            {resolvedDescription}
          </p>
        )}
      </div>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={`text-sm md:text-base font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer ${
                action.variant === "outline"
                  ? "border border-grey-400 text-grey-700 hover:bg-grey-100"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}