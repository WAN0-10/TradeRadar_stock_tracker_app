# 📈 TradeRadar
[🚀 Live Demo] [📂 GitHub Repository]

**TradeRadar** is a stock tracking web application built with **Next.js**, designed to give users a centralized place to monitor financial markets, track stocks, and visualize market data.

The application combines market data from **Finnhub**, interactive charting through **TradingView**, user authentication with **Better Auth**, and event-driven background processing through **Inngest**.

> 🚧 **Project Status:** Active development

<img width="1275" height="896" alt="TradeRadar" src="" />

---

## ✨ Features

### 📊 Market Tracking

* Access real-time and historical stock market data through the **Finnhub API**
* Search and monitor stock tickers
* View market information and stock details
* Interactive market charts powered by **TradingView**

### 👤 User Accounts

* User authentication and session management through **Better Auth**
* User-specific application data
* Persistent data storage using **MongoDB**

### ⚙️ Background Processing

* Event-driven background jobs powered by **Inngest**
* Designed to support automated tasks such as:

  * Price alerts
  * Data synchronization
  * Scheduled updates
  * Other asynchronous workflows

### 📈 TradingView Integration

* Embedded TradingView widgets for interactive market visualization
* Historical price charts and market analysis

---

## 🛠️ Tech Stack

| Category        | Technology                                  |
| --------------- | ------------------------------------------- |
| Framework       | [Next.js](https://nextjs.org/)              |
| Language        | TypeScript                                  |
| Database        | [MongoDB](https://www.mongodb.com/)         |
| Authentication  | [Better Auth](https://www.better-auth.com/) |
| Market Data     | [Finnhub API](https://finnhub.io/)          |
| Background Jobs | [Inngest](https://www.inngest.com/)         |
| Charts          | [TradingView](https://www.tradingview.com/) |
| Deployment      | [Vercel](https://vercel.com/)               |

---

## 🏗️ Architecture

TradeRadar uses a modern full-stack architecture centered around Next.js.

```text
                         ┌─────────────────┐
                         │     TradingView │
                         │     Widgets     │
                         └────────┬────────┘
                                  │
                                  │
┌──────────────┐          ┌───────▼────────┐
│    User      │─────────▶│    Next.js     │
└──────────────┘          │   Application  │
                          └───────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
              ┌─────▼─────┐ ┌────▼─────┐ ┌─────▼─────┐
              │  Finnhub  │ │ MongoDB  │ │ Better    │
              │    API    │ │          │ │ Auth      │
              └───────────┘ └──────────┘ └───────────┘
                                  │
                            ┌─────▼─────┐
                            │  Inngest  │
                            │ Background│
                            │   Jobs    │
                            └───────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Before running TradeRadar locally, make sure you have:

* **Node.js** (LTS recommended)
* **npm**
* A **MongoDB** database, either local or MongoDB Atlas
* A **Finnhub API key**
* An **Inngest** account and required keys

### 1. Clone the Repository

```bash
git clone https://github.com/WAN0-10/TradeRadar_stock_tracker_app.git
cd TradeRadar_stock_tracker_app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
FINNHUB_API_KEY=your_finnhub_api_key
BETTER_AUTH_SECRET=your_auth_secret
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

Replace each placeholder with the appropriate value for your environment.

> ⚠️ **Security:** Never commit `.env.local` or expose API keys, database credentials, authentication secrets, or Inngest credentials in source control.

### 4. Start the Development Server

```bash
npm run dev
```

The application should now be available at:

```text
http://localhost:3000
```

---

## ☁️ Deployment

TradeRadar is designed to be deployed using **Vercel**.

When deploying to Vercel:

1. Import the repository into your Vercel account.
2. Configure all required environment variables.
3. Deploy the application.
4. Verify that Inngest can connect to the deployed application.
5. Test authentication, market-data requests, and background jobs.

### ⚠️ Inngest Production Configuration

During local development, Inngest may be configured to use development mode.

**Do not set `INNGEST_DEV=1` in production.**

If `INNGEST_DEV` is accidentally carried over from local development, Inngest may remain in local development mode instead of connecting correctly to the deployed application.

For production, ensure that `INNGEST_DEV` is either:

* Not defined, or
* Explicitly set to `0`

---

## 🐛 Known Issues & Troubleshooting

### Inngest Cloud Synchronization

If background jobs fail to synchronize after deployment:

* Check the Inngest configuration.
* Verify the `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY`.
* Make sure `INNGEST_DEV` is not enabled in the production environment.
* Confirm that the deployed application is correctly registered with Inngest.

### `cmdk` Command Dialog

A runtime error may occur within the command dialog component depending on the installed `cmdk` version.

If the command dialog fails:

1. Check the installed `cmdk` version.
2. Compare it with the version expected by the project.
3. Update or downgrade the package if necessary.

### Finnhub Data Not Loading

If stock data fails to load:

* Verify that `FINNHUB_API_KEY` is correctly configured.
* Check that the API key is valid.
* Confirm that the environment variable is available in the environment where the application is running.
* Compare the local `.env.local` configuration with the environment variables configured on Vercel.

---

## 🗺️ Roadmap

Planned improvements include:

* [ ] Price alerts
* [ ] User watchlists
* [ ] Portfolio tracking
* [ ] Improved market-data visualizations
* [ ] Automated notifications
* [ ] Expanded stock and market analytics
* [ ] Additional portfolio performance metrics

---

## 📚 What I Learned

This project was built as a practical opportunity to work with modern full-stack development concepts, including:

* Building full-stack applications with Next.js
* Working with external financial APIs
* Database design and persistence with MongoDB
* Implementing authentication
* Integrating third-party services
* Designing asynchronous and event-driven workflows
* Deploying applications to Vercel
* Managing environment variables across development and production
* Debugging issues that only appear after deployment, because apparently software enjoys behaving differently when other people are watching

---

## 🔮 Future Development

TradeRadar is intended to grow beyond a basic stock tracker into a more complete personal market-monitoring platform.

Future development will focus on combining **market data, personalized watchlists, portfolio information, alerts, and automated background workflows** into a single application.

---

## 📄 License

This project is intended primarily as a learning and portfolio project.

Refer to the repository for the current licensing information and project-specific terms.
