import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { BlogPost } from '../../types';
import { BlogPostInput, blogPostSchema } from '../../lib/validation';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  post?: BlogPost | null;
}

export const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose, onSaved, post }) => {
  const [formData, setFormData] = useState<BlogPostInput>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Linux',
    tags: [],
    status: 'published',
    readTimeMinutes: 3,
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags || [],
        status: post.status,
        readTimeMinutes: post.readTimeMinutes || 3,
      });
      setTagInput((post.tags || []).join(', '));
    } else {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'Linux',
        tags: [],
        status: 'published',
        readTimeMinutes: 3,
      });
      setTagInput('');
    }
    setError('');
  }, [post, isOpen]);

  if (!isOpen) return null;

  const autoGenerateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !post ? autoGenerateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const tagsArray = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const dataToValidate: BlogPostInput = {
      ...formData,
      tags: tagsArray,
    };

    const parsed = blogPostSchema.safeParse(dataToValidate);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Validation failed');
      return;
    }

    setLoading(true);
    try {
      const url = post ? `/api/blog/${post._id}` : '/api/blog';
      const method = post ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToValidate),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to save blog post');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl my-8 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <h3 className="text-lg font-mono font-semibold text-neutral-100">
            {post ? 'Edit Learning Log' : 'Create Learning Log Entry'}
          </h3>
          <button onClick={onClose} className="p-1 rounded text-neutral-400 hover:text-neutral-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
              >
                <option value="Linux">Linux</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Server Management">Server Management</option>
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Read Time (min)</label>
              <input
                type="number"
                min="1"
                value={formData.readTimeMinutes}
                onChange={(e) => setFormData({ ...formData, readTimeMinutes: parseInt(e.target.value) || 3 })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Excerpt (Summary) *</label>
            <input
              type="text"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="MX Linux, Debian, Sockets, CLI"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Full Content (Markdown supported) *</label>
            <textarea
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              placeholder="Write your technical writeup here..."
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500 font-mono text-xs"
            />
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded font-semibold disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{post ? 'Update Entry' : 'Publish Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
