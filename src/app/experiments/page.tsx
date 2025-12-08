"use client";

import { useEffect, useState } from "react";

type ExperimentListItem = {
  id: number;
  title: string;
  summary: string;
  tags: string | null;
  author_name: string | null;
  created_at: string;
};

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<ExperimentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/experiments");

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data: unknown = await res.json();

        if (!data || typeof data !== "object" || !("experiments" in data)) {
          throw new Error("Malformed response from server");
        }

        const experimentsData = (data as { experiments: ExperimentListItem[] })
          .experiments;

        setExperiments(experimentsData ?? []);
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
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Recently failed experiments
      </h1>
      <p className="text-sm text-gray-300 mb-6">
        A rolling log of things people tried that didn&apos;t quite work out —
        and what they learned along the way.
      </p>

      {loading && (
        <p className="text-sm text-gray-400">Loading glorious failures…</p>
      )}

      {error && (
        <p className="text-sm text-red-400 mb-4">
          {error}
        </p>
      )}

      {!loading && !error && experiments.length === 0 && (
        <p className="text-sm text-gray-400">
          No experiments yet. Be the first to add one on the{" "}
          <a
            href="/experiments/new"
            className="underline underline-offset-2 text-gray-100"
          >
            submit page
          </a>
          .
        </p>
      )}

      <div className="space-y-4">
        {experiments.map((exp) => {
          const tags = exp.tags
            ? exp.tags
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t.length > 0)
            : [];

          const author = exp.author_name && exp.author_name.trim().length > 0
            ? exp.author_name
            : "Anonymous";

          return (
            <article
              key={exp.id}
              className="border border-gray-800 rounded-lg p-4 bg-black/40"
            >
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <h2 className="text-lg font-semibold">
                  <a href={`/experiments/${exp.id}`} className="hover:underline underline-offset-4">{exp.title}</a>
                </h2>
                <span className="text-[0.7rem] text-gray-500 whitespace-nowrap">
                  {exp.created_at}
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-2">
                by <span className="font-medium text-gray-200">{author}</span>
              </p>

              <p className="text-sm text-gray-200 mb-3">
                {exp.summary}
              </p>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.7rem] px-2 py-1 rounded-full border border-gray-700 text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}
