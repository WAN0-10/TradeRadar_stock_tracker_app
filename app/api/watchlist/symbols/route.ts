import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user?.email) {
    return Response.json({ symbols: [] }, { status: 200 });
  }

  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) {
    return Response.json({ symbols: [] }, { status: 200 });
  }

  const userDoc = await db.collection("user").findOne<{
    _id: unknown;
    id?: string;
    email?: string;
  }>({ email: user.email });

  if (!userDoc) {
    return Response.json({ symbols: [] }, { status: 200 });
  }

  const userId = (userDoc.id as string) || String(userDoc._id || "");
  if (!userId) {
    return Response.json({ symbols: [] }, { status: 200 });
  }

  const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
  const symbols = items.map((i) => String(i.symbol));

  return Response.json({ symbols }, { status: 200 });
}
