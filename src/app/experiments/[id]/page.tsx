"use client";

import { useEffect, useState } from "react";

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

export default function ExperimentDetailPage({ params }: PageProps) {
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/experiments/${params.id}`);

        if (res.status === 404) {
          setError("Experiment not found.");
          setLoading(false);
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
  }, [params.id]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <a
        href="/experiments"
        className="text-xs text-gray-400 hover:text-gray-200 underline underline-offset-4"
      >
        ← Back to all experiments
      </a>

      {loading && (
        <p className="mt-6 text-sm text-gray-400">
          Loading detailed failure report…
        </p>
      )}

      {error && !loading && (
        <p className="mt-6 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && experiment && (
        <article className="mt-6">
          <h1 className="text-2xl font-semibold mb-2">
            {experiment.title}
          </h1>

          <p className="text-xs text-gray-500 mb-1">
            {experiment.created_at}
          </p>

          <p className="text-xs text-gray-400 mb-4">
            by{" "}
            <span className="font-medium text-gray-200">
              {experiment.author_name?.trim() || "Anonymous"}
            </span>
          </p>

          <p className="text-sm text-gray-200 mb-6">
            {experiment.summary}
          </p>

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

          {experiment.tags && experiment.tags.trim().length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold mb-2 text-gray-100">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {experiment.tags
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
            </div>
          )}
        </article>
      )}
    </main>
  );
}
