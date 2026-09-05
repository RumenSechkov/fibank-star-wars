import { useSyncExternalStore } from 'react';

function subscribe(onStatusChange: () => void): () => void {
  window.addEventListener('online', onStatusChange);
  window.addEventListener('offline', onStatusChange);
  return () => {
    window.removeEventListener('online', onStatusChange);
    window.removeEventListener('offline', onStatusChange);
  };
}

const getSnapshot = (): boolean => navigator.onLine;

/** Whether the browser currently reports a network connection. */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot);
}
