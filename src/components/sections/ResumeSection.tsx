import React from 'react';
import { Download, Printer, FileText, Mail, Github, Linkedin, Terminal, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '../../config/site';

export const ResumeSection: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generates a clean plain text or printable markdown version
    const content = `=====================================================
AASHRAYA SHRESTHA (ASH)
CSIT Student | Aspiring Systems & Cybersecurity Engineer
Email: ${siteConfig.email}
GitHub: ${siteConfig.github}
LinkedIn: ${siteConfig.linkedin}
=====================================================

EDUCATION:
- B.Sc. CSIT (Computer Science & Information Technology), 1st Semester
  RJU (Tribhuvan Affiliated)
  Core computing foundations, C/C++ programming principles, discrete structures.

- +2 Science (Physics & Mathematics stream)
  Caspian Valley College

TECHNICAL PROFILE & FOCUS:
- Primary Operating System: MX Linux (Debian-based) used as daily driver.
- Core Languages: C++, Python
- Web & Backend: TypeScript, Node.js, Express, React, Tailwind CSS
- Databases: MongoDB, Mongoose
- Systems & Networking: Linux CLI, Bash scripting, TCP/IP sockets, SSH hardening, UFW
- Hardware: Phone hardware diagnostic repair, board-level component inspection

FOUNDATIONAL PROJECTS:
1. C++ Systems Record & Memory Manager (GitHub: Nerd240)
   - Command-line student data system with dynamic heap allocation and binary searches.
   - Practiced pointer arithmetic, memory leakage mitigation, and raw file serialization.

2. Python Socket Scanner & Subnet Prober
   - Multithreaded TCP port scanner and network sweep tool.
   - Explored socket timeouts, banner grabbing, and TCP connection handshakes.

3. MX Linux Dev Environment Automation Script
   - Bash setup script for automated package mirrors, developer tooling, and UFW rules.

4. Full-Stack Portfolio & Systems CMS
   - Production web app with Express, React, TypeScript, MongoDB, and secure session cookies.

SECONDARY INTERESTS:
- Mobile device hardware troubleshooting and micro-soldering diagnostics.
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Aashraya_Shrestha_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 font-sans">
            Curriculum Vitae / Resume
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400 font-sans">
            Accurate, unexaggerated record of Ash's current academic standing, coursework, and technical skills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-neutral-100 transition-colors cursor-pointer min-h-[40px]"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white text-xs font-mono font-semibold transition-colors cursor-pointer min-h-[40px]"
          >
            <Download className="w-4 h-4" />
            <span>Download Document</span>
          </button>
        </div>
      </div>

      {/* Printable Resume Sheet Container */}
      <div className="p-8 sm:p-12 rounded-xl border border-neutral-800 bg-neutral-950/80 shadow-2xl text-neutral-200 font-sans space-y-8">
        {/* Header */}
        <div className="border-b border-neutral-800 pb-6 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100">
                {siteConfig.name}
              </h1>
              <div className="text-sm font-mono text-sky-400">
                CSIT Student | Aspiring Systems & Security Engineer
              </div>
            </div>
            <div className="text-xs font-mono text-neutral-400 text-left sm:text-right space-y-1">
              <div>{siteConfig.email}</div>
              <div>github.com/Nerd240</div>
              <div>Daily OS: MX Linux 23</div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold border-b border-neutral-800/80 pb-1">
            Education
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <div className="flex flex-wrap justify-between font-semibold text-neutral-100">
                <span>RJU (Tribhuvan Affiliated)</span>
                <span className="text-xs font-mono text-neutral-400">2026 – Present</span>
              </div>
              <div className="text-xs text-sky-300 font-mono">B.Sc. Computer Science & Information Technology (CSIT) — 1st Semester</div>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Coursework in C programming, digital logic, discrete structures, and computer organization fundamentals.
              </p>
            </div>

            <div>
              <div className="flex flex-wrap justify-between font-semibold text-neutral-100">
                <span>Caspian Valley College</span>
                <span className="text-xs font-mono text-neutral-400">Completed</span>
              </div>
              <div className="text-xs text-neutral-400 font-mono">+2 Science Curriculum (Physics, Mathematics)</div>
            </div>
          </div>
        </div>

        {/* Technical Foundations */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold border-b border-neutral-800/80 pb-1">
            Technical Competencies & Learning Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg space-y-1">
              <span className="text-neutral-400 block font-semibold">Languages</span>
              <span className="text-neutral-200">C++ (Pointers, OOP), Python (Automation, Sockets), TypeScript/JS, Bash</span>
            </div>
            <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg space-y-1">
              <span className="text-neutral-400 block font-semibold">Operating Systems</span>
              <span className="text-neutral-200">MX Linux (Daily Driver), Debian packaging, Shell commands, CLI workflows</span>
            </div>
            <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg space-y-1">
              <span className="text-neutral-400 block font-semibold">Web & Backend</span>
              <span className="text-neutral-200">Express, React, Next.js, Node.js, REST APIs, Zod validation, HTTP-only Auth</span>
            </div>
            <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg space-y-1">
              <span className="text-neutral-400 block font-semibold">Security & Hardware</span>
              <span className="text-neutral-200">Linux permissions, UFW rules, OWASP awareness, Phone hardware diagnostic repair</span>
            </div>
          </div>
        </div>

        {/* Selected Projects */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold border-b border-neutral-800/80 pb-1">
            Selected Practical Projects
          </h2>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-neutral-100 text-sm">C++ Systems Record & Memory Manager</span>
                <span className="font-mono text-neutral-500">C++, STL, Make</span>
              </div>
              <p className="text-neutral-400 mt-1 leading-relaxed">
                Developed a dynamic command-line record system with custom heap memory allocation, pointer indexing, and binary file serialization without external frameworks.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-neutral-100 text-sm">Python Socket Scanner & Subnet Prober</span>
                <span className="font-mono text-neutral-500">Python 3, Networking</span>
              </div>
              <p className="text-neutral-400 mt-1 leading-relaxed">
                Constructed a multithreaded TCP socket prober for port scanning, network latency measurement, and banner identification on local network interfaces.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-neutral-100 text-sm">MX Linux Dev Environment Automation</span>
                <span className="font-mono text-neutral-500">Bash, Debian apt, UFW</span>
              </div>
              <p className="text-neutral-400 mt-1 leading-relaxed">
                Wrote an idempotent bash configuration script to harden fresh MX Linux installations with UFW firewall rules, SSH security defaults, and compiler toolchains.
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Interest: Hardware */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold border-b border-neutral-800/80 pb-1">
            Hands-on Hardware Diagnostics
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Experienced with mobile device teardowns, component replacement (screens, batteries, charging ports), multimeter rail testing, and physical hardware diagnostics.
          </p>
        </div>
      </div>
    </div>
  );
};
