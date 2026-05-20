import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { tokenMetadata } from "../../../../db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, symbol, description, imageUrl, telegram, website, twitter, discord, creatorWallet, supply, decimals, solToRaise, migrateType } = body;
    if (!name || !symbol) return NextResponse.json({ error: "name and symbol required" }, { status: 400 });
    const metadataJson = { name, symbol, description: description || "", image: imageUrl || "", external_url: website || "", properties: { links: { ...(twitter && { twitter }), ...(telegram && { telegram }), ...(discord && { discord }), ...(website && { website }) } } };
    const db = getDb();
    const [row] = await db.insert(tokenMetadata).values({ name, symbol, description, image: imageUrl, telegram, website, twitter, discord, creatorWallet, supply, decimals, solToRaise, migrateType, metadataJson }).returning({ id: tokenMetadata.id });
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    return NextResponse.json({ id: row.id, uri: `${protocol}://${host}/api/metadata/${row.id}` });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed: " + error.message }, { status: 500 });
  }
}
