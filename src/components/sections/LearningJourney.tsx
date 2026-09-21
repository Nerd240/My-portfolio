import React from 'react';
import { BookOpen, Terminal, Code, Server, Shield, Network, Cpu, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const LearningJourney: React.FC = () => {
  const steps = [
    {
      title: 'Academic Computing Foundations',
      institution: 'RJU — CSIT, 1st Semester (Tribhuvan Affiliated)',
      status: 'Current Focus' as const,
      statusVariant: 'success' as const,
      period: 'Present',
      icon: BookOpen,
      details: 'Mastering core computer fundamentals, discrete mathematics, digital logic, and structured problem solving in C/C++. Prior science foundation at Caspian Valley College.',
    },
    {
      title: 'Systems Programming: C++ & Python',
      institution: 'Coursework & Personal Labs',
      status: 'Practicing' as const,
      statusVariant: 'accent' as const,
      period: 'Active',
      icon: Code,
      details: 'Writing console tools, understanding manual pointer arithmetic, heap vs stack memory, binary file streams, and Python socket programming for network automation.',
    },
    {
      title: 'Linux as Daily Driver (MX Linux)',
      institution: 'Daily Workstation Practice',
      status: 'Daily Habit' as const,
      statusVariant: 'success' as const,
      period: 'Active',
      icon: Terminal,
      details: 'Using MX Linux exclusively for development. Fluency in bash, apt package management, file permissions (chmod/chown), process trees (ps, htop), and shell scripting.',
    },
    {
      title: 'Full-Stack Web & Backend APIs',
      institution: 'Self-Directed Projects',
      status: 'Building' as const,
      statusVariant: 'accent' as const,
      period: 'Active',
      icon: Server,
      details: 'Developing real full-stack web applications with React, TypeScript, Express, and MongoDB. Practicing Zod validation, HTTP-only session cookies, and REST APIs.',
    },
    {
      title: 'Computer Networking & Sockets',
      institution: 'Lab Probing & Protocol Study',
      status: 'Exploring' as const,
      statusVariant: 'neutral' as const,
      period: 'In Progress',
      icon: Network,
      details: 'Studying TCP/IP stack layers, socket communication, port discovery, subnetting, DNS resolution, and latency diagnostics.',
    },
    {
      title: 'Cybersecurity Fundamentals & Linux Hardening',
      institution: 'Long-Term Specialization Track',
      status: 'Early Study' as const,
      statusVariant: 'warning' as const,
      period: 'Roadmap',
      icon: Shield,
      details: 'Developing defensive security mindset: least privilege principle, SSH key authentication, UFW firewall configurations, OWASP top 10 awareness, and secure coding in C++.',
    },
    {
      title: 'Server Management & Infrastructure',
      institution: 'Systems Administration Goal',
      status: 'Roadmap' as const,
      statusVariant: 'neutral' as const,
      period: 'Planned Next',
      icon: Cpu,
      details: 'Expanding into systemd service automation, reverse proxying, Linux logs inspection (journalctl), containerization with Docker, and basic VPS deployments.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-800 pb-4">
        <h3 className="text-xl font-bold tracking-tight text-neutral-100 font-sans">
          Technical Learning Journey & Roadmap
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-neutral-400 font-sans">
          An honest progression roadmap. As an early-career student, Ash prioritizes solid fundamentals over premature claims of expertise.
        </p>
      </div>

      <div className="relative border-l border-neutral-800 ml-4 sm:ml-6 space-y-8 py-2">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          return (
            <div key={idx} className="relative pl-6 sm:pl-8 group">
              {/* Timeline marker icon */}
              <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-sky-400 group-hover:border-sky-500 transition-colors">
                <IconComponent className="w-3 h-3" />
              </div>

              <div className="p-4 sm:p-5 rounded-xl border border-neutral-800/80 bg-neutral-900/30 group-hover:bg-neutral-900/60 group-hover:border-neutral-700 transition-colors space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-neutral-100 font-mono text-sm sm:text-base">
                    {step.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant={step.statusVariant}>{step.status}</Badge>
                    <span className="text-[11px] font-mono text-neutral-500">{step.period}</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-neutral-400 font-medium">
                  {step.institution}
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed pt-1">
                  {step.details}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
