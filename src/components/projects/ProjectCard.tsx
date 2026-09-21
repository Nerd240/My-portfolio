import React from 'react';
import { Github, ExternalLink, ArrowRight, FolderGit2, AlertCircle } from 'lucide-react';
import { Project } from '../../types';
import { Badge } from '../ui/Badge';

interface ProjectCardProps {
  project: Project;
  onSelect: (slug: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'accent';
      case 'demo':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700 transition-all duration-200 p-5 sm:p-6 relative">
      <div>
        {/* Header row: category, status, demo badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="neutral">{project.category}</Badge>
            <Badge variant={getStatusVariant(project.status)}>
              {project.status === 'in-progress' ? 'In Progress' : project.status}
            </Badge>
          </div>
          {project.isDemo && (
            <span className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1 bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded">
              <AlertCircle className="w-3 h-3" /> Practice Lab
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(project.slug)}
          className="text-lg font-semibold text-neutral-100 group-hover:text-sky-400 transition-colors cursor-pointer tracking-tight"
        >
          {project.title}
        </h3>

        {/* Short description */}
        <p className="mt-2 text-sm text-neutral-400 line-clamp-3 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Tech tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 5).map((tech, i) => (
            <span
              key={i}
              className="text-[11px] font-mono bg-neutral-800/80 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700/50"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 5 && (
            <span className="text-[11px] font-mono text-neutral-500 self-center">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Footer controls: GitHub link, Live link, and Case Study button */}
      <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
              title="View Source on GitHub"
              aria-label={`GitHub source for ${project.title}`}
            >
              <Github className="w-4 h-4" />
            </a>
          ) : (
            <span className="text-xs text-neutral-600 font-mono">Local Repo</span>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-md text-neutral-400 hover:text-sky-400 hover:bg-neutral-800 transition-colors"
              title="Live Deployment"
              aria-label={`Live demo for ${project.title}`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <button
          onClick={() => onSelect(project.slug)}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-sky-400 hover:text-sky-300 transition-colors group-hover:translate-x-0.5 transform"
        >
          <span>Case Study</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
