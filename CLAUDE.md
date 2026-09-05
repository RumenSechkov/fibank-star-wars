# Project: Responsive Login Form with Data Table

## Overview

A React + TypeScript application with two pages:

1. A login form (`/`) with client-side validation.
2. A data table page (`/table`) populated from an API, reachable only after a successful login.

## Tech Stack

- react + vite + typescript
- react-router-dom for routing
- fetch for API calls
- CSS Modules for styling

## Project Structure

```
src/
  components/
    LoginForm/
    DataTable/
    OfflineModal/
    LoadingSpinner/
  pages/
    LoginPage.tsx
    TablePage.tsx
  hooks/
    useData.ts              # fetch + pagination logic
    useOnlineStatus.ts      # connectivity detection
    useErrorReport.ts       # error reporting
  types/
    api.ts                  # Person type, API response types
  utils/
    validation.ts           # username/password validation helpers
  App.tsx
  main.tsx
CLAUDE.md
README.md
```

## Pages & Routes

- `/` — login form
- `/table` — data table page
- redirect unknown routes back to `/`

## Feature Requirements

### 1. Login Form (`/`)

- Two fields: username, password.
- Validation rules (both fields, applied live as the user types):
  - Not empty
  - Length between 4 and 30 characters
- Show inline validation feedback with helper text and field highlighting.
- Login button is **disabled** until both fields pass validation.
- On successful "login" (client-side only, no real auth), navigate to `/table` using `react-router-dom`'s `useNavigate`.

### 2. Data Table Page (`/table`)

- Fetch from `https://swapi.py4e.com/api/people`.
- Display columns: **name, mass, height, hair color, skin color**.
- Implement pagination:
  - `people` endpoint is already paginated via `next`/`previous` links in the response — use that
- Table must be visually clean and responsive:
  - Horizontal scroll for card layout on mobile and 768px+ screens (avoid unreadable squished tables on mobile).

### 3. Loading, Caching, Error & Connectivity Handling

- **Loading state:** show a spinner while fetching.
- **Error handling:** if the fetch fails, show a clear error state in the UI.
- **Offline detection:** detect when the user's connection is down and show a modal, notifying the user their connection is unavailable.

## Code Quality Expectations

- Follow project structure.
- Meaningful naming, consistent formatting.
- Functional components + Hooks only (no class components).
- Keep components focused — presentational vs. logic separation where it makes sense.
- Extract reusable logic into custom hooks (data fetching, online status, error reporting).
- Type everything meaningfully — avoid `any`; define an interface for the API `Person` shape and API response envelope.
- Clean, well-organized, idiomatic React/TypeScript project — code quality, readability, and correct use of hooks matter as much as functionality.
- No unused code, no leftover console.logs, no commented-out dead code.

## Definition of Done

- `npm run dev` runs the app with no errors; `npm run build` succeeds.
- No typescript warnings or errors.
- No eslint warnings or errors.
- App is responsive from small mobile widths up through desktop.
- @browser go to localhost:3000 and check the console for errors.

## Hard Stops

- Do not install dependencies without explicit approval.
- Do not add folders in the project structure without explicit approval.
