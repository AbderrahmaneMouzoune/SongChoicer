"use client";

import { useQuery } from "@tanstack/react-query";

import { AlbumResponse, getAlbum } from "@/app/api/album/methods";
import { Song } from "@/app/lib/types";

import SongRanker from "@/components/SongRanker";
import { useMemo } from "react";
import { VersusSkeletonLoader } from "@/components/ui/loader/VersusSkeletonLoader";

interface Props {
  params: {
    albumId: string;
  };
}

export default function Home({ params }: Props) {
  const {
    data: results,
    isLoading,
    isError,
  } = useQuery<AlbumResponse>({
    queryKey: ["album", params.albumId],
    queryFn: async () => {
      const res = await getAlbum(params.albumId);
      return res;
    },
  });

  console.log("Album from spotify", results);

  const data: Song[] | undefined = useMemo(
    () =>
      results?.tracks.items.map((track, index) => {
        return {
          id: index + 1,
          title: track.name,
          image: results.images[0],
        };
      }),
    [results?.tracks.items.length]
  );

  if (isLoading || !results) return <VersusSkeletonLoader />;

  if (isError) return <div>An error occured</div>;

  return (
    <SongRanker
      songs={data ?? []}
      albumCover={results.images[0].url}
      albumName={results.name}
      albumArtist={results.artists[0].name}
    />
  );
}
