"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/useDebounce";

import { searchFromApi } from "./api/search/methods";

import Link from "next/link";

import { motion } from "framer-motion";

import { Album } from "./lib/types";

import { ModeToggle } from "@/components/theme-toggle-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { AlbumCard } from "@/components/ui/albumCard";
import { AlbumCardSkeleton } from "@/components/ui/loader/AlbumCardSkeleton";
import FooterCopyrights from "@/components/footercopyrights";
import HeroSectionImage from "@/components/heroSectionImage";
import Image from "next/image";

export default function Home() {
  const [artist, setArtist] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const debouncedQuery = useDebounce([artist, album], 500);

  const {
    data: results,
    isLoading,
    isError,
  } = useQuery<Album[] | undefined>({
    queryKey: ["albums", ...debouncedQuery],
    queryFn: () => searchFromApi(`${debouncedQuery[0]} ${debouncedQuery[1]}`),
    enabled: Boolean(debouncedQuery[0]) || Boolean(debouncedQuery[1]),
  });

  return (
    <AuroraBackground>
      <div className="z-50 absolute top-4 left-4 sm:top-10 sm:right-10 sm:left-auto">
        <ModeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative w-full min-h-screen flex flex-col gap-4 items-center justify-start py-16 px-4"
      >
        <Image
          src="/android-chrome-512x512.png"
          alt="Song Choicer Logo"
          width={512}
          height={512}
          className="absolute top-4 right-4 sm:top-10 sm:left-10 w-10 border border-black border-opacity-10 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] rounded-sm dark:border-white dark:border-opacity-10 dark:drop-shadow-[0_1px_4px_rgba(255,255,255,0.1)]"
        />
        <h1 className="text-3xl md:text-7xl font-bold dark:text-white text-center mb-2">
          Welcome to Song Choicer!
        </h1>
        <p className="text-md md:text-lg text-center dark:text-white">
          Make a ranking of songs of an album easily and share it !
        </p>
        <form className="w-full flex flex-col gap-8 md:py-4 md:px-[30%] md:w-full">
          <div className="text-primary flex flex-col justify-center items-start gap-2">
            <Label htmlFor="artist">Artist</Label>
            <Input
              id="artist"
              placeholder="Taylor Swift, Drake, etc..."
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </div>
          <div className="text-primary flex flex-col justify-center items-start gap-2">
            <Label htmlFor="album">Album</Label>
            <Input
              id="album"
              placeholder="Lover, Scorpion, etc..."
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
            />
          </div>
        </form>
        {isLoading && (
          <div className="w-full flex flex-wrap justify-center items-center gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <AlbumCardSkeleton key={index} />
            ))}
          </div>
        )}
        {isError && (
          <p className="text-red-600 font-bold">
            No album found. Please check if the artist name or album title is
            correct.
          </p>
        )}
        {!isLoading && !results && <HeroSectionImage />}
        <ul className="w-full flex flex-wrap justify-center items-center gap-6">
          {results &&
            results.map((result) => (
              <li key={result.id}>
                <Link href={`/versus/${result.id}`}>
                  <AlbumCard result={result} />
                </Link>
              </li>
            ))}
        </ul>
        <FooterCopyrights />
      </motion.div>
    </AuroraBackground>
  );
}
