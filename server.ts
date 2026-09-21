import dotenv from 'dotenv';
dotenv.config({ override: true });

import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import os from 'os';
import { createServer as createViteServer } from 'vite';
import { connectToDatabase, isDbConnected } from './server/db.js';
import { AuthService } from './server/services/auth.service.js';
import { ProjectService } from './server/services/project.service.js';
import { ContactService } from './server/services/contact.service.js';
import { BlogService } from './server/services/blog.service.js';
import { runSeed } from './server/seed.js';
import {
  contactMessageSchema,
  loginSchema,
  projectSchema,
  blogPostSchema,
} from './src/lib/validation.js';

const PORT = 3000;
const app = express();

// Security and parser middleware
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

// Simple in-memory rate limiter for contact submissions
const contactRateLimits = new Map<string, { count: number; firstSeen: number }>();
function rateLimitContact(req: Request, res: Response, next: NextFunction) {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 10;

  const current = contactRateLimits.get(ip);
  if (!current || now - current.firstSeen > windowMs) {
    contactRateLimits.set(ip, { count: 1, firstSeen: now });
    return next();
  }

  if (current.count >= maxRequests) {
    return res.status(429).json({
      error: 'Too many contact messages sent from this IP. Please wait a few minutes before trying again.',
    });
  }

  current.count++;
  next();
}

// Authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token =
    req.cookies?.ash_auth_token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const session = AuthService.verifyToken(token);
  if (!session || session.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admin privileges required.' });
  }

  (req as any).user = session;
  next();
}

// Optional Auth (to see drafts or admin state)
function optionalAdmin(req: Request, res: Response, next: NextFunction) {
  const token =
    req.cookies?.ash_auth_token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (token) {
    const session = AuthService.verifyToken(token);
    if (session && session.role === 'admin') {
      (req as any).user = session;
    }
  }
  next();
}

// ==========================================
// 1. HEALTH & SYSTEM LAB STATUS APIS
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: isDbConnected() ? 'mongodb' : 'resilient-local-store',
  });
});

app.get('/api/system/status', (req, res) => {
  res.json({
    developer: 'Ash (Aashraya Shrestha)',
    education: 'RJU — CSIT, 1st Semester',
    careerFocus: 'Cybersecurity & Server Management',
    os: {
      primary: 'MX Linux (Debian base)',
      kernel: os.type() + ' ' + os.release(),
      arch: os.arch(),
      platform: os.platform(),
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(os.uptime()),
      memory: {
        totalMb: Math.round(os.totalmem() / (1024 * 1024)),
        freeMb: Math.round(os.freemem() / (1024 * 1024)),
      },
    },
    services: [
      { name: 'Portfolio Server', status: 'active', port: PORT },
      { name: 'Storage Engine', status: isDbConnected() ? 'mongodb (active)' : 'local-resilient (active)' },
      { name: 'SSH Lab Baseline', status: 'practicing' },
      { name: 'UFW Firewall Rules', status: 'practicing' },
    ],
  });
});

// ==========================================
// 2. AUTHENTICATION APIS
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.format() });
    }

    const result = await AuthService.login(parsed.data.email, parsed.data.password);
    if (!result) {
      return res.status(401).json({ error: 'Invalid credentials. Check email and password.' });
    }

    // Set secure HTTP-only cookie
    res.cookie(AuthService.getCookieName(), result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      user: { email: result.user.email, role: result.user.role },
      token: result.token, // Also returned for explicit header auth if preferred
    });
  } catch (err: any) {
    console.error('[API Login Error]', err);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(AuthService.getCookieName());
  res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/auth/me', (req, res) => {
  const token =
    req.cookies?.ash_auth_token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (!token) {
    return res.status(401).json({ authenticated: false, user: null });
  }

  const session = AuthService.verifyToken(token);
  if (!session) {
    return res.status(401).json({ authenticated: false, user: null });
  }

  return res.json({
    authenticated: true,
    user: { id: session.userId, email: session.email, role: session.role },
  });
});

