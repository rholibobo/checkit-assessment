import { NextRequest, NextResponse } from "next/server";
import { BASE_URL, READ_ACCESS_TOKEN } from "@/env";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page") ?? "1";
  const year = searchParams.get("year") ?? "";
  const minRating = searchParams.get("minRating") ?? "";
  const maxRating = searchParams.get("maxRating") ?? "";

  const params = new URLSearchParams({
    page,
    language: "en-US",
    sort_by: "popularity.desc",
  });

  if (year) params.set("primary_release_year", year);
  if (minRating) params.set("vote_average.gte", minRating);
  if (maxRating) params.set("vote_average.lte", maxRating);

  // Require a minimum vote count to avoid obscure films dominating high-rating filters
  if (minRating) params.set("vote_count.gte", "100");

  const response = await fetch(
    `${BASE_URL}/discover/movie?${params.toString()}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${READ_ACCESS_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: `TMDB error: ${response.status}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}