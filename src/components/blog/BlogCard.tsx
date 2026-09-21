import React from 'react';
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { BlogPost } from '../../types';
import { Badge } from '../ui/Badge';

interface BlogCardProps {
  post: BlogPost;
  onSelect: (slug: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onSelect }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={() => onSelect(post.slug)}
      className="group p-5 sm:p-6 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700 transition-all duration-150 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="accent">{post.category}</Badge>
          <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readTimeMinutes} min read
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-neutral-100 group-hover:text-sky-400 transition-colors tracking-tight">
          {post.title}
        </h3>

        <p className="mt-2 text-sm text-neutral-400 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[10px] font-mono bg-neutral-800/80 text-neutral-400 px-2 py-0.5 rounded border border-neutral-700/40"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
        <span className="text-xs font-mono text-neutral-500">Read Journal Entry</span>
        <span className="text-xs font-mono text-sky-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          <span>Open</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
