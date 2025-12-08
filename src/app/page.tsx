export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to nullresults.club!</h1>
        <p className="text-sm text-gray-400">
          A home for all the experiments that didn&apos;t quite work out —
          but still taught you something.
        </p>

        <p className="text-sm text-gray-300">
          Everyone publishes their successes. Here we publish the crashes,
          the flops, the null results, and the &quot;turns out that doesn&apos;t work&quot; moments.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <a
            href="/experiments"
            className="px-4 py-2 rounded-md bg-white text-black text-sm font-medium"
          >
            Browse experiments
          </a>
          <a
            href="/experiments/new"
            className="px-4 py-2 rounded-md border border-gray-500 text-sm"
          >
            Share your failed experiment
          </a>
        </div>
      </div>
    </main>
  );
}
