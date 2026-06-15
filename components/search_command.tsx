"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "./hooks/useDebounce";

export default function SearchCommand({
  renderAs = "button",
  label = "Add stock",
  initialStocks,
}: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] =
    useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSearch = useCallback(async () => {
    const term = searchTerm.trim();

    if (!term) {
      setLoading(false);
      setStocks(initialStocks);
      return;
    }

    setLoading(true);
    try {
      const results = await searchStocks(term);
      setStocks(results);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, initialStocks]);

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm, debouncedSearch]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  };

  return (
    <>
      {renderAs === "text" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="search-text"
        >
          {label}
        </button>
      ) : (
        <Button onClick={() => setOpen(true)} className="search-btn">
          {label}
        </Button>
      )}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="search-dialog"
      >
        <Command>
          <div className="search-field">
            <CommandInput
              value={searchTerm}
              onValueChange={setSearchTerm}
              placeholder="Search stocks..."
              className="search-input"
            />

            {!!searchTerm.trim() && (
              <button
                type="button"
                aria-label="Clear search"
                className="search-clear-btn"
                onClick={() => {
                  setSearchTerm("");
                  setStocks(initialStocks);
                  setOpen(false);
                }}
              >
                ×
              </button>
            )}

            {loading && <Loader2 className="search-loader" />}
          </div>
          <CommandList className="search-list">
            {loading ? (
              <CommandEmpty className="search-list-empty">
                Loading stocks...
              </CommandEmpty>
            ) : displayStocks?.length === 0 ? (
              <div className="search-list-indicator">
                {isSearchMode ? "No results found" : "No stocks available"}
              </div>
            ) : (
              <ul>
                <div className="search-count">
                  {isSearchMode ? "Search results" : "Popular stocks"}(
                  {displayStocks?.length || 0})
                </div>
                {displayStocks?.map((stock) => (
                  <li key={stock.symbol} className="search-item">
                    <Link
                      href={`/stocks/${stock.symbol}`}
                      onClick={handleSelectStock}
                      className="search-item-link"
                    >
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <div className="search-item-name">{stock.name}</div>
                        <div className="text-sm text-gray-500">
                          {stock.symbol} | {stock.exchange} | {stock.type}
                        </div>
                      </div>
                      {/*<Star />*/}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
