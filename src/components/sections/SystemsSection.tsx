import React, { useEffect, useState } from 'react';
import { Terminal, Server, Shield, Cpu, HardDrive, Wifi, Activity, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { TerminalWindow } from '../ui/TerminalWindow';

interface SystemStatus {
  developer: string;
  education: string;
  careerFocus: string;
  os: {
    primary: string;
    kernel: string;
    arch: string;
    platform: string;
    nodeVersion: string;
    uptimeSeconds: number;
    memory: {
      totalMb: number;
      freeMb: number;
    };
  };
  services: Array<{ name: string; status: string; port?: number }>;
}

export const SystemsSection: React.FC = () => {
  const [telemetry, setTelemetry] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/system/status')
      .then((res) => res.json())
      .then((data) => {
        setTelemetry(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to load system status:', err);
        setLoading(false);
      });
  }, []);

  const systemsKnowledge = [
    {
      domain: 'Linux Operating System',
      description: 'MX Linux (Debian base) running as daily driver on workstation. Shell fluency and daily administrative habits.',
      status: 'Practicing' as const,
      topics: [
        'Filesystem Hierarchy (/etc, /var/log, /proc, /sys)',
        'Debian package management (apt, dpkg, repository mirrors)',
        'Process tree monitoring (top, htop, ps aux, signals)',
        'POSIX Shell scripting & environment automation',
      ],
    },
    {
      domain: 'Server & Service Administration',
      description: 'Foundational concepts in hosting, service lifecycles, and remote server access.',
      status: 'Learning' as const,
      topics: [
        'SSH key authentication & sshd_config hardening',
        'Service orchestration via systemd & SysV init',
        'Log aggregation & troubleshooting with journalctl',
        'Basic reverse proxying & containerization basics',
      ],
    },
    {
      domain: 'Networking Fundamentals',
      description: 'Practical exploration of IPv4, TCP/UDP sockets, port allocation, and packet routing.',
      status: 'Practicing' as const,
      topics: [
        'TCP 3-way handshake & connection state models',
        'Socket programming in Python (client-server architecture)',
        'Subnetting & local CIDR range discovery',
        'DNS resolution pipeline & hosts configuration',
      ],
    },
    {
      domain: 'System Security Baselines',
      description: 'Developing defensive mindset through principle of least privilege and attack surface reduction.',
      status: 'Learning' as const,
      topics: [
        'Linux user permissions (chmod, chown, sticky & SUID bits)',
        'UFW / iptables default-deny firewall policies',
        'Secure password hashing with bcrypt & salt rounds',
        'HTTP-only, SameSite secure cookie management',
      ],
    },
  ];

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase tracking-wider mb-2">
          <Server className="w-4 h-4" />
          <span>Infrastructure & OS Lab</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 font-sans">
          Systems & Server Management
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-3xl leading-relaxed font-sans">
          Ash’s career vision is anchored in cybersecurity and server management. Rather than treating the operating system as an abstraction, Ash uses MX Linux as a daily driver and actively studies systems architecture from the ground up.
        </p>
      </div>

      {/* Live Node Telemetry Card */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
          <div className="flex items-center gap-2.5 font-mono text-sm text-neutral-200">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-semibold">Node & Runtime Telemetry</span>
          </div>
          <Badge variant="success">Runtime: Operational</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-lg">
            <div className="text-neutral-500 mb-1 flex items-center gap-1">
              <Server className="w-3 h-3 text-sky-400" /> OS Base
            </div>
            <div className="text-neutral-200 font-medium truncate">
              {telemetry ? telemetry.os.primary : 'MX Linux 23.3'}
            </div>
          </div>

          <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-lg">
            <div className="text-neutral-500 mb-1 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-emerald-400" /> Architecture
            </div>
            <div className="text-neutral-200 font-medium truncate">
              {telemetry ? `${telemetry.os.platform} (${telemetry.os.arch})` : 'Linux x64'}
            </div>
          </div>

          <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-lg">
            <div className="text-neutral-500 mb-1 flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-amber-400" /> Memory Pool
            </div>
            <div className="text-neutral-200 font-medium truncate">
              {telemetry ? `${telemetry.os.memory.freeMb} MB free / ${telemetry.os.memory.totalMb} MB` : 'Monitoring'}
            </div>
          </div>

          <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-lg">
            <div className="text-neutral-500 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-purple-400" /> Engine Uptime
            </div>
            <div className="text-neutral-200 font-medium truncate">
              {telemetry ? `${Math.floor(telemetry.os.uptimeSeconds / 60)}m active` : 'Active'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Terminal Showcase */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>Interactive Workstation Shell</span>
          </h3>
          <span className="text-xs font-mono text-neutral-500">Try running 'help' or 'cat /etc/os-release'</span>
        </div>
        <TerminalWindow />
      </div>

      {/* Systems Focus Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {systemsKnowledge.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 hover:border-neutral-700 transition-colors space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-neutral-100 font-mono">
                {item.domain}
              </h4>
              <Badge variant={item.status === 'Practicing' ? 'success' : 'accent'}>
                {item.status}
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              {item.description}
            </p>

            <ul className="space-y-2 pt-2 border-t border-neutral-800/60 font-mono text-xs text-neutral-300">
              {item.topics.map((top, tIdx) => (
                <li key={tIdx} className="flex items-start gap-2">
                  <span className="text-sky-400">›</span>
                  <span>{top}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
