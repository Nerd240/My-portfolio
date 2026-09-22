import React from 'react';
import { Terminal, Shield, Server, Wrench, GraduationCap, ArrowRight, Laptop, Cpu, BookOpen } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { LearningJourney } from './LearningJourney';
import { Badge } from '../ui/Badge';

interface AboutSectionProps {
  onContactClick: () => void;
  onProjectsClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onContactClick, onProjectsClick }) => {
  return (
    <div className="space-y-16 py-4">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-8 space-y-4">
        <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>About Aashraya Shrestha (Ash)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-100 font-sans">
          Building Practical Foundations in Systems & Security
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed font-sans">
          I am a 1st-semester Computer Science and Information Technology (CSIT) student at Caspian. Rather than waiting for senior year or making exaggerated claims of seniority, I focus on hands-on consistency: writing C++ and Python daily, running Linux as my main operating system, and dissecting how servers and networks actually work.
        </p>
      </div>

      {/* Core Narrative Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8 text-neutral-300 font-sans leading-relaxed text-sm sm:text-base">
          {/* Section 1: Who I Am & Education */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-neutral-100 font-mono flex items-center gap-2">
              <span className="text-sky-400">01.</span> Academic Grounding & Current Stage
            </h2>
            <p>
              My formal computer science journey started at <strong>Caspian Valley College</strong> with a strong foundation in physics and mathematics, which prepared me to join the <strong>B.Sc. CSIT program at Caspian</strong>. In our 1st semester, we focus heavily on fundamental computing theories, procedural programming in C, and digital logic.
            </p>
            <p>
              I treat my academic syllabus as the starting baseline and supplement it with personal experiments in systems programming, Linux administration, and network analysis.
            </p>
          </section>

          {/* Section 2: Why Linux & MX Linux */}
          <section className="space-y-3 bg-neutral-900/40 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-neutral-100 font-mono flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span>The Linux Daily Driver Decision</span>
            </h2>
            <p>
              Early in my studies, I made the deliberate decision to switch to <strong>MX Linux</strong> as my primary daily driver. MX Linux provides Debian’s battle-tested stability while remaining lightweight and transparent.
            </p>
            <p>
              Daily-driving Linux forced me to interact directly with the shell, learn file permissions, investigate service failures using <code className="text-sky-400 font-mono">journalctl</code>, configure firewall rules with <code className="text-sky-400 font-mono">ufw</code>, and manage dependencies without relying on graphical setup wizards.
            </p>
          </section>

          {/* Section 3: Direction - Cybersecurity & Server Management */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-neutral-100 font-mono flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-400" />
              <span>Long-Term Direction: Security & Infrastructure</span>
            </h2>
            <p>
              My long-term career ambition centers on <strong>cybersecurity and server management</strong>. I do not call myself a &ldquo;security expert&rdquo; or &ldquo;penetration tester&rdquo; because I believe true security proficiency requires deep mastery of the layers underneath: memory layout, networking protocols, operating systems, and authentication mechanisms.
            </p>
            <p>
              By learning C++ memory pointers, analyzing TCP handshakes with Python socket scripts, and deploying full-stack web applications with secure cookie handling, I am actively constructing the foundation required for future security engineering.
            </p>
          </section>

          {/* Section 4: Beyond Software - Hardware Repair */}
          <section className="space-y-3 bg-neutral-900/40 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-neutral-100 font-mono flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-400" />
              <span>Beyond Software: Phone Hardware Diagnostics</span>
            </h2>
            <p>
              Outside of code, I have a strong hands-on interest in <strong>phone hardware diagnostics and repair</strong>. Troubleshooting physical devices—diagnosing no-power conditions, replacing delicate display panels and ribbon flex cables, and checking rail voltages with a multimeter—taught me methodical isolation skills.
            </p>
            <p>
              Physical hardware repair grounds my software mindset: software isn't just magic running in the cloud; it executes on physical chips, busses, and memory registers.
            </p>
          </section>
        </div>

        {/* Sidebar Quick Facts */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-4 font-mono text-xs">
            <div className="text-neutral-200 font-semibold text-sm border-b border-neutral-800 pb-2 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-sky-400" />
              <span>Quick Profile Overview</span>
            </div>

            <div className="space-y-3 text-neutral-300">
              <div>
                <span className="text-neutral-500 block">Name:</span>
                <span className="text-neutral-100 font-medium">Aashraya Shrestha (Ash)</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Education:</span>
                <span className="text-neutral-100 font-medium">Caspian(RJU Affiliated) — CSIT, 1st Semester</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Prior School:</span>
                <span className="text-neutral-100 font-medium">Caspian Valley College (+2)</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Workstation OS:</span>
                <span className="text-emerald-400 font-medium">MX Linux (Debian 12)</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Primary Languages:</span>
                <span className="text-neutral-100 font-medium">C++, Python, TypeScript</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Career Goal:</span>
                <span className="text-sky-400 font-medium">Cybersecurity & Servers</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Secondary Interest:</span>
                <span className="text-amber-400 font-medium">Phone Hardware Diagnostics</span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
              <button
                onClick={onProjectsClick}
                className="w-full py-2 px-3 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-center font-medium transition-colors"
              >
                View Selected Projects →
              </button>
              <button
                onClick={onContactClick}
                className="w-full py-2 px-3 rounded bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-300 text-center font-medium transition-colors"
              >
                Send Ash a Message →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Timeline */}
      <div className="pt-8 border-t border-neutral-800">
        <LearningJourney />
      </div>
    </div>
  );
};
