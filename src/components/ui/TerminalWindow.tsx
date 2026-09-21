import React, { useState } from 'react';
import { Terminal, Shield, Check, Copy } from 'lucide-react';

interface TerminalWindowProps {
  title?: string;
  defaultCommand?: string;
  initialOutput?: string[];
  interactive?: boolean;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  title = 'ash@mx-linux: ~',
  defaultCommand = 'neofetch --stdout',
  initialOutput,
  interactive = true,
}) => {
  const [history, setHistory] = useState<Array<{ cmd: string; output: string[] }>>([
    {
      cmd: defaultCommand,
      output: initialOutput || [
        'OS: MX Linux 23.3 (Libretto) x86_64',
        'Host: CSIT Lab Workstation',
        'Kernel: Linux 6.1.0-28-amd64 (Debian 12)',
        'Uptime: Active CSIT Semester 1',
        'Packages: 1942 (dpkg)',
        'Shell: bash 5.2.15',
        'Terminal: xfce4-terminal / JetBrains Mono',
        'Core Languages: C++, Python 3.11, TypeScript',
        'Primary Focus: Systems Programming, Linux Sysadmin, Network Security',
      ],
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    let output: string[] = [];
    const lower = trimmed.toLowerCase();

    if (lower === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (lower === 'help') {
      output = [
        'Available commands:',
        '  whoami          - Display current user identity & role',
        '  uname -a        - Show operating system and kernel info',
        '  cat /etc/os-release - Inspect MX Linux distribution details',
        '  education       - View academic status at RJU',
        '  languages       - List active programming languages',
        '  security        - View security learning focus areas',
        '  clear           - Clear terminal output',
      ];
    } else if (lower === 'whoami') {
      output = ['ash (Aashraya Shrestha) - 1st Semester CSIT Student building towards Cybersecurity & Server Management.'];
    } else if (lower === 'uname -a') {
      output = ['Linux mx-workstation 6.1.0-28-amd64 #1 SMP PREEMPT_DYNAMIC Debian x86_64 GNU/Linux'];
    } else if (lower === 'cat /etc/os-release' || lower.includes('os-release')) {
      output = [
        'PRETTY_NAME="MX Linux 23.3 Libretto"',
        'NAME="MX"',
        'VERSION_ID="23.3"',
        'VERSION="23.3 (Libretto)"',
        'ID="mx"',
        'ID_LIKE="debian"',
        'HOME_URL="https://mxlinux.org"',
      ];
    } else if (lower === 'education') {
      output = [
        'Institution: RJU (Tribhuvan / Affiliated CSIT)',
        'Degree: Bachelor of Science in Computer Science & Information Technology',
        'Semester: 1st Semester',
        'Previous: Caspian Valley College (Science)',
      ];
    } else if (lower === 'languages') {
      output = [
        '• C++ (Pointers, Memory allocation, STL, OOP foundations)',
        '• Python (Socket programming, scripts, automation)',
        '• TypeScript / JavaScript (Full-stack APIs, Next.js, Express)',
        '• Bash (Debian package scripting, system maintenance)',
      ];
    } else if (lower === 'security') {
      output = [
        '[Cybersecurity Focus - Early Learning Phase]',
        '• Linux file permissions (chmod, chown, SUID bits)',
        '• SSH key generation & hardened sshd_config principles',
        '• Network packet inspection & TCP handshake fundamentals',
        '• Web app OWASP Top 10 awareness (Injection, Broken Auth)',
        '• Hardware security & component isolation during repair',
      ];
    } else {
      output = [`bash: command not found: ${trimmed}. Type 'help' for available commands.`];
    }

    setHistory((prev) => [...prev, { cmd: trimmed, output }]);
    setInputVal('');
  };

  const copySession = () => {
    const text = history.map((h) => `$ ${h.cmd}\n${h.output.join('\n')}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/90 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm text-neutral-300">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="ml-2 flex items-center gap-1.5 text-neutral-400 text-xs">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold text-neutral-200">{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 bg-emerald-950/60 border border-emerald-900/60 px-2 py-0.5 rounded">
            <Shield className="w-3 h-3" /> bash v5.2
          </span>
          <button
            onClick={copySession}
            title="Copy Terminal Text"
            className="p-1 hover:text-neutral-100 text-neutral-500 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 sm:p-5 space-y-3 max-h-96 overflow-y-auto leading-relaxed bg-[#080a0d]">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400">
              <span className="text-emerald-400 font-semibold">ash@mx-linux</span>
              <span className="text-neutral-500">:</span>
              <span className="text-neutral-400">~</span>
              <span className="text-neutral-500">$</span>
              <span className="text-neutral-100 font-medium">{item.cmd}</span>
            </div>
            <div className="pl-4 border-l border-neutral-800 space-y-0.5 text-neutral-300">
              {item.output.map((line, lIdx) => (
                <div key={lIdx} className={line.startsWith('bash:') ? 'text-rose-400' : line.startsWith('•') ? 'text-sky-300' : ''}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        ))}

        {interactive && (
          <form onSubmit={handleCommand} className="flex items-center gap-2 pt-1">
            <span className="text-emerald-400 font-semibold">ash@mx-linux</span>
            <span className="text-neutral-500">:</span>
            <span className="text-neutral-400">~</span>
            <span className="text-neutral-500">$</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="type 'help' or try 'whoami', 'languages', 'clear'..."
              className="flex-1 bg-transparent border-none outline-none text-neutral-100 placeholder:text-neutral-600 font-mono text-xs sm:text-sm"
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        )}
      </div>
    </div>
  );
};
