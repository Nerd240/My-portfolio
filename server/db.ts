import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

let isConnected = false;
let mongoDisabledOrFailed = false;

const uri = process.env.MONGODB_URI;

export async function connectToDatabase(): Promise<boolean> {
  if (isConnected) {
    return true;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[Database] No MONGODB_URI provided in environment. Utilizing resilient local document store.');
    mongoDisabledOrFailed = true;
    return false;
  }

  try {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 6000,
      dbName: 'ash_portfolio',
    };

    await mongoose.connect(uri, opts);
    isConnected = true;
    console.log('[Database] Successfully connected to MongoDB Atlas Cluster0 (ash_portfolio).');
    return true;
  } catch (error) {
    console.warn('[Database] Warning: MongoDB connection attempt failed. Falling back to local document store:', (error as Error).message);
    mongoDisabledOrFailed = true;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

// Ensure local persistent data directory exists for resilient fallback
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'db_store.json');

export interface LocalStoreState {
  projects: any[];
  messages: any[];
  posts: any[];
  users: any[];
}

export function getLocalStore(): LocalStoreState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('[Database] Failed to read local store file:', err);
  }
  return { projects: [], messages: [], posts: [], users: [] };
}

export function saveLocalStore(data: LocalStoreState): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Database] Failed to write local store file:', err);
  }
}
