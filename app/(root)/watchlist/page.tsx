import { Star } from "lucide-react";
import { getNews, searchStocks } from "@/lib/actions/finnhub.actions";
import { getWatchlistWithData } from "@/lib/actions/watchlist.actions";
import { AlertsList } from "@/components/alertsList";
import SearchCommand from "@/components/search_command";
import { WatchlistTable } from "@/components/watchlistTable";
import { WatchlistNews } from "@/components/watchlistNews";

const Watchlist = async () => {
  const watchlist = await getWatchlistWithData();
  const initialStocks = await searchStocks();
  const symbols = watchlist.map((item) => item.symbol);
  const news = symbols.length > 0 ? await getNews(symbols) : [];

  if (watchlist.length === 0) {
    return (
      <section className="flex watchlist-empty-container">
        <div className="watchlist-empty">
          <Star className="watchlist-star" />
          <h2 className="empty-title">Your watchlist is empty</h2>
          <p className="empty-description">
            Start building your watchlist by searching for stocks and clicking
            the star icon to add them.
          </p>
        </div>
        <SearchCommand initialStocks={initialStocks} label="Add Stock" />
      </section>
    );
  }

  return (
    <section className="watchlist-container">
      <div className="watchlist">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="watchlist-title">Watchlist</h2>
            <SearchCommand initialStocks={initialStocks} label="Add Stock" />
          </div>
          <WatchlistTable watchlist={watchlist} />
        </div>
      </div>

      <AlertsList alertData={[]} />

      <div className="lg:col-span-3 space-y-4">
        <h2 className="watchlist-title">Latest News</h2>
        <WatchlistNews news={news} />
      </div>
    </section>
  );
};

export default Watchlist;
