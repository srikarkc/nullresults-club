import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

type ExperimentInput = {
  title: string;
  summary: string;
  what_tried: string;
  what_went_wrong: string;
  what_learned: string;
  tags?: string;
  author_name?: string;
};

type ExperimentListItem = {
  id: number;
  title: string;
  summary: string;
  tags: string | null;
  author_name: string | null;
  created_at: string;
};

// --- Helper to get the D1 DB binding ---
function getDb() {
  const { env } = getRequestContext();

  // Cloudflare injects the D1 binding at runtime as env.DB,
  // but the generated CloudflareEnv type doesn’t know about it.
  // @ts-expect-error - DB is provided by Cloudflare as a D1 binding
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = env.DB as any;

  return db;
}

export async function POST(request: Request) {
  const db = getDb();

  if (!db) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 500 }
    );
  }

  let data: ExperimentInput;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const {
    title,
    summary,
    what_tried,
    what_went_wrong,
    what_learned,
    tags,
    author_name
  } = data;

  if (!title || !summary || !what_tried || !what_went_wrong || !what_learned) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const stmt = db
    .prepare(
      `INSERT INTO experiments
       (title, summary, what_tried, what_went_wrong, what_learned, tags, author_name)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      title,
      summary,
      what_tried,
      what_went_wrong,
      what_learned,
      tags ?? null,
      author_name ?? null
    );

  const result = await stmt.run();

  return NextResponse.json(
    { id: result.lastInsertRowid },
    { status: 201 }
  );
}

export async function GET() {
  const db = getDb();

  if (!db) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 500 }
    );
  }

  const stmt = db.prepare(
    `SELECT id, title, summary, tags, author_name, created_at
     FROM experiments
     ORDER BY datetime(created_at) DESC
     LIMIT 20`
  );

  const result = await stmt.all();
  const experiments = (result.results ?? []) as ExperimentListItem[];

  return NextResponse.json(
    { experiments },
    { status: 200 }
  );
}
