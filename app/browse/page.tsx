
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const titles = [
  { name: "Stranger Things", genre: "Sci-Fi", year: "2025", image: "photo-1518709268805-4e9042af9f23" },
  { name: "The Dark World", genre: "Thriller", year: "2024", image: "photo-1519608487953-e999c86e7455" },
  { name: "Into the Wild", genre: "Adventure", year: "2025", image: "photo-1470770841072-f978cf4d019e" },
  { name: "Lost Horizon", genre: "Adventure", year: "2023", image: "photo-1500530855697-b586d89ba3ee" },
  { name: "Nightfall", genre: "Thriller", year: "2025", image: "photo-1511497584788-876760111969" },
  { name: "The Unknown", genre: "Sci-Fi", year: "2026", image: "photo-1462331940025-496dfbfc7564" },
  { name: "The Journey", genre: "Drama", year: "2024", image: "photo-1470252649378-9c29740c9fa8" },
  { name: "Deep Space", genre: "Sci-Fi", year: "2026", image: "photo-1446776811953-b23d57bd21aa" },
  { name: "Shadow Valley", genre: "Thriller", year: "2023", image: "photo-1519681393784-d120267933ba" },
  { name: "Wild Earth", genre: "Adventure", year: "2025", image: "photo-1464822759023-fed622ff2c3b" },
  { name: "Blue Horizon", genre: "Drama", year: "2024", image: "photo-1500534623283-312aade485b7" },
  { name: "Cosmic", genre: "Sci-Fi", year: "2026", image: "photo-1462331940025-496dfbfc7564" },
];

const genres = ["All", "Sci-Fi", "Thriller", "Adventure", "Drama"];

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");

  const filtered = useMemo(
    () =>
      titles.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) &&
          (genre === "All" || item.genre === genre)
      ),
    [search, genre]
  );

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-5 md:px-14">
        <Link href="/" className="text-3xl font-black tracking-tighter text-red-600">
          NETFLIX
        </Link>
        <nav className="flex items-center gap-4 text-sm text-gray-300 md:gap-6">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/browse" className="font-bold text-white">Browse</Link>
        </nav>
        <div className="flex h-9 w-9 items-center justify-center rounded bg-red-700 font-bold">
          Q
        </div>
      </header>

      <section
        className="relative flex min-h-[330px] items-end bg-cover bg-center px-5 py-10 md:min-h-[420px] md:px-14"
        style={{
          backgroundImage:
            "linear-gradient(0deg, #080808 0%, rgba(8,8,8,.2) 100%), linear-gradient(90deg, rgba(8,8,8,.7), transparent), url('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        <div className="relative">
          <p className="mb-3 text-xs font-bold tracking-[.3em] text-red-500">
            YOUR NEXT OBSESSION
          </p>
          <h1 className="mb-3 text-4xl font-black md:text-6xl">Explore Movies</h1>
          <p className="max-w-xl text-sm leading-6 text-gray-300 md:text-base">
            Discover thrilling adventures, unforgettable stories, and worlds
            beyond imagination. Find your next favorite.
          </p>
        </div>
      </section>

      <section className="px-5 pb-16 md:px-14">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold">Discover titles</h2>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
            aria-label="Search movies"
            className="w-full rounded border border-white/20 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-red-500 md:max-w-xs"
          />
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {genres.map((item) => (
            <button
              key={item}
              onClick={() => setGenre(item)}
              className={`rounded-full border px-5 py-2 text-sm transition ${
                genre === item
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-white/20 bg-zinc-900 text-gray-300 hover:border-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mb-5 text-sm text-gray-400">
          {filtered.length} titles found
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((movie) => (
              <article
                key={movie.name}
                className="group overflow-hidden rounded-lg bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:bg-zinc-800"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={`https://images.unsplash.com/${movie.image}?auto=format&fit=crop&w=600&q=80`}
                    alt={movie.name}
                    width={600}
                    height={400}
                    unoptimized
                    className="h-40 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-48 md:h-52"
                  />
                  <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-1 text-[10px] font-bold">
                    NETFLIX
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="truncate font-bold">{movie.name}</h3>
                  <p className="mt-2 text-xs text-gray-400">
                    {movie.year} · {movie.genre}
                  </p>
                  <button
                    onClick={() => alert(`${movie.name} — demo title`)}
                    className="mt-3 w-full rounded bg-white py-2 text-sm font-bold text-black transition hover:bg-gray-300"
                  >
                    ▶ Preview
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 py-16 text-center">
            <p className="text-xl font-bold">No titles found</p>
            <p className="mt-2 text-sm text-gray-400">
              Try another search or choose a different genre.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setGenre("All");
              }}
              className="mt-5 rounded bg-red-600 px-5 py-2 font-bold hover:bg-red-700"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-sm text-gray-500 md:px-14">
        Educational Netflix-inspired UI demo. Movie titles and imagery are illustrative.
      </footer>
    </main>
  );
}
