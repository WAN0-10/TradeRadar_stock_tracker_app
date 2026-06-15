import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

import { auth } from "@/lib/better-auth/auth";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import Trading_view_widget from "@/components/trading_view_widget";
import WatchlistButton from "@/components/WatchlistButton";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  const session = await auth.api.getSession({
    headers: await (await import("next/headers")).headers(),
  });
  const email = session?.user?.email;
  const watchSymbols = await getWatchlistSymbolsByEmail(email || "");
  const upperSymbol = symbol.toUpperCase();

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <Trading_view_widget
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={170}
          />

          <Trading_view_widget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />

          <Trading_view_widget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <WatchlistButton
              symbol={upperSymbol}
              company={upperSymbol}
              isInWatchlist={watchSymbols.includes(upperSymbol)}
            />
          </div>

          <Trading_view_widget
            scriptUrl={`${scriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
            height={400}
          />

          <Trading_view_widget
            scriptUrl={`${scriptUrl}company-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
            height={440}
          />

          <Trading_view_widget
            scriptUrl={`${scriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
            height={464}
          />
        </div>
      </section>
    </div>
  );
}
