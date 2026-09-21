import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Please provide a valid email address'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(3000, 'Message cannot exceed 3000 characters'),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const projectSchema = z.object({
  title: z.string().trim().min(3, 'Title is required').max(120),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  shortDescription: z.string().trim().min(10, 'Short description must be at least 10 characters').max(300),
  description: z.string().trim().min(20, 'Full description must be at least 20 characters'),
  image: z.string().trim().optional().or(z.literal('')),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  category: z.enum(['Full Stack', 'Backend', 'Linux & Systems', 'Cybersecurity', 'Programming', 'Hardware']),
  status: z.enum(['in-progress', 'completed', 'concept', 'demo']),
  githubUrl: z.string().trim().url('Invalid GitHub URL').optional().or(z.literal('')),
  liveUrl: z.string().trim().url('Invalid Live URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
  problem: z.string().trim().min(10, 'Problem statement is required'),
  solution: z.string().trim().min(10, 'Solution statement is required'),
  features: z.array(z.string()).default([]),
  challenges: z.string().trim().min(5, 'Challenges description is required'),
  learnings: z.string().trim().min(5, 'Learnings description is required'),
  architecture: z.string().trim().optional().or(z.literal('')),
  screenshots: z.array(z.string()).default([]),
  isDemo: z.boolean().default(false),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const blogPostSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().trim().min(10).max(400),
  content: z.string().trim().min(30),
  category: z.enum(['Linux', 'Cybersecurity', 'Server Management', 'Programming', 'Web Development']),
  tags: z.array(z.string()).default([]),
  status: z.enum(['published', 'draft']).default('published'),
  readTimeMinutes: z.number().int().min(1).default(3),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
