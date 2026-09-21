import React from 'react';
import { ArrowRight, Terminal, Github, Linkedin, FileText, Shield, Server, Cpu } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { Badge } from '../ui/Badge';

interface HeroSectionProps {
  onViewProjects: () => void;
  onContact: () => void;
  onViewResume: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onViewProjects,
  onContact,
  onViewResume,
}) => {
  return (
    <section className="py-12 sm:py-20 border-b border-neutral-800">
      <div className="max-w-4xl space-y-6">
        {/* Status Pill */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-neutral-900 border border-neutral-800 text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>RJU — CSIT, 1st Semester</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-neutral-900 border border-neutral-800 text-neutral-400">
            <Terminal className="w-3 h-3 text-sky-400" />
            <span>Daily Driver: MX Linux</span>
          </span>
        </div>

        {/* Primary Name & Heading */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-100 font-sans">
              {siteConfig.displayName}
            </h1>
            <span className="text-xl sm:text-3xl text-neutral-500 font-sans font-normal">
              ({siteConfig.name})
            </span>
          </div>
          <p className="text-lg sm:text-xl font-mono text-sky-400 font-medium">
            Cybersecurity / Server Management / Software Development
          </p>
        </div>

        {/* Concise Objective Bio */}
        <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed font-sans">
          Early-career Computer Science & Information Technology student actively building strong foundations in software development, Linux systems, and server management. Daily driver is MX Linux; core programming focus in C++ and Python, complemented by modern web and backend development.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onViewProjects}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-mono text-sm font-semibold transition-colors shadow-sm cursor-pointer min-h-[44px]"
          >
            <span>View Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onContact}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 text-neutral-200 border border-neutral-700 font-mono text-sm font-medium transition-colors cursor-pointer min-h-[44px]"
          >
            <span>Contact Me</span>
          </button>

          <button
            onClick={onViewResume}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 font-mono text-sm transition-colors cursor-pointer min-h-[44px]"
          >
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Resume</span>
          </button>
        </div>

        {/* Verified Social Channels */}
        <div className="pt-4 flex items-center gap-4 text-xs font-mono text-neutral-400">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-neutral-100 transition-colors"
          >
            <Github className="w-3.5 h-3.5 text-neutral-300" />
            <span>GitHub (Nerd240)</span>
          </a>
          <span className="text-neutral-700">•</span>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-sky-400 transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5 text-sky-400" />
            <span>LinkedIn Profile</span>
          </a>
          <span className="text-neutral-700">•</span>
          <span className="text-emerald-400 font-mono flex items-center gap-1">
            <Shield className="w-3 h-3" /> Honest Student Profile
          </span>
        </div>
      </div>
    </section>
  );
};
