export type ProjectStatus = 'in-progress' | 'completed' | 'concept' | 'demo';

export type ProjectCategory =
  | 'Full Stack'
  | 'Backend'
  | 'Linux & Systems'
  | 'Cybersecurity'
  | 'Programming'
  | 'Hardware';

export interface Project {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image?: string;
  technologies: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  problem: string;
  solution: string;
  features: string[];
  challenges: string;
  learnings: string;
  architecture?: string;
  screenshots?: string[];
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MessageStatus = 'unread' | 'read' | 'replied';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

export type BlogPostStatus = 'published' | 'draft';

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Linux' | 'Cybersecurity' | 'Server Management' | 'Programming' | 'Web Development';
  tags: string[];
  status: BlogPostStatus;
  readTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin';
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: {
    name: string;
    level: 'Learning' | 'Practicing' | 'Familiar';
    detail: string;
    tags?: string[];
  }[];
}