// ==========================================
// 3. PROJECTS APIS
// ==========================================
app.get('/api/projects', async (req, res) => {
  try {
    const { category, featured, status } = req.query;
    const filter: any = {};
    if (category && typeof category === 'string') filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (status && typeof status === 'string') filter.status = status;

    const projects = await ProjectService.getAll(filter);
    res.json(projects);
  } catch (err: any) {
    console.error('[API Projects GET Error]', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.get('/api/projects/:slug', async (req, res) => {
  try {
    const project = await ProjectService.getBySlug(req.params.slug);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (err: any) {
    console.error('[API Project Slug GET Error]', err);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
});

app.post('/api/projects', requireAdmin, async (req, res) => {
  try {
    const parsed = projectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.format() });
    }

    const existing = await ProjectService.getBySlug(parsed.data.slug);
    if (existing) {
      return res.status(409).json({ error: 'A project with this slug already exists' });
    }

    const created = await ProjectService.create(parsed.data);
    res.status(201).json(created);
  } catch (err: any) {
    console.error('[API Projects POST Error]', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.patch('/api/projects/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await ProjectService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Project not found or update failed' });
    }
    res.json(updated);
  } catch (err: any) {
    console.error('[API Projects PATCH Error]', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await ProjectService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true, message: 'Project removed successfully' });
  } catch (err: any) {
    console.error('[API Projects DELETE Error]', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ==========================================
// 4. CONTACT MESSAGE APIS
// ==========================================
app.post('/api/contact', rateLimitContact, async (req, res) => {
  try {
    const parsed = contactMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.format() });
    }

    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const message = await ContactService.create(parsed.data, ip);
    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent directly to Ash.',
      id: message._id,
    });
  } catch (err: any) {
    console.error('[API Contact POST Error]', err);
    res.status(500).json({ error: 'Failed to submit contact message. Please try again later.' });
  }
});

app.get('/api/contact', requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const messages = await ContactService.getAll(typeof status === 'string' ? status : undefined);
    res.json(messages);
  } catch (err: any) {
    console.error('[API Contact GET Error]', err);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

app.patch('/api/contact/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ error: 'Invalid message status' });
    }
    const updated = await ContactService.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(updated);
  } catch (err: any) {
    console.error('[API Contact PATCH Error]', err);
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

app.delete('/api/contact/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await ContactService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted' });
  } catch (err: any) {
    console.error('[API Contact DELETE Error]', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ==========================================
// 5. BLOG / LEARNING LOG APIS
// ==========================================
app.get('/api/blog', optionalAdmin, async (req, res) => {
  try {
    const isAdmin = Boolean((req as any).user);
    const posts = await BlogService.getAll(!isAdmin);
    res.json(posts);
  } catch (err: any) {
    console.error('[API Blog GET Error]', err);
    res.status(500).json({ error: 'Failed to fetch learning log posts' });
  }
});

app.get('/api/blog/:slug', optionalAdmin, async (req, res) => {
  try {
    const isAdmin = Boolean((req as any).user);
    const post = await BlogService.getBySlug(req.params.slug, !isAdmin);
    if (!post) {
      return res.status(404).json({ error: 'Learning log post not found' });
    }
    res.json(post);
  } catch (err: any) {
    console.error('[API Blog Slug GET Error]', err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

app.post('/api/blog', requireAdmin, async (req, res) => {
  try {
    const parsed = blogPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.format() });
    }

    const existing = await BlogService.getBySlug(parsed.data.slug, false);
    if (existing) {
      return res.status(409).json({ error: 'A post with this slug already exists' });
    }

    const created = await BlogService.create(parsed.data);
    res.status(201).json(created);
  } catch (err: any) {
    console.error('[API Blog POST Error]', err);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

app.patch('/api/blog/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await BlogService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Post not found or update failed' });
    }
    res.json(updated);
  } catch (err: any) {
    console.error('[API Blog PATCH Error]', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

app.delete('/api/blog/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await BlogService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err: any) {
    console.error('[API Blog DELETE Error]', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// ==========================================
// 6. SERVER BOOTSTRAP & VITE INTEGRATION
// ==========================================
async function startServer() {
  // Connect to DB or init fallback storage & run seed check
  await connectToDatabase();
  await AuthService.ensureDefaultAdmin();
  await runSeed();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Portfolio running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Fatal Startup Error]', err);
});
