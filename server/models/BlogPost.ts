import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPostDoc extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft';
  readTimeMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPostDoc>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Linux', 'Cybersecurity', 'Server Management', 'Programming', 'Web Development'],
      index: true,
    },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
      index: true,
    },
    readTimeMinutes: { type: Number, default: 3 },
  },
  { timestamps: true }
);

export const BlogPostModel: Model<IBlogPostDoc> =
  mongoose.models.BlogPost || mongoose.model<IBlogPostDoc>('BlogPost', BlogPostSchema);
