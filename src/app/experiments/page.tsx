"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ExperimentListItem = {
  id: number;
  title: string;
  summary: string;
  tags: string | null;
  author_name: string | null;
  created_at: string;
};

function formatDate(input: string): string {
  const normalized = input.includes("T") ? input : input.replace(" ", "T") + "Z";
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<ExperimentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/experiments", { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data: unknown = await res.json();

        if (!data || typeof data !== "object" || !("experiments" in data)) {
          throw new Error("Malformed response from server");
        }

        const { experiments } = data as { experiments: ExperimentListItem[] };
        setExperiments(Array.isArray(experiments) ? experiments : []);
      } catch (err: unknown) {
        console.error(err);
        setError("Could not load experiments. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Experiments</h1>

        <Link
          href="/experiments/new"
          className="text-xs px-3 py-2 rounded-md border border-gray-700 text-gray-200 hover:bg-gray-900"
        >
          + Submit experiment
        </Link>
      </div>

      <p className="mt-2 text-sm text-gray-400">
        A lovingly curated museum of “well… that didn’t work.”
      </p>

      {loading && (
        <p className="mt-6 text-sm text-gray-400">Loading experiments…</p>
      )}

      {error && !loading && (
        <p className="mt-6 text-sm text-red-400">{error}</p>
      )}

      {!loading && !error && experiments.length === 0 && (
        <div className="mt-6 rounded-lg border border-gray-800 p-4">
          <p className="text-sm text-gray-300">
            No experiments yet. Be the first brave soul.
          </p>
          <Link
            href="/experiments/new"
            className="inline-block mt-3 text-xs text-gray-200 underline underline-offset-4 hover:text-white"
          >
            Submit one →
          </Link>
        </div>
      )}

      {!loading && !error && experiments.length > 0 && (
        <ul className="mt-6 space-y-3">
          {experiments.map((exp) => (
            <li
              key={exp.id}
              className="rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/experiments/${exp.id}`}
                    className="text-base font-semibold text-gray-100 hover:underline underline-offset-4"
                  >
                    {exp.title}
                  </Link>

                  <div className="mt-1 text-xs text-gray-500">
                    {formatDate(exp.created_at)} •{" "}
                    <span className="text-gray-300">
                      {exp.author_name?.trim() || "Anonymous"}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/experiments/${exp.id}`}
                  className="text-xs text-gray-400 hover:text-gray-200 underline underline-offset-4 shrink-0"
                >
                  Read →
                </Link>
              </div>

              <p className="mt-3 text-sm text-gray-200">{exp.summary}</p>

              {exp.tags && exp.tags.trim().length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t.length > 0)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.7rem] px-2 py-1 rounded-full border border-gray-700 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
