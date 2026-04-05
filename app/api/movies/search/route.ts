import { NextRequest, NextResponse } from "next/server";
import { BASE_URL, READ_ACCESS_TOKEN } from "@/env";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";
  const page = searchParams.get("page") ?? "1";
  const year = searchParams.get("year") ?? "";

  if (!query.trim()) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({
    query,
    page,
    language: "en-US",
  });

  if (year) params.set("year", year);

  const response = await fetch(
    `${BASE_URL}/search/movie?${params.toString()}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${READ_ACCESS_TOKEN}`,
      },
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: `TMDB error: ${response.status}` },
      { status: response.status },
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
