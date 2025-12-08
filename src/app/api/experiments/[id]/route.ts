import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

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

function getDb() {
  const { env } = getRequestContext();

  // Cloudflare injects the D1 binding at runtime as env.DB,
  // but the CloudflareEnv type doesn’t know about it.
  // @ts-expect-error - DB is provided by Cloudflare as a D1 binding
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = env.DB as any;

  return db;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const db = getDb();

  if (!db) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 500 }
    );
  }

  const numericId = Number(params.id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return NextResponse.json(
      { error: "Invalid experiment id" },
      { status: 400 }
    );
  }

  const stmt = db.prepare(
    `SELECT id, title, summary, what_tried, what_went_wrong, what_learned,
            tags, author_name, created_at
     FROM experiments
     WHERE id = ?
     LIMIT 1`
  ).bind(numericId);

  const result = await stmt.all();
  const rows = (result.results ?? []) as Experiment[];

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Experiment not found" },
      { status: 404 }
    );
  }

  const experiment = rows[0];

  return NextResponse.json(
    { experiment },
    { status: 200 }
  );
}
