export default function NewExperimentPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Share a failed experiment
      </h1>
      <p className="text-sm text-gray-300 mb-6">
        Fill this out like you&apos;re telling a friend what you tried,
        what went sideways, and what you learned.
        <br />
        (Right now this form doesn&apos;t save anything yet — that&apos;s
        coming in the next phase.)
      </p>

      <form className="space-y-4 text-sm">
        <div>
          <label className="block mb-1" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            className="w-full rounded-md border border-gray-700 bg-black px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="summary">
            One-line summary
          </label>
          <input
            id="summary"
            name="summary"
            className="w-full rounded-md border border-gray-700 bg-black px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="what_tried">
            What did you try?
          </label>
          <textarea
            id="what_tried"
            name="what_tried"
            rows={4}
            className="w-full rounded-md border border-gray-700 bg-black px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="what_went_wrong">
            What went wrong?
          </label>
          <textarea
            id="what_went_wrong"
            name="what_went_wrong"
            rows={4}
            className="w-full rounded-md border border-gray-700 bg-black px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="what_learned">
            What did you learn?
          </label>
          <textarea
            id="what_learned"
            name="what_learned"
            rows={4}
            className="w-full rounded-md border border-gray-700 bg-black px-2 py-1"
          />
        </div>

        <button
          type="button"
          className="px-4 py-2 rounded-md bg-white text-black font-medium"
        >
          Submit (not wired yet)
        </button>
      </form>
    </main>
  );
}
