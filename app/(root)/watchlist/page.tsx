import Link from "next/link";
import { auth } from "@/lib/better-auth/auth";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { headers } from "next/headers";



export default async function WatchlistPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email;
  const symbols = await getWatchlistSymbolsByEmail(email || "");

  return (
    <div className="flex min-h-[50vh] flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-100">Watchlist</h1>
        <p className="mt-2 text-sm text-gray-400">
          {symbols.length === 0
            ? "Your watchlist is empty. Add stocks from a stock details page."
            : `You have ${symbols.length} symbol${symbols.length === 1 ? "" : "s"} in your watchlist.`}
        </p>
      </div>

      {symbols.length === 0 ? (
        <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-6 text-sm text-gray-300">
          No watchlist items yet.
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {symbols.map((symbol) => (
            <li
              key={symbol}
              className="rounded-lg border border-gray-800 bg-gray-900/30 p-4"
            >
              <Link
                href={`/stocks/${encodeURIComponent(symbol)}`}
                className="text-gray-100 hover:text-yellow-500"
              >
                {symbol}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
