export default function ExperimentsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Experiments</h1>
      <p className="text-sm text-gray-300 mb-6">
        Soon this will be a list of real failed experiments, sorted by
        most recent. For now, this is just a placeholder page.
      </p>

      <ul className="space-y-3 text-sm text-gray-200">
        <li className="border border-gray-700 rounded-md p-3">
          <h2 className="font-semibold">Tuning a model with 4 samples</h2>
          <p className="text-xs text-gray-400 mt-1">
            Spoiler: it did not generalize.
          </p>
        </li>
        <li className="border border-gray-700 rounded-md p-3">
          <h2 className="font-semibold">Replacing sleep with more coffee</h2>
          <p className="text-xs text-gray-400 mt-1">
            Performance improved for 2 days, then crashed spectacularly.
          </p>
        </li>
      </ul>
    </main>
  );
}
