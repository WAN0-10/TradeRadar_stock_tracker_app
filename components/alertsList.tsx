import { Bell } from "lucide-react";
import { getAlertText } from "@/lib/utils";

export function AlertsList({ alertData = [] }: AlertsListProps) {
  return (
    <div className="watchlist-alerts">
      <h3 className="watchlist-title">Alerts</h3>
      <div className="alert-list">
        {alertData.length === 0 ? (
          <div className="alert-empty">
            <Bell className="h-8 w-8 mx-auto mb-3 text-gray-600" />
            <p>No alerts set yet.</p>
            <p className="text-sm mt-2">
              Use &quot;Add Alert&quot; on a watchlist stock to get started.
            </p>
          </div>
        ) : (
          alertData.map((alert) => (
            <div key={alert.id} className="alert-item">
              <p className="alert-name">{alert.alertName || alert.symbol}</p>
              <div className="alert-details">
                <span className="alert-company">{alert.company}</span>
                <span className="alert-price">
                  {alert.currentPrice
                    ? `$${alert.currentPrice.toFixed(2)}`
                    : "—"}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Alert: {getAlertText(alert)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
