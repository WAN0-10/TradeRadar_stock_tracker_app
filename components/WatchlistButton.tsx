"use client";

import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  symbol: string;
  company: string;
  isInWatchlist: boolean;
};

// Server action lives in the same file so we don't depend on missing watchlist actions.
async function getCurrentUserId(): Promise<string | null> {
  try {
    const res = await fetch("/api/me", { method: "GET" });
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string | null };
    return data.id ? String(data.id) : null;
  } catch {
    return null;
  }
}

async function toggleWatchlistServer(args: {
  userId: string;
  symbol: string;
  company: string;
  nextInWatchlist: boolean;
}) {
  // This endpoint is implemented inline below.
  const res = await fetch("/api/watchlist/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to update watchlist");
  }
}

export default function WatchlistButton({
  symbol,
  company,
  isInWatchlist,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const userId = await getCurrentUserId();
      if (!userId) {
        toast.error("Sign in to manage your watchlist.");
        window.location.href = "/sign-in";
        return;
      }

      try {
        await toggleWatchlistServer({
          userId,
          symbol,
          company,
          nextInWatchlist: !isInWatchlist,
        });
        toast.success(
          isInWatchlist ? "Removed from watchlist" : "Added to watchlist",
        );
        // Simple refresh to re-fetch watchlist status from server.
        window.location.reload();
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Unable to update watchlist";
        toast.error(message);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
        isInWatchlist
          ? "border-yellow-500/60 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/15"
          : "border-gray-700 bg-transparent text-gray-100 hover:bg-gray-800/60"
      } disabled:opacity-60`}
      aria-pressed={isInWatchlist}
    >
      <span
        aria-hidden
        className="inline-flex h-5 w-5 items-center justify-center"
      >
        ★
      </span>
      {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
    </button>
  );
}
