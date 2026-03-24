import { openDB, type IDBPDatabase } from 'idb';
import type { StatePack } from '../types';

const DB_NAME = 'roadlore';
const DB_VERSION = 1;
const PACKS_STORE = 'packs';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(PACKS_STORE)) {
          db.createObjectStore(PACKS_STORE, { keyPath: 'stateCode' });
        }
      },
    });
  }
  return dbPromise;
}

export async function savePack(pack: StatePack): Promise<void> {
  const db = await getDB();
  await db.put(PACKS_STORE, pack);
}

export async function getPack(stateCode: string): Promise<StatePack | undefined> {
  const db = await getDB();
  return db.get(PACKS_STORE, stateCode);
}

export async function deletePack(stateCode: string): Promise<void> {
  const db = await getDB();
  await db.delete(PACKS_STORE, stateCode);
}

export async function getAllPackCodes(): Promise<string[]> {
  const db = await getDB();
  return db.getAllKeys(PACKS_STORE) as Promise<string[]>;
}

export async function getAllPacks(): Promise<StatePack[]> {
  const db = await getDB();
  return db.getAll(PACKS_STORE);
}
