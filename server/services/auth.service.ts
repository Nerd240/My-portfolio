import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUserDoc } from '../models/User.js';
import { isDbConnected, getLocalStore, saveLocalStore } from '../db.js';

const JWT_SECRET = process.env.AUTH_SECRET || 'dev-secret-key-for-ash-portfolio-jwt-session-991';
const COOKIE_NAME = 'ash_auth_token';

export interface AuthSession {
  userId: string;
  email: string;
  role: 'admin';
}

export class AuthService {
  static getCookieName() {
    return COOKIE_NAME;
  }

  static async hashPassword(plainText: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainText, salt);
  }

  static async verifyPassword(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }

  static generateToken(payload: AuthSession): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  static verifyToken(token: string): AuthSession | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthSession;
      return decoded;
    } catch {
      return null;
    }
  }

  static async ensureDefaultAdmin(): Promise<void> {
    const adminEmail = (process.env.ADMIN_EMAIL || 'aashrayashrestha24@gmail.com').toLowerCase().trim();
    const defaultPassword = process.env.ADMIN_PASSWORD || 'AshSecure2026!';

    if (isDbConnected()) {
      const existing = await UserModel.findOne({ email: adminEmail });
      if (!existing) {
        const passwordHash = await this.hashPassword(defaultPassword);
        await UserModel.create({
          email: adminEmail,
          passwordHash,
          role: 'admin',
        });
        console.log(`[AuthService] Initialized default admin in MongoDB: ${adminEmail}`);
      }
    } else {
      const store = getLocalStore();
      const existing = store.users.find((u) => u.email.toLowerCase() === adminEmail);
      if (!existing) {
        const passwordHash = await this.hashPassword(defaultPassword);
        const newUser = {
          _id: 'admin-local-1',
          email: adminEmail,
          passwordHash,
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        store.users.push(newUser);
        saveLocalStore(store);
        console.log(`[AuthService] Initialized default admin in local store: ${adminEmail}`);
      }
    }
  }

  static async login(email: string, plainTextPassword: string): Promise<{ user: AuthSession; token: string } | null> {
    await this.ensureDefaultAdmin();
    const normalizedEmail = email.toLowerCase().trim();

    let userDoc: { _id: string; email: string; passwordHash: string; role: 'admin' } | null = null;

    if (isDbConnected()) {
      const found = await UserModel.findOne({ email: normalizedEmail });
      if (found) {
        userDoc = {
          _id: (found._id as any).toString(),
          email: found.email,
          passwordHash: found.passwordHash,
          role: found.role,
        };
      }
    } else {
      const store = getLocalStore();
      const found = store.users.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (found) {
        userDoc = found;
      }
    }

    if (!userDoc) {
      return null;
    }

    const isMatch = await this.verifyPassword(plainTextPassword, userDoc.passwordHash);
    if (!isMatch) {
      return null;
    }

    const session: AuthSession = {
      userId: userDoc._id,
      email: userDoc.email,
      role: userDoc.role,
    };

    const token = this.generateToken(session);
    return { user: session, token };
  }
}
