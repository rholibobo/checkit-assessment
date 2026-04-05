import { BASE_URL, READ_ACCESS_TOKEN } from "@/env";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";

  const response = await fetch(
    `${BASE_URL}/movie/popular?page=${page}&language=en-US`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${READ_ACCESS_TOKEN}`,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: `Failed to fetch movies: ${response.status}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}


