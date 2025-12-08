import { NextResponse } from "next/server";

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

export async function POST(
  request: Request,
  context: { env: any }
) {
  const { env } = context;

  // Simple safety check: if DB binding is missing
  if (!env || !env.DB) {
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

  const stmt = env.DB.prepare(
    `INSERT INTO experiments
     (title, summary, what_tried, what_went_wrong, what_learned, tags, author_name)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
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
