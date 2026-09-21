import React from 'react';
import { ArrowLeft, Github, ExternalLink, Cpu, CheckCircle2, AlertTriangle, BookOpen, Layers, Terminal } from 'lucide-react';
import { Project } from '../../types';
import { Badge } from '../ui/Badge';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  return (
    <article className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-neutral-100 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to all projects</span>
      </button>

      {/* Header */}
      <header className="space-y-4 pb-8 border-b border-neutral-800">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{project.category}</Badge>
          <Badge variant={project.status === 'completed' ? 'success' : 'accent'}>
            {project.status === 'in-progress' ? 'In Progress' : project.status}
          </Badge>
          {project.isDemo && (
            <Badge variant="warning">Practice Lab Experiment</Badge>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-100">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-sans">
          {project.shortDescription}
        </p>

        {/* Links bar */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-sm font-mono text-neutral-200 hover:text-white hover:border-neutral-500 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Source Repository</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-950/80 border border-sky-700 text-sm font-mono text-sky-300 hover:text-white hover:bg-sky-900 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demonstration</span>
            </a>
          )}
        </div>

        {/* Tech badges */}
        <div className="pt-2">
          <div className="text-xs font-mono text-neutral-400 mb-2 uppercase tracking-wider">
            Technologies & Tools
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((t, i) => (
              <span
                key={i}
                className="text-xs font-mono bg-neutral-800 text-neutral-200 px-2.5 py-1 rounded border border-neutral-700"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <div className="py-8 space-y-10 text-neutral-300 leading-relaxed">
        {/* Full Overview */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2 font-mono">
            <span className="text-sky-400">01.</span> Project Overview
          </h2>
          <p className="text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </section>

        {/* The Problem */}
        <section className="space-y-3 bg-neutral-900/40 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2 font-mono">
            <span className="text-amber-400">02.</span> The Technical Problem
          </h2>
          <p className="text-neutral-300 font-sans leading-relaxed">
            {project.problem}
          </p>
        </section>

        {/* Solution & Implementation */}
        <section className="space-y-3 bg-neutral-900/40 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2 font-mono">
            <span className="text-emerald-400">03.</span> Solution & Implementation Approach
          </h2>
          <p className="text-neutral-300 font-sans leading-relaxed">
            {project.solution}
          </p>
        </section>

        {/* Key Features */}
        {project.features && project.features.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2 font-mono">
              <span className="text-sky-400">04.</span> Implemented Technical Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80 text-sm font-sans"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-neutral-200">{feat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* System Architecture */}
        {project.architecture && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2 font-mono">
              <span className="text-sky-400">05.</span> Architecture & Data Flow
            </h2>
            <div className="p-4 bg-[#090b0e] border border-neutral-800 rounded-lg font-mono text-xs sm:text-sm text-sky-300 overflow-x-auto">
              <code>{project.architecture}</code>
            </div>
          </section>
        )}

        {/* Challenges & Debugging */}
        <section className="space-y-3 border-l-2 border-amber-500/80 pl-5">
          <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Challenges & Debugging</span>
          </h2>
          <p className="text-neutral-300 font-sans leading-relaxed">
            {project.challenges}
          </p>
        </section>

        {/* What I Learned */}
        <section className="space-y-3 border-l-2 border-emerald-500/80 pl-5">
          <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2 font-mono">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>What I Learned</span>
          </h2>
          <p className="text-neutral-300 font-sans leading-relaxed">
            {project.learnings}
          </p>
        </section>
      </div>

      {/* Footer Back action */}
      <div className="pt-8 border-t border-neutral-800 flex justify-between items-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Projects</span>
        </button>

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono text-neutral-400 hover:text-neutral-200"
          >
            Inspect Git History →
          </a>
        )}
      </div>
    </article>
  );
};
