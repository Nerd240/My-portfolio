import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { Project, ProjectCategory, ProjectStatus } from '../../types';
import { ProjectInput, projectSchema } from '../../lib/validation';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  project?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  project,
}) => {
  const [formData, setFormData] = useState<ProjectInput>({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    image: '',
    technologies: ['C++'],
    category: 'Programming',
    status: 'in-progress',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    problem: '',
    solution: '',
    features: [''],
    challenges: '',
    learnings: '',
    architecture: '',
    screenshots: [],
    isDemo: true,
  });

  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        slug: project.slug,
        shortDescription: project.shortDescription,
        description: project.description,
        image: project.image || '',
        technologies: project.technologies || [],
        category: project.category,
        status: project.status,
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        featured: Boolean(project.featured),
        problem: project.problem,
        solution: project.solution,
        features: project.features || [],
        challenges: project.challenges,
        learnings: project.learnings,
        architecture: project.architecture || '',
        screenshots: project.screenshots || [],
        isDemo: Boolean(project.isDemo),
      });
      setTechInput(project.technologies.join(', '));
      setFeatureInput((project.features || []).join('\n'));
    } else {
      setFormData({
        title: '',
        slug: '',
        shortDescription: '',
        description: '',
        image: '',
        technologies: ['C++'],
        category: 'Programming',
        status: 'in-progress',
        githubUrl: 'https://github.com/Nerd240',
        liveUrl: '',
        featured: false,
        problem: '',
        solution: '',
        features: [],
        challenges: '',
        learnings: '',
        architecture: '',
        screenshots: [],
        isDemo: true,
      });
      setTechInput('C++, Linux');
      setFeatureInput('');
    }
    setError('');
  }, [project, isOpen]);

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
      slug: !project ? autoGenerateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const techArray = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const featureArray = featureInput
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const dataToValidate: ProjectInput = {
      ...formData,
      technologies: techArray,
      features: featureArray,
    };

    const parsed = projectSchema.safeParse(dataToValidate);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Validation failed');
      return;
    }

    setLoading(true);
    try {
      const url = project ? `/api/projects/${project._id}` : '/api/projects';
      const method = project ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToValidate),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to save project');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl my-8 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <h3 className="text-lg font-mono font-semibold text-neutral-100">
            {project ? 'Edit Project' : 'Create New Project'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-100"
          >
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
              <label className="block text-neutral-400 mb-1">Project Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Slug (URL identifier) *</label>
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
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
              >
                <option value="Programming">Programming</option>
                <option value="Linux & Systems">Linux & Systems</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Backend">Backend</option>
                <option value="Hardware">Hardware</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
              >
                <option value="in-progress">in-progress</option>
                <option value="completed">completed</option>
                <option value="concept">concept</option>
                <option value="demo">demo</option>
              </select>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-neutral-700 text-sky-500"
                />
                <span>Featured</span>
              </label>

              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDemo}
                  onChange={(e) => setFormData({ ...formData, isDemo: e.target.checked })}
                  className="rounded border-neutral-700 text-amber-500"
                />
                <span>Demo Lab</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Short Description (Summary) *</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              required
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Full Detailed Overview *</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1">Technologies (comma separated) *</label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="C++, STL, Make, Linux CLI"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">GitHub Repository URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/Nerd240/..."
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1">Problem Statement *</label>
              <textarea
                rows={2}
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Technical Solution *</label>
              <textarea
                rows={2}
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Key Features (one per line)</label>
            <textarea
              rows={3}
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Dynamic memory allocation&#10;Binary search index&#10;Safe file stream handling"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1">Challenges & Debugging *</label>
              <textarea
                rows={2}
                value={formData.challenges}
                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">What I Learned *</label>
              <textarea
                rows={2}
                value={formData.learnings}
                onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Architecture / Data Flow</label>
            <input
              type="text"
              value={formData.architecture}
              onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
              placeholder="Input Parser → Buffer → Heap Allocator → Binary Serialization"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 outline-none focus:border-sky-500"
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
              <span>{project ? 'Update Project' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
