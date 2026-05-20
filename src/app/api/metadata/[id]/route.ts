import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { tokenMetadata } from "../../../../../db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const [row] = await db.select().from(tokenMetadata).where(eq(tokenMetadata.id, params.id)).limit(1);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row.metadataJson, { headers: { "Cache-Control": "public, max-age=31536000, immutable", "Content-Type": "application/json" } });
  } catch { return NextResponse.json({ error: "Internal error" }, { status: 500 }); }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const db = getDb();
    const updates: Record<string, any> = {};
    if (body.mintAddress) updates.mintAddress = body.mintAddress;
    if (body.poolId) updates.poolId = body.poolId;
    if (body.mintAddress || body.poolId) updates.launchedAt = new Date();
    await db.update(tokenMetadata).set(updates).where(eq(tokenMetadata.id, params.id));
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Internal error" }, { status: 500 }); }
}
