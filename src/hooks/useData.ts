import { useCallback, useEffect, useState } from 'react';
import type { PeopleResponse, Person } from '../types/api';

const PEOPLE_ENDPOINT = 'https://swapi.py4e.com/api/people/';

type RequestState =
  | { status: 'loading' }
  | { status: 'error'; message: string; isNetworkError: boolean }
  | { status: 'success'; data: PeopleResponse };

export interface UseDataResult {
  status: RequestState['status'];
  people: Person[];
  /** Total number of characters across all pages. */
  count: number;
  /** 1-based index of the page currently displayed. */
  page: number;
  errorMessage: string | null;
  /** True when the request failed because the network was unreachable. */
  isNetworkError: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  retry: () => void;
}

/** Reads the `page` query parameter of a SWAPI list URL, defaulting to 1. */
function readPageNumber(url: string): number {
  const page = Number(new URL(url).searchParams.get('page'));
  return Number.isFinite(page) && page > 0 ? page : 1;
}

/**
 * Fetches a page of Star Wars characters and exposes navigation through the
 * API's own `next`/`previous` links.
 */
export function useData(): UseDataResult {
  const [pageUrl, setPageUrl] = useState(PEOPLE_ENDPOINT);
  const [reloadCount, setReloadCount] = useState(0);
  const [state, setState] = useState<RequestState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    const loadPage = async () => {
      try {
        const response = await fetch(pageUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`The server responded with status ${response.status}.`);
        }
        const data: PeopleResponse = await response.json();
        setState({ status: 'success', data });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Something went wrong while loading the characters.',
          // `fetch` rejects with a TypeError when the request never reached
          // the server, which is what a dropped connection looks like here.
          isNetworkError: error instanceof TypeError || !navigator.onLine,
        });
      }
    };

    void loadPage();
    return () => controller.abort();
  }, [pageUrl, reloadCount]);

  const data = state.status === 'success' ? state.data : null;
  const nextPageUrl = data?.next ?? null;
  const previousPageUrl = data?.previous ?? null;

  const goToNextPage = useCallback(() => {
    if (nextPageUrl) setPageUrl(nextPageUrl);
  }, [nextPageUrl]);

  const goToPreviousPage = useCallback(() => {
    if (previousPageUrl) setPageUrl(previousPageUrl);
  }, [previousPageUrl]);

  const retry = useCallback(() => setReloadCount((count) => count + 1), []);

  return {
    status: state.status,
    people: data?.results ?? [],
    count: data?.count ?? 0,
    page: readPageNumber(pageUrl),
    errorMessage: state.status === 'error' ? state.message : null,
    isNetworkError: state.status === 'error' && state.isNetworkError,
    hasNextPage: nextPageUrl !== null,
    hasPreviousPage: previousPageUrl !== null,
    goToNextPage,
    goToPreviousPage,
    retry,
  };
}
