import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProjectDoc extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image?: string;
  technologies: string[];
  category: string;
  status: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProjectDoc>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    technologies: [{ type: String, required: true }],
    category: {
      type: String,
      required: true,
      enum: ['Full Stack', 'Backend', 'Linux & Systems', 'Cybersecurity', 'Programming', 'Hardware'],
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['in-progress', 'completed', 'concept', 'demo'],
      default: 'in-progress',
    },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false, index: true },
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    features: [{ type: String }],
    challenges: { type: String, required: true },
    learnings: { type: String, required: true },
    architecture: { type: String, default: '' },
    screenshots: [{ type: String }],
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ProjectModel: Model<IProjectDoc> =
  mongoose.models.Project || mongoose.model<IProjectDoc>('Project', ProjectSchema);
