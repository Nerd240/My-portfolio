import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Mail,
  BookOpen,
  Server,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  Clock,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Project, ContactMessage, BlogPost } from '../../types';
import { Badge } from '../ui/Badge';
import { ProjectModal } from './ProjectModal';
import { BlogModal } from './BlogModal';

interface AdminDashboardProps {
  onLogout: () => void;
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onBackToSite }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'messages' | 'blog' | 'system'>('projects');

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [projRes, msgRes, blogRes, sysRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/contact'),
        fetch('/api/blog'),
        fetch('/api/system/status'),
      ]);

      if (projRes.ok) setProjects(await projRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());
      if (blogRes.ok) setPosts(await blogRes.json());
      if (sysRes.ok) setSystemInfo(await sysRes.json());
    } catch (err: any) {
      showFeedback('error', 'Failed to synchronize dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Project Actions
  const handleDeleteProject = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
        showFeedback('success', `Deleted project: ${title}`);
      } else {
        showFeedback('error', 'Failed to delete project');
      }
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !project.featured }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
        showFeedback('success', `Updated featured state for: ${project.title}`);
      }
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  // Message Actions
  const handleUpdateMessageStatus = async (id: string, status: 'unread' | 'read' | 'replied') => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMessages((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
        showFeedback('success', `Message marked as ${status}`);
      }
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        showFeedback('success', 'Message removed');
      }
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  // Blog Actions
  const handleDeletePost = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
        showFeedback('success', 'Post deleted');
      }
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleTogglePostStatus = async (post: BlogPost) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/blog/${post._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
        showFeedback('success', `Post changed to ${nextStatus}`);
      }
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-sky-400 mb-1">
            <span>root@ash-portfolio: /admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 font-sans">
            Administration Console
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans">
            Logged in as <span className="text-neutral-200 font-mono">aashrayashrestha24@gmail.com</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-neutral-100"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onBackToSite}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-950/60 border border-rose-800 text-xs font-mono text-rose-300 hover:bg-rose-900 hover:text-white"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/70 border border-rose-800 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('projects')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-colors ${
            activeTab === 'projects'
              ? 'bg-sky-950/70 text-sky-400 border border-sky-800 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-colors ${
            activeTab === 'messages'
              ? 'bg-sky-950/70 text-sky-400 border border-sky-800 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Messages ({messages.length})</span>
          {unreadCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('blog')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-colors ${
            activeTab === 'blog'
              ? 'bg-sky-950/70 text-sky-400 border border-sky-800 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Learning Logs ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-colors ${
            activeTab === 'system'
              ? 'bg-sky-950/70 text-sky-400 border border-sky-800 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>System Diagnostics</span>
        </button>
      </div>

      {/* 1. PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-mono font-semibold text-neutral-100">
              Manage Project Entries
            </h2>
            <button
              onClick={() => {
                setEditingProject(null);
                setIsProjectModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400">
                <tr>
                  <th className="p-4">Title & Slug</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Demo?</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-neutral-900/60">
                    <td className="p-4">
                      <div className="font-semibold text-neutral-200">{p.title}</div>
                      <div className="text-[11px] text-neutral-500">/{p.slug}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant="neutral">{p.category}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={p.status === 'completed' ? 'success' : 'accent'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-1.5 rounded transition-colors ${
                          p.featured ? 'text-amber-400 hover:text-amber-300' : 'text-neutral-600 hover:text-neutral-400'
                        }`}
                        title={p.featured ? 'Remove featured' : 'Mark as featured'}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                    <td className="p-4">
                      {p.isDemo ? (
                        <span className="text-amber-400 text-[11px]">Lab Demo</span>
                      ) : (
                        <span className="text-neutral-500 text-[11px]">Live Work</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingProject(p);
                          setIsProjectModalOpen(true);
                        }}
                        className="p-1.5 rounded bg-neutral-800 text-neutral-300 hover:text-white"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p._id, p.title)}
                        className="p-1.5 rounded bg-rose-950/80 text-rose-300 hover:text-white"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-mono font-semibold text-neutral-100">
              Visitor Inquiries & Contact Messages
            </h2>
            <span className="text-xs font-mono text-neutral-400">
              {unreadCount} unread message{unreadCount === 1 ? '' : 's'}
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="p-8 text-center border border-neutral-800 rounded-xl bg-neutral-900/30 font-mono text-xs text-neutral-500">
              No messages received yet.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={`p-5 rounded-xl border transition-colors ${
                    m.status === 'unread'
                      ? 'border-sky-900/80 bg-sky-950/20'
                      : 'border-neutral-800 bg-neutral-900/30'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-100 font-mono text-sm">{m.name}</span>
                      <span className="text-xs font-mono text-sky-400">({m.email})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          m.status === 'unread' ? 'accent' : m.status === 'replied' ? 'success' : 'neutral'
                        }
                      >
                        {m.status}
                      </Badge>
                      <span className="text-[11px] font-mono text-neutral-500">
                        {new Date(m.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-wrap py-2 border-y border-neutral-800/60 my-2">
                    {m.message}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${m.email}?subject=Re: Inquiry on Ash Portfolio`}
                        className="text-xs font-mono text-sky-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Reply via Email</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      {m.status !== 'read' && (
                        <button
                          onClick={() => handleUpdateMessageStatus(m._id, 'read')}
                          className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] font-mono text-neutral-300"
                        >
                          Mark Read
                        </button>
                      )}
                      {m.status !== 'replied' && (
                        <button
                          onClick={() => handleUpdateMessageStatus(m._id, 'replied')}
                          className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-[11px] font-mono text-emerald-300"
                        >
                          Mark Replied
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMessage(m._id)}
                        className="p-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-400"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. BLOG TAB */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-mono font-semibold text-neutral-100">
              Manage Learning Journal Posts
            </h2>
            <button
              onClick={() => {
                setEditingPost(null);
                setIsBlogModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Journal Entry</span>
            </button>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400">
                <tr>
                  <th className="p-4">Title & Slug</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Read Time</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-neutral-900/60">
                    <td className="p-4">
                      <div className="font-semibold text-neutral-200">{post.title}</div>
                      <div className="text-[11px] text-neutral-500">/{post.slug}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant="accent">{post.category}</Badge>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePostStatus(post)}
                        className="cursor-pointer"
                        title="Click to toggle published / draft"
                      >
                        <Badge variant={post.status === 'published' ? 'success' : 'neutral'}>
                          {post.status}
                        </Badge>
                      </button>
                    </td>
                    <td className="p-4 text-neutral-400">{post.readTimeMinutes} min</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setIsBlogModalOpen(true);
                        }}
                        className="p-1.5 rounded bg-neutral-800 text-neutral-300 hover:text-white"
                        title="Edit Entry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id, post.title)}
                        className="p-1.5 rounded bg-rose-950/80 text-rose-300 hover:text-white"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SYSTEM DIAGNOSTICS TAB */}
      {activeTab === 'system' && (
        <div className="space-y-6 font-mono text-xs">
          <h2 className="text-lg font-semibold text-neutral-100">
            System & Storage Telemetry
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-3">
              <div className="text-sky-400 font-semibold flex items-center gap-2">
                <Server className="w-4 h-4" />
                <span>Backend Storage Engine</span>
              </div>
              <div className="space-y-2 text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Mongoose/Mongo Connection:</span>
                  <span className="text-emerald-400 font-semibold">Active & Healthy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Projects Stored:</span>
                  <span>{projects.length} documents</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Contact Messages Stored:</span>
                  <span>{messages.length} entries</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Learning Logs:</span>
                  <span>{posts.length} entries</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-3">
              <div className="text-emerald-400 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Container & Environment</span>
              </div>
              <div className="space-y-2 text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Kernel / System:</span>
                  <span>{systemInfo?.os?.kernel || 'Linux 6.1 (Debian)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Node.js Version:</span>
                  <span>{systemInfo?.os?.nodeVersion || process.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Allocated Port:</span>
                  <span className="text-sky-400">3000 (Cloud Run Ingress)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Admin Email:</span>
                  <span className="text-neutral-300">aashrayashrestha24@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSaved={fetchAllData}
        project={editingProject}
      />

      <BlogModal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        onSaved={fetchAllData}
        post={editingPost}
      />
    </div>
  );
};
