"use client";

import { useState } from "react";

export default function NewExperimentPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;              // ⬅️ capture reference right away
    const formData = new FormData(form);

    const payload = {
      title: String(formData.get("title") || "").trim(),
      summary: String(formData.get("summary") || "").trim(),
      what_tried: String(formData.get("what_tried") || "").trim(),
      what_went_wrong: String(formData.get("what_went_wrong") || "").trim(),
      what_learned: String(formData.get("what_learned") || "").trim(),
      tags: String(formData.get("tags") || "").trim(),
      author_name: String(formData.get("author_name") || "").trim()
    };

    try {
      const res = await fetch("/api/experiments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed with ${res.status}`);
      }

      setStatus("success");
      form.reset();                            // ⬅️ use saved reference, not e.currentTarget
    } catch (err: unknown) {
      console.error(err);
      setStatus("error");

      if (err instanceof Error) {
        setErrorMessage(err.message || "Something went wrong");
      } else {
        setErrorMessage("Something went wrong");
      }
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Share a failed experiment
      </h1>
      <p className="text-sm text-gray-300 mb-6">
        Fill this out like you&apos;re telling a friend what you tried,
        what went sideways, and what you learned.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1" htmlFor="title">
            Title *
          </label>
          <input
            id="title"
            name="title"
            required
            className="w-full rounded-md border border-gray-700 bg-black px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="summary">
            One-line summary *
          </label>
          <input
            id="summary"
            name="summary"
            required
            className="w-full rounded-md border border-gray-700 bg-black px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="what_tried">
            What did you try? *
          </label>
          <textarea
            id="what_tried"
            name="what_tried"
            rows={4}
            required
            className="w-full rounded-md border border-gray-700 bg-black px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="what_went_wrong">
            What went wrong? *
          </label>
          <textarea
            id="what_went_wrong"
            name="what_went_wrong"
            rows={4}
            required
            className="w-full rounded-md border border-gray-700 bg-black px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="what_learned">
            What did you learn? *
          </label>
          <textarea
            id="what_learned"
            name="what_learned"
            rows={4}
            required
            className="w-full rounded-md border border-gray-700 bg-black px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="tags">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            name="tags"
            placeholder="ml, hardware, startup"
            className="w-full rounded-md border border-gray-700 bg-black px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="author_name">
            Your name / handle (optional)
          </label>
          <input
            id="author_name"
            name="author_name"
            className="w-full rounded-md border border-gray-700 bg-black px-2 py-1"
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-4 py-2 rounded-md bg-white text-black font-medium disabled:opacity-60"
        >
          {status === "submitting" ? "Submitting…" : "Submit experiment"}
        </button>

        {status === "success" && (
          <p className="text-green-400 mt-2">
            Thanks! Your failed experiment has been recorded.
          </p>
        )}
        {status === "error" && (
          <p className="text-red-400 mt-2">
            Something went wrong: {errorMessage}
          </p>
        )}
      </form>
    </main>
  );
}
