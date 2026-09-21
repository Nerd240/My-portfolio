import React, { useState, useMemo } from 'react';
import { Search, Filter, FolderGit2, AlertCircle } from 'lucide-react';
import { Project, ProjectCategory } from '../../types';
import { ProjectCard } from '../projects/ProjectCard';
import { ProjectDetail } from '../projects/ProjectDetail';

interface ProjectsViewProps {
  projects: Project[];
  selectedProjectSlug: string | null;
  onSelectProjectSlug: (slug: string | null) => void;
  loading: boolean;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  selectedProjectSlug,
  onSelectProjectSlug,
  loading,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Programming', 'Linux & Systems', 'Cybersecurity', 'Full Stack', 'Backend'];

  const selectedProject = useMemo(() => {
    if (!selectedProjectSlug) return null;
    return projects.find((p) => p.slug === selectedProjectSlug) || null;
  }, [selectedProjectSlug, projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        project.technologies.some((t) => t.toLowerCase().includes(query)) ||
        project.problem.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => onSelectProjectSlug(null)}
      />
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase tracking-wider">
          <FolderGit2 className="w-4 h-4" />
          <span>Practical Technical Work</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-100 font-sans">
          Technical Projects & Case Studies
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-3xl leading-relaxed font-sans">
          Curated work highlighting C++, Python, Linux shell workflows, and full-stack backend development. Each case study documents the problem, architectural choices, debugging challenges, and lessons learned.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-sky-950 text-sky-300 border border-sky-800 font-semibold'
                  : 'bg-neutral-900/60 text-neutral-400 border border-neutral-800/80 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or tech..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-900/80 border border-neutral-800 rounded-lg text-xs font-mono text-neutral-200 placeholder:text-neutral-500 outline-none focus:border-sky-500 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl bg-neutral-900/30 border border-neutral-800/60 animate-pulse"
            />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center border border-neutral-800 rounded-xl bg-neutral-900/20 space-y-3">
          <AlertCircle className="w-8 h-8 text-neutral-600 mx-auto" />
          <div className="text-sm font-mono text-neutral-400">
            No projects matched the selected filters.
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-xs font-mono text-sky-400 hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onSelect={(slug) => {
                onSelectProjectSlug(slug);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
