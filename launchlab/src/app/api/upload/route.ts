import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });
    const ext = file.name.split(".").pop() || "png";
    const key = `token-images/${uuidv4()}.${ext}`;
    const store = getStore("token-assets");
    const buffer = Buffer.from(await file.arrayBuffer());
    await store.set(key, buffer, { metadata: { contentType: file.type, originalName: file.name } });
    return NextResponse.json({ url: `/api/upload/${key}`, key });
  } catch (error: any) {
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
  }
}
