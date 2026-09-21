import React from 'react';
import { ArrowRight, Terminal, FolderGit2, BookOpen, Server, Sparkles } from 'lucide-react';
import { Project, BlogPost } from '../../types';
import { HeroSection } from '../sections/HeroSection';
import { ProjectCard } from '../projects/ProjectCard';
import { BlogCard } from '../blog/BlogCard';
import { TerminalWindow } from '../ui/TerminalWindow';
import { Badge } from '../ui/Badge';

interface HomeViewProps {
  projects: Project[];
  posts: BlogPost[];
  onNavigateTab: (tab: string) => void;
  onSelectProject: (slug: string) => void;
  onSelectPost: (slug: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  projects,
  posts,
  onNavigateTab,
  onSelectProject,
  onSelectPost,
}) => {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 4);
  const recentPosts = posts.slice(0, 2);

  return (
    <div className="space-y-16 py-4">
      {/* 1. Hero Section */}
      <HeroSection
        onViewProjects={() => onNavigateTab('projects')}
        onContact={() => onNavigateTab('contact')}
        onViewResume={() => onNavigateTab('resume')}
      />

      {/* 2. Featured Projects */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase tracking-wider mb-1">
              <FolderGit2 className="w-4 h-4" />
              <span>Selected Works</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 font-sans">
              Foundational Projects
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('projects')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 hover:text-sky-300 transition-colors"
          >
            <span>Explore all {projects.length} case studies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onSelect={onSelectProject}
            />
          ))}
        </div>
      </section>

      {/* 3. Systems & Interactive Terminal Preview */}
      <section className="space-y-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider mb-1">
              <Server className="w-4 h-4" />
              <span>Daily Workstation Environment</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-100 font-sans">
              MX Linux Workstation Shell
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-1">
              Ash uses MX Linux (Debian base) as a daily driver. Test interactive commands in this virtual workstation terminal.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('systems')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-200 hover:text-white hover:border-neutral-500 transition-colors self-start sm:self-center"
          >
            <span>Systems & Linux Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <TerminalWindow />
      </section>

      {/* 4. Recent Learning Log Entries */}
      {recentPosts.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Technical Notes</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 font-sans">
                Recent Learning Logs
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('blog')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 hover:text-sky-300 transition-colors"
            >
              <span>View all journal entries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPosts.map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                onSelect={onSelectPost}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. Direct Connect Banner */}
      <section className="p-8 rounded-xl border border-neutral-800 bg-neutral-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-neutral-100 font-sans">
            Have feedback, advice, or an opportunity?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans">
            Ash is always eager to learn from experienced developers, systems engineers, and academic peers.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('contact')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs sm:text-sm font-semibold transition-colors shrink-0 cursor-pointer min-h-[44px]"
        >
          <span>Send a Direct Message</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
