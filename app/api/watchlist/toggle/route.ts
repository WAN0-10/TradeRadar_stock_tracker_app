import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      userId: string;
      symbol: string;
      company: string;
      nextInWatchlist: boolean;
    };

    const userId = body.userId;
    const symbol = String(body.symbol || "")
      .toUpperCase()
      .trim();
    const company = String(body.company || "").trim();
    const nextInWatchlist = Boolean(body.nextInWatchlist);

    if (!userId || !symbol || !company) {
      return NextResponse.json(
        { error: "Missing userId/symbol/company" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    if (nextInWatchlist) {
      await Watchlist.updateOne(
        { userId, symbol },
        {
          $setOnInsert: {
            userId,
            symbol,
            company,
          },
        },
        { upsert: true },
      );
    } else {
      await Watchlist.deleteOne({ userId, symbol });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update watchlist" },
      { status: 500 },
    );
  }
}
