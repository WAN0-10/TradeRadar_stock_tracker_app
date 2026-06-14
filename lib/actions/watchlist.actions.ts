"use server";

import { connectToDatabase } from "@/database/mongoose";
import { auth } from "../better-auth/auth";
import { Watchlist } from "@/database/models/watchlist.model";

export async function getWatchlistSymbolsByEmail(
  email: string,
): Promise<string[]> {
  if (!email) return [];
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Mongodb connection not established");

    const user = await db
      .collection("users")
      .findOne<{ _id: unknown; id?: string; email?: string }>({ email });
    if (!user) return [];

    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (e) {
    console.error("Error getting watchlist symbols:", e);
    return [];
  }
}
