import React from 'react';
import { ArrowLeft, Clock, Calendar, Tag, Terminal } from 'lucide-react';
import { BlogPost } from '../../types';
import { Badge } from '../ui/Badge';

interface BlogPostDetailProps {
  post: BlogPost;
  onBack: () => void;
}

export const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post, onBack }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Back link */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-neutral-100 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to all learning logs</span>
      </button>

      {/* Header */}
      <header className="space-y-4 pb-8 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <Badge variant="accent">{post.category}</Badge>
          <span className="text-xs font-mono text-neutral-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {formattedDate}
          </span>
          <span className="text-xs font-mono text-neutral-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {post.readTimeMinutes} min read
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-100 leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-neutral-300 font-sans italic border-l-2 border-sky-500/80 pl-4 py-1">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs font-mono bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded border border-neutral-700/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* Post Content */}
      <div className="py-8 prose prose-invert max-w-none text-neutral-300 leading-relaxed font-sans space-y-6">
        {post.content.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={index} className="text-xl font-bold text-neutral-100 font-mono pt-4">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('```')) {
            const cleaned = paragraph.replace(/```[a-z]*\n?|```/g, '');
            return (
              <pre
                key={index}
                className="p-4 rounded-lg bg-[#080a0d] border border-neutral-800 font-mono text-xs sm:text-sm text-sky-300 overflow-x-auto my-4"
              >
                <code>{cleaned}</code>
              </pre>
            );
          }
          if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
            const items = paragraph.split('\n');
            return (
              <ul key={index} className="space-y-2 list-disc list-inside text-neutral-300 my-2">
                {items.map((it, iIdx) => (
                  <li key={iIdx} className="leading-relaxed">
                    {it.replace(/^[0-9]+\.\s*|-\s*/, '')}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={index} className="text-neutral-300 leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-neutral-800 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-mono text-sky-400 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Logs</span>
        </button>

        <span className="text-xs font-mono text-neutral-500">
          Documented by Ash (Aashraya Shrestha)
        </span>
      </footer>
    </article>
  );
};
