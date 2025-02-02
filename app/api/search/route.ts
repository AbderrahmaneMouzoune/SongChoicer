import { NextResponse } from "next/server";
import { spotifyApi } from "@/lib/spotify";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) throw new Error("search: query param not provided");

  const clientCredentials = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(clientCredentials.body.access_token);

  const search = await spotifyApi.search(query, ["album"], { limit: 8 });

  const response = search.body.albums?.items;
  return NextResponse.json(response);
}
