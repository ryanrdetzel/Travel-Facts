import type { HistoryEntry } from '../types';

const STORAGE_KEY = 'roadlore_history';

export function saveHistory(entries: HistoryEntry[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or unavailable
  }
}

export function loadHistory(): HistoryEntry[] {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
