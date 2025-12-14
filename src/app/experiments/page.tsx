"use client";

import { useEffect, useMemo, useState } from "react";

type Experiment = {
  id: number;
  title: string;
  summary: string;
  what_tried: string;
  what_went_wrong: string;
  what_learned: string;
  tags: string | null;
  author_name: string | null;
  created_at: string;
};

type PageProps = {
  params: {
    id: string;
  };
};

function formatDate(input: string): string {
  // D1 default created_at often looks like "2025-12-08 06:18:48"
  // Turn it into something nicer; if parsing fails, fall back to raw.
  const normalized = input.includes("T") ? input : input.replace(" ", "T") + "Z";
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function ExperimentDetailPage({ params }: PageProps) {
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const id = params.id;

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      setExperiment(null);

      try {
        const res = await fetch(`/api/experiments/${id}`);

        if (res.status === 404) {
          setError("Experiment not found.");
          return;
        }

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data: unknown = await res.json();

        if (!data || typeof data !== "object" || !("experiment" in data)) {
          throw new Error("Malformed response from server");
        }

        const { experiment } = data as { experiment: Experiment };
        setExperiment(experiment);
      } catch (err: unknown) {
        console.error(err);
        setError("Could not load experiment. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [id]);

  const tags = useMemo(() => {
    if (!experiment?.tags) return [];
    return experiment.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }, [experiment]);

  const author = useMemo(() => {
    const a = experiment?.author_name?.trim();
    return a && a.length > 0 ? a : "Anonymous";
  }, [experiment]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Ignore (some browsers block clipboard without https/user gesture).
      setCopied(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <a
          href="/experiments"
          className="text-xs text-gray-400 hover:text-gray-200 underline underline-offset-4"
        >
          ← Back
        </a>

        <button
          type="button"
          onClick={copyLink}
          className="text-xs border border-gray-800 rounded-md px-3 py-1 text-gray-200 hover:border-gray-700"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>

      {loading && (
        <div className="mt-8">
          <p className="text-sm text-gray-400">Loading detailed failure report…</p>
        </div>
      )}

      {error && !loading && (
        <div className="mt-8 border border-red-900/40 bg-red-950/20 rounded-lg p-4">
          <p className="text-sm text-red-300">{error}</p>
          <p className="text-xs text-gray-400 mt-2">
            Try going back to the{" "}
            <a
              href="/experiments"
              className="underline underline-offset-4 text-gray-200"
            >
              experiments list
            </a>
            .
          </p>
        </div>
      )}

      {!loading && !error && experiment && (
        <article className="mt-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-2">{experiment.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
              <span>{formatDate(experiment.created_at)}</span>
              <span>
                by{" "}
                <span className="text-gray-200 font-medium">{author}</span>
              </span>
              <span className="text-gray-600">id: {experiment.id}</span>
            </div>
          </div>

          <div className="border border-gray-800 rounded-lg p-4 bg-black/40 mb-6">
            <h2 className="text-sm font-semibold text-gray-100 mb-2">
              Summary
            </h2>
            <p className="text-sm text-gray-200 whitespace-pre-wrap">
              {experiment.summary}
            </p>
          </div>

          <div className="grid gap-4">
            <section className="border border-gray-800 rounded-lg p-4 bg-black/40">
              <h2 className="text-sm font-semibold text-gray-100 mb-2">
                What did they try?
              </h2>
              <p className="text-sm text-gray-200 whitespace-pre-wrap">
                {experiment.what_tried}
              </p>
            </section>

            <section className="border border-gray-800 rounded-lg p-4 bg-black/40">
              <h2 className="text-sm font-semibold text-gray-100 mb-2">
                What went wrong?
              </h2>
              <p className="text-sm text-gray-200 whitespace-pre-wrap">
                {experiment.what_went_wrong}
              </p>
            </section>

            <section className="border border-gray-800 rounded-lg p-4 bg-black/40">
              <h2 className="text-sm font-semibold text-gray-100 mb-2">
                What did they learn?
              </h2>
              <p className="text-sm text-gray-200 whitespace-pre-wrap">
                {experiment.what_learned}
              </p>
            </section>
          </div>

          {tags.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-100 mb-2">Tags</h2>
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
            </div>
          )}
        </article>
      )}
    </main>
  );
}
