# Star Wars Character Directory

A small React + TypeScript app with two pages: a validated login form and a paginated,
responsive table of Star Wars characters fetched from
[SWAPI](https://swapi.py4e.com/api/people).

## Tech stack

- **React 19** with functional components and hooks only
- **TypeScript** (strict, including `noUncheckedIndexedAccess`)
- **Vite** for dev server and build
- **react-router-dom 7** for routing
- Native **fetch** for data access — no HTTP client dependency
- **CSS Modules** for component-scoped styling

## Getting started

Requires Node.js `^20.19.0 || >=22.12.0` (Vite 8's engine range; developed on Node 22).

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Starts Vite on port 3000 (`strictPort`, so it fails rather than drifting to another port) |
| `npm run build` | Type-checks with `tsc -b`, then produces a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint over the project |
| `npm run lint:fix` | Runs ESLint with `--fix` |

## Project structure

```
src/
  components/
    DataTable/          # presentational table + pagination controls
    LoadingSpinner/     # shared spinner used for fetches and the login redirect
    LoginForm/          # controlled login fields, validation display, submit
    OfflineModal/       # connectivity dialog with focus management
  pages/
    LoginPage.tsx       # layout shell around LoginForm
    TablePage.tsx       # wires useData to the three UI states
  hooks/
    useData.ts          # fetch + pagination for the people endpoint
    useOnlineStatus.ts  # connectivity detection
  types/
    api.ts              # Person and the paginated response envelope
  utils/
    auth.ts             # sessionStorage login marker
    validation.ts       # pure credential validation
  App.tsx               # router, route guard, app-wide offline modal
  index.css             # global reset and base typography
  main.tsx
```

## Routing and the route guard

[`App.tsx`](src/App.tsx) sets up `BrowserRouter` with:

- `/` — the login page
- `/table` — the data table, wrapped in a `ProtectedRoute`
- `*` — anything else redirects to `/`

"Login" is client-side only; there is no real authentication. A successful submit writes a
marker to `sessionStorage` (see [`utils/auth.ts`](src/utils/auth.ts)) and `ProtectedRoute`
redirects to `/` when that marker is missing. Because it lives in `sessionStorage` rather
than `localStorage`, closing the tab ends the session.

## Login form

[`LoginForm`](src/components/LoginForm/LoginForm.tsx) keeps `username` and `password` in
`useState` as controlled inputs. Validation lives in
[`utils/validation.ts`](src/utils/validation.ts) as one pure function:

- required (whitespace-only counts as empty)
- at least 4 characters
- at most 30 characters

Both errors are recomputed on every render and `isValid` is derived from them, then bound
directly to the submit button's `disabled` prop — there is no second copy of validity state
to fall out of sync. Error text and the red field highlight appear once a field has been
touched (first keystroke or blur), so the form does not greet the user with two errors
before they have typed anything.

On submit the session is marked and a spinner is shown briefly before navigating to
`/table` with `replace: true`, so Back does not land on a login page that immediately
bounces forward. The pause is the named `REDIRECT_DELAY_MS` constant; set it to `0` if you
would rather the redirect be instant.

## Data fetching and pagination

[`useData`](src/hooks/useData.ts) owns everything about the request. Internally it holds a
discriminated union — `loading | error | success` — so the three states cannot be confused
with each other, and `TablePage` renders exactly one of them.

- Non-2xx responses are treated as errors (`fetch` does not reject on 404/500 by itself).
- An `AbortController` cancels the in-flight request on page change or unmount; aborted
  requests are ignored rather than surfaced as errors.
- Pagination stores the current page **URL** and moves by following the API's own
  `next`/`previous` links, so Next genuinely requests `?page=2`. Buttons are disabled when
  the API reports no such link.
- `retry()` re-runs the current request.

The table shows name, mass, height, hair color and skin color. SWAPI returns every field as
a string (`"172"`, `"unknown"`, `"n/a"`), which is what [`types/api.ts`](src/types/api.ts)
models; the envelope is a generic `PaginatedResponse<T>` carrying `count`, `next`,
`previous` and `results`.

## Connectivity handling

[`useOnlineStatus`](src/hooks/useOnlineStatus.ts) subscribes to the window `online` and
`offline` events via `useSyncExternalStore`, so React reads the current `navigator.onLine`
at render rather than a value captured before the subscription existed.

The offline modal is rendered from two places, deliberately:

- `App` shows it whenever the browser reports being offline, so it covers both pages.
- `TablePage` shows it when a request died on the network while the browser still believes
  it is online (unreachable host, DNS failure). `fetch` rejects with a `TypeError` in that
  case, which is what `isNetworkError` keys off. That instance is guarded with `&& isOnline`
  so the two can never stack into a double overlay.

To try it: DevTools → Network → "Offline", then reload or page through the table.

## Responsive design

Mobile-first: every base rule targets narrow viewports and each media query is `min-width`
only. Containers are fluid (`width: 100%` with a `rem` `max-width`), and padding and
headings use `clamp()` so they scale with the viewport instead of stepping at breakpoints.

The table changes shape rather than shrinking. Below `48em` (768px) each row renders as a
card, with column names repeated per cell through `data-label` and `td::before`; the real
`<thead>` stays in the DOM, only visually hidden, so screen readers keep the header
associations. From `48em` up it is a real table with a `40rem` minimum width inside an
`overflow-x: auto` container, so narrow desktop and tablet widths scroll horizontally
instead of crushing the columns.

## Accessibility

- Every input has a real `<label htmlFor>`; helper text is linked with `aria-describedby`
  and announced through `aria-live="polite"` when it changes to an error.
- `aria-invalid` is only set once a field is genuinely in an error state.
- A single `:focus-visible` ring is defined globally in `index.css`; invalid inputs get a
  red ring so focus and error state do not conflict.
- The offline modal honours its `aria-modal`: Tab is trapped inside it, body scroll is
  locked, and focus is restored to the previously focused element when it closes.
- Action buttons are at least 44px tall for touch.
- All text/background pairs in the app meet WCAG AA for normal text (lowest is 4.83:1).

## Known limitations

- Authentication is a `sessionStorage` flag, not real auth. Any credentials passing the
  length rules will "log in".
- Reconnecting does not automatically refetch. The modal disappears on the `online` event,
  but a page that failed while offline stays on its error panel until "Try again".
- There is no test suite; verification so far has been type-checking, linting, building and
  targeted checks of the validation and network-error paths.
- The app has not been exercised in a browser as part of development — the breakpoint sweep
  (375 / 768 / 1280px), the DevTools offline check and a keyboard/screen-reader pass are
  still worth doing manually.
