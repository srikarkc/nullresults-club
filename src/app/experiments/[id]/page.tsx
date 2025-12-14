"use client";

export const runtime = "edge";

import Link from "next/link";
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
  // Cloudflare/next-on-pages + Next 15: params is a Promise in the generated types
  params: Promise<{
    id: string;
  }>;
};

export default function ExperimentDetailPage({ params }: PageProps) {
  const [id, setId] = useState<string | null>(null);

  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap params once
  useEffect(() => {
    let mounted = true;

    params
      .then((p) => {
        if (!mounted) return;
        if (!p?.id || typeof p.id !== "string") {
          setError("Invalid route params.");
          setLoading(false);
          return;
        }
        setId(p.id);
      })
      .catch((e) => {
        console.error(e);
        if (!mounted) return;
        setError("Invalid route params.");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [params]);

  // Fetch experiment only after we have the id
  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setExperiment(null);

      try {
        const res = await fetch(`/api/experiments/${id}`);

        if (res.status === 404) {
          if (!cancelled) setError("Experiment not found.");
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
        if (!cancelled) setExperiment(experiment);
      } catch (err: unknown) {
        console.error(err);
        if (!cancelled) setError("Could not load experiment. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const tags = useMemo(() => {
    if (!experiment?.tags) return [];
    return experiment.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }, [experiment?.tags]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/experiments"
        className="text-xs text-gray-400 hover:text-gray-200 underline underline-offset-4"
      >
        ← Back to all experiments
      </Link>

      {loading && (
        <p className="mt-6 text-sm text-gray-400">
          Loading detailed failure report…
        </p>
      )}

      {error && !loading && <p className="mt-6 text-sm text-red-400">{error}</p>}

      {!loading && !error && experiment && (
        <article className="mt-6">
          <h1 className="text-2xl font-semibold mb-2">{experiment.title}</h1>

          <p className="text-xs text-gray-500 mb-1">{experiment.created_at}</p>

          <p className="text-xs text-gray-400 mb-4">
            by{" "}
            <span className="font-medium text-gray-200">
              {experiment.author_name?.trim() || "Anonymous"}
            </span>
          </p>

          <p className="text-sm text-gray-200 mb-6">{experiment.summary}</p>

          <section className="space-y-4 text-sm text-gray-200">
            <div>
              <h2 className="font-semibold mb-1 text-gray-100">
                What did they try?
              </h2>
              <p className="whitespace-pre-wrap text-gray-200">
                {experiment.what_tried}
              </p>
            </div>

            <div>
              <h2 className="font-semibold mb-1 text-gray-100">
                What went wrong?
              </h2>
              <p className="whitespace-pre-wrap text-gray-200">
                {experiment.what_went_wrong}
              </p>
            </div>

            <div>
              <h2 className="font-semibold mb-1 text-gray-100">
                What did they learn?
              </h2>
              <p className="whitespace-pre-wrap text-gray-200">
                {experiment.what_learned}
              </p>
            </div>
          </section>

          {tags.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold mb-2 text-gray-100">Tags</h2>
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
