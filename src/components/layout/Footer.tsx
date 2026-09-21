import React from 'react';
import { Github, Linkedin, Mail, Shield, Terminal, ArrowUp, Lock } from 'lucide-react';
import { siteConfig } from '../../config/site';

interface FooterProps {
  onNavigateAdmin: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAdmin, onNavigateTab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400 font-sans text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-neutral-100 text-base">{siteConfig.displayName}</span>
              <span className="text-neutral-500">—</span>
              <span className="text-neutral-300 font-medium">{siteConfig.name}</span>
            </div>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-md leading-relaxed">
              CSIT student at RJU building practical foundations in C++, Python, Linux systems, and web architectures. Targeting future specializations in cybersecurity and server management.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-sky-400 hover:border-neutral-700 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-sky-400 hover:border-neutral-700 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-sky-400 hover:border-neutral-700 transition-colors"
                aria-label="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <div className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold">
              Site Map
            </div>
            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <button onClick={() => onNavigateTab('about')} className="hover:text-sky-400 transition-colors">
                  /about — Background & Timeline
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('skills')} className="hover:text-sky-400 transition-colors">
                  /skills — Categorized Technical Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('projects')} className="hover:text-sky-400 transition-colors">
                  /projects — Case Studies & Code
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('systems')} className="hover:text-sky-400 transition-colors">
                  /systems — Linux & Infrastructure
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('blog')} className="hover:text-sky-400 transition-colors">
                  /blog — Learning Journal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('resume')} className="hover:text-sky-400 transition-colors">
                  /resume — Printable Document
                </button>
              </li>
            </ul>
          </div>

          {/* System Specs & Admin Entry */}
          <div className="space-y-3">
            <div className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold">
              Workstation & Host
            </div>
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-3 text-xs font-mono space-y-1 text-neutral-400">
              <div className="flex justify-between">
                <span>OS:</span>
                <span className="text-neutral-200">MX Linux 23.3</span>
              </div>
              <div className="flex justify-between">
                <span>Kernel:</span>
                <span className="text-neutral-200">Debian 6.1 LTS</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Driver:</span>
                <span className="text-emerald-400 font-medium">100% Linux</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-sky-400">Learning & Building</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onNavigateAdmin}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-300 transition-colors focus:outline-none"
                title="Admin Control Center"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Console</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            © {new Date().getFullYear()} {siteConfig.name}. Built with honesty — practical foundations over exaggerated claims.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
