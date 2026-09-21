import React from 'react';
import { Code, Terminal, Server, Shield, Database, Smartphone, Wrench, Layout } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const SkillsSection: React.FC = () => {
  const categories = [
    {
      title: 'Programming & Systems Core',
      icon: Code,
      description: 'Foundational languages used for coursework, algorithms, and system utilities.',
      skills: [
        { name: 'C++', level: 'Practicing' as const, detail: 'Pointers, manual memory allocation, STL, structs, file I/O streams.' },
        { name: 'Python', level: 'Practicing' as const, detail: 'Socket programming, automation scripts, threading, data parsing.' },
        { name: 'Bash', level: 'Practicing' as const, detail: 'Workstation automation, shell loops, pipelining, grep/sed/awk.' },
        { name: 'C', level: 'Learning' as const, detail: 'Procedural fundamentals, memory segmentation, standard libraries.' },
      ],
    },
    {
      title: 'Linux & Operating Systems',
      icon: Terminal,
      description: 'Used daily as the primary operating system on Ash’s main machine (MX Linux).',
      skills: [
        { name: 'MX Linux (Debian base)', level: 'Familiar' as const, detail: 'Primary daily driver; package curation, system initialization.' },
        { name: 'Linux Command Line', level: 'Familiar' as const, detail: 'Navigation, pipe workflows, file management, text processing.' },
        { name: 'Package Management', level: 'Familiar' as const, detail: 'Debian apt, dpkg, building from source with make.' },
        { name: 'Process & System Troubleshooting', level: 'Practicing' as const, detail: 'htop, ps, kill signals, journalctl log inspection.' },
        { name: 'Basic Sysadmin', level: 'Learning' as const, detail: 'User management, file ownership, service lifecycle controls.' },
      ],
    },
    {
      title: 'Cybersecurity Foundations',
      icon: Shield,
      description: 'Active learning direction focusing on defensive principles and systems security.',
      skills: [
        { name: 'Security Fundamentals', level: 'Learning' as const, detail: 'Confidentiality, Integrity, Availability (CIA), threat models.' },
        { name: 'Linux Security Baselines', level: 'Practicing' as const, detail: 'File permissions (chmod, chown, SUID), UFW firewall rules.' },
        { name: 'Web Security Basics', level: 'Learning' as const, detail: 'OWASP Top 10 awareness: SQL/NoSQL injection, broken auth.' },
        { name: 'Networking Fundamentals', level: 'Practicing' as const, detail: 'TCP/IP 4-layer model, handshake lifecycles, port scanning.' },
        { name: 'Secure Coding Principles', level: 'Learning' as const, detail: 'Input sanitization, boundary checks, zero plaintext secrets.' },
      ],
    },
    {
      title: 'Backend & Server Development',
      icon: Server,
      description: 'Server-side architectures, REST APIs, and authentication mechanisms.',
      skills: [
        { name: 'Express & Node.js', level: 'Practicing' as const, detail: 'RESTful endpoints, middleware routing, error handlers.' },
        { name: 'Authentication & Cookies', level: 'Practicing' as const, detail: 'Bcrypt password hashing, JWT session cookies with HttpOnly.' },
        { name: 'Data Validation (Zod)', level: 'Practicing' as const, detail: 'Schema boundaries on incoming request payloads and env vars.' },
        { name: 'Next.js Backend', level: 'Learning' as const, detail: 'Route handlers, server components, and API integration.' },
      ],
    },
    {
      title: 'Databases & Persistence',
      icon: Database,
      description: 'Document models and schema validation for persistent data.',
      skills: [
        { name: 'MongoDB', level: 'Practicing' as const, detail: 'Collections, queries, document filtering, index optimization.' },
        { name: 'Mongoose ODM', level: 'Practicing' as const, detail: 'Schema design, timestamps, lifecycle methods, typed models.' },
      ],
    },
    {
      title: 'Frontend Development',
      icon: Layout,
      description: 'Technologies used for building user interfaces for Ash’s projects.',
      skills: [
        { name: 'HTML5 & CSS3', level: 'Familiar' as const, detail: 'Semantic structures, responsive layouts, flexbox, grid.' },
        { name: 'React', level: 'Practicing' as const, detail: 'Component architecture, state hooks, props, responsive rendering.' },
        { name: 'TypeScript', level: 'Practicing' as const, detail: 'Static type checking, interfaces, strict compiler options.' },
        { name: 'Tailwind CSS', level: 'Practicing' as const, detail: 'Utility-first styling, CSS variable design tokens, responsive UI.' },
      ],
    },
    {
      title: 'Hardware & Mobile Repair',
      icon: Smartphone,
      description: 'Hands-on practical experience diagnosing and repairing physical electronics.',
      skills: [
        { name: 'Phone Hardware Diagnostics', level: 'Familiar' as const, detail: 'Disassembly, board inspection, troubleshooting no-power issues.' },
        { name: 'Component Replacement', level: 'Familiar' as const, detail: 'Screens, battery packs, charging ports, ribbon flex cables.' },
        { name: 'Physical Troubleshooting', level: 'Practicing' as const, detail: 'Multimeter rail testing, understanding device micro-architecture.' },
      ],
    },
    {
      title: 'Developer Tooling & Workflow',
      icon: Wrench,
      description: 'Environment utilities and version control systems used daily.',
      skills: [
        { name: 'Git & GitHub', level: 'Familiar' as const, detail: 'Branching, commit conventions, remote repos (Nerd240).' },
        { name: 'Terminal / CLI Workflows', level: 'Familiar' as const, detail: 'tmux/split terminals, keyboard shortcuts, config dotfiles.' },
        { name: 'VS Code & Neovim', level: 'Familiar' as const, detail: 'Code editors configured for C++, Python, and TypeScript.' },
        { name: 'GDB (GNU Debugger)', level: 'Learning' as const, detail: 'Stepping through C++ code, inspecting stack frames and memory.' },
      ],
    },
  ];

  const getLevelVariant = (level: string) => {
    switch (level) {
      case 'Familiar':
        return 'success';
      case 'Practicing':
        return 'accent';
      case 'Learning':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-10 py-4">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 font-sans">
          Technical Skills & Familiarity Map
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed font-sans">
          Organized by domain with honest status ratings. No arbitrary percentage bars (e.g. &ldquo;95% Python&rdquo;); each skill is mapped to actual hands-on activities and projects.
        </p>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-4 text-xs font-mono">
          <span className="text-neutral-500">Status Legend:</span>
          <span className="inline-flex items-center gap-1.5">
            <Badge variant="success">Familiar</Badge>
            <span className="text-neutral-400">Consistent daily usage</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Badge variant="accent">Practicing</Badge>
            <span className="text-neutral-400">Actively building lab projects</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Badge variant="warning">Learning</Badge>
            <span className="text-neutral-400">Current coursework / study</span>
          </span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => {
          const IconComp = cat.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-4 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sky-400">
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-100 font-mono">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-neutral-800/60">
                {cat.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-xs text-neutral-200">
                        {skill.name}
                      </span>
                      <Badge variant={getLevelVariant(skill.level)} size="sm">
                        {skill.level}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-sans">
                      {skill.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
