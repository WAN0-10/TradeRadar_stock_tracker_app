import Link from "next/link";
import { formatTimeAgo } from "@/lib/utils";

export function WatchlistNews({ news = [] }: WatchlistNewsProps) {
  if (news.length === 0) {
    return (
      <div className="watchlist-news">
        <p className="text-gray-500 text-center py-8 col-span-full">
          No news available for your watchlist stocks right now.
        </p>
      </div>
    );
  }

  return (
    <div className="watchlist-news">
      {news.map((article) => (
        <article key={article.id} className="news-item">
          {article.related && (
            <span className="news-tag">{article.related}</span>
          )}
          <h3 className="news-title">{article.headline}</h3>
          <p className="news-meta">
            {article.source} • {formatTimeAgo(article.datetime)}
          </p>
          <p className="news-summary">{article.summary}</p>
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="news-cta"
          >
            Read More →
          </Link>
        </article>
      ))}
    </div>
  );
}
