# Sykell URL Crawler – Frontend

A responsive React/TypeScript app to submit and analyze website URLs via the Sykell URL crawler backend.

## Features

- Login via JWT (POST `/auth/login`)
- Submit URLs for crawling
- Real-time crawl status (Queued, Running, Done, Error)
- Dashboard: sortable, paginated, filterable table
- Details: donut/bar chart (internal/external links) & broken link list
- Bulk actions: rerun/delete
- Mobile-friendly UI (Tailwind CSS)
- API calls with JWT Authorization header
- Frontend tests (Vitest + Testing Library)

## Stack

- React + TypeScript
- React Router
- Context API
- Axios
- Tailwind CSS
- TanStack Table
- Recharts
- Vitest + Testing Library

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/sykell-url-crawler-frontend.git
cd sykell-url-crawler-frontend
npm install
```

### 2. Configure Backend URL

- See `.env.example`. The default is `http://localhost:8080`.

### 3. Start Dev Server

```bash
npm run dev
```

### 4. Run Tests

```bash
npm run test
```

## Usage

1. **Login:** Use credentials seeded in backend (`admin/adminpass`).
2. **Add URL:** Enter any website URL and submit for analysis.
3. **Dashboard:** View status and results, sort/filter/search.
4. **Details:** Click a row for charts and broken link info.
5. **Bulk Actions:** Select rows, rerun or delete analyses.

## Project Structure

- `src/`
    - `components/` – UI components
    - `context/` – Auth & app state providers
    - `hooks/` – Custom hooks for API, auth, table
    - `pages/` – Route pages (Login, Dashboard, Details)
    - `api/` – Axios instance & API functions
    - `App.tsx` – Router and layout
    - `main.tsx` – Entry point
    - `tests/` – Vitest/Testing Library tests

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed.

```
VITE_API_URL=http://localhost:8080
```

## License

MIT
