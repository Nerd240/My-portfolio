import dotenv from 'dotenv';
dotenv.config({ override: true });

import { connectToDatabase, isDbConnected, getLocalStore, saveLocalStore } from './db.js';
import { ProjectModel } from './models/Project.js';
import { BlogPostModel } from './models/BlogPost.js';
import { UserModel } from './models/User.js';
import { AuthService } from './services/auth.service.js';
import { BlogPostInput, ProjectInput } from '../src/lib/validation.js';

export const INITIAL_PROJECTS: Array<ProjectInput & { isDemo: boolean }> = [
  {
    title: 'C++ Systems Record & Memory Manager',
    slug: 'cpp-systems-record-manager',
    shortDescription: 'Command-line student and memory record system built in C++ to practice pointers, manual memory allocation, and file persistence.',
    description: 'An educational C++ console utility developed as part of 1st-semester CSIT coursework and personal experimentation. The project emphasizes explicit memory management using raw and smart pointers, structured binary/text file I/O, and structured error handling for record indexing without external libraries.',
    technologies: ['C++', 'STL', 'Make', 'GDB', 'Linux CLI'],
    category: 'Programming',
    status: 'completed',
    githubUrl: 'https://github.com/Nerd240',
    liveUrl: '',
    featured: true,
    problem: 'Understanding low-level memory allocation, segment faults, and binary stream serialization requires hands-on practice beyond simple syntax tutorials.',
    solution: 'Built a lightweight, menu-driven CLI database that loads binary student records into dynamically allocated structs, performs binary searches on sorted indexes, and saves back to disk safely.',
    features: [
      'Dynamic memory allocation for dynamic-sized record tables',
      'Binary search algorithm implementation for sorted ID lookup',
      'Data serialization to disk with header validation checks',
      'Graceful input validation to prevent buffer overflows in standard input'
    ],
    challenges: 'Handling dangling pointers during dynamic array resizing and properly closing file streams when unexpected input interrupts execution.',
    learnings: 'Gained solid intuition for stack vs heap memory, pointer arithmetic, memory leakage detection with Valgrind on Linux, and clean modular code organization in C++.',
    architecture: 'CLI Input Parser → Validation Buffer → Record Manager (Heap) → Binary File Serialization Engine',
    screenshots: [],
    isDemo: true,
  },
  {
    title: 'Python Socket Scanner & Subnet Prober',
    slug: 'python-socket-scanner',
    shortDescription: 'A multithreaded TCP port scanner and subnet ping utility developed in Python to understand networking protocols and socket connections.',
    description: 'A laboratory networking utility written in Python using native socket APIs. It scans predefined host ranges, evaluates common service ports (SSH 22, HTTP 80, HTTPS 443, MySQL 3306), and measures connection latency while respecting timeout thresholds.',
    technologies: ['Python 3', 'Sockets', 'Threading', 'IPv4 Networking'],
    category: 'Cybersecurity',
    status: 'in-progress',
    githubUrl: 'https://github.com/Nerd240',
    liveUrl: '',
    featured: true,
    problem: 'Grasping how TCP three-way handshakes work in practice and how firewalls respond to half-open or dropped SYN packets.',
    solution: 'Engineered a clean script using Python standard library socket module with a thread pool to asynchronously probe local network hosts without overwhelming network interfaces.',
    features: [
      'Multi-threaded port scanning with configurable thread worker limits',
      'Banner grabbing for known server banners (SSH, HTTP headers)',
      'CIDR subnet expansion calculation for local network sweeps',
      'Clear terminal status outputs formatted with response time metrics'
    ],
    challenges: 'Preventing thread starvation and accurately diagnosing connection timeouts versus hard resets from network filters.',
    learnings: 'Understood TCP socket lifecycles, non-blocking I/O concepts, ethical network boundary guidelines, and why raw packet crafting requires root/raw sockets.',
    architecture: 'Host Resolver → Worker Thread Pool → TCP Socket Connection Tester → Latency & Banner Collector → Console Formatter',
    screenshots: [],
    isDemo: true,
  },
  {
    title: 'MX Linux Dev Environment Automation Script',
    slug: 'mx-linux-dev-setup',
    shortDescription: 'Bash automation script to configure an MX Linux workstation with developer tooling, firewall rules, and hardened SSH defaults.',
    description: 'Bash automation script tailored for MX Linux (Debian-based). Sets up build-essential, g++, python3-venv, git, ufw firewall rules, non-root user permissions, and custom shell aliases for monitoring system resources via htop and journalctl.',
    technologies: ['Bash', 'MX Linux', 'Debian apt', 'UFW', 'Systemd/Init'],
    category: 'Linux & Systems',
    status: 'completed',
    githubUrl: 'https://github.com/Nerd240',
    liveUrl: '',
    featured: true,
    problem: 'Manually installing packages and configuring security baselines on fresh Linux installations is time-consuming and error-prone.',
    solution: 'Wrote an idempotent bash script with sanity checks, logging, and confirmation steps that configures the machine safely.',
    features: [
      'Idempotent package installation and mirror verification',
      'UFW firewall default deny incoming rules with SSH exception',
      'Automated Git and SSH keygen workflow with strict 600 file permissions',
      'Custom environment diagnostic prompt displaying IP, memory, and disk usage'
    ],
    challenges: 'Writing shell scripts that cleanly recover if apt lock files are held or network drops occur mid-installation.',
    learnings: 'Deepened command-line fluency, POSIX compliance, file permission bits (chmod/chown), and Debian package manager internals.',
    architecture: 'Sanity Checker (Root validation) → Package Manager Orchestrator → Firewall Configurator → Environment Shell Profiler',
    screenshots: [],
    isDemo: true,
  },
  {
    title: 'Personal Portfolio & Systems CMS',
    slug: 'personal-portfolio-cms',
    shortDescription: 'Full-stack portfolio and technical case-study hub built with Next.js/Express, TypeScript, MongoDB, and secure authentication.',
    description: 'This active web platform designed to document Ash\'s educational progression in computer science, system administration, and security. Features an administrative dashboard, secure session management, real-time message handling, and a systems dashboard.',
    technologies: ['TypeScript', 'Express', 'React', 'MongoDB', 'Zod', 'Tailwind CSS'],
    category: 'Full Stack',
    status: 'completed',
    githubUrl: 'https://github.com/Nerd240',
    liveUrl: 'https://github.com/Nerd240',
    featured: true,
    problem: 'Beginner developers need a credible, authentic place to showcase their real learning progress, projects, and systems knowledge without fake claims.',
    solution: 'Engineered a modern web platform with full-stack TypeScript, strict API validation schemas, MongoDB persistence with local fallback, and an admin CMS.',
    features: [
      'Full project CRUD and case study detail viewer',
      'Secure admin authentication with bcrypt and HTTP-only cookie sessions',
      'Zod schema validation on client and server boundaries',
      'Live Linux & systems status inspector',
      'Visitor contact form with database storage and admin status tracking'
    ],
    challenges: 'Ensuring seamless local development and container runtime compatibility while maintaining strict TypeScript typing across API and UI layers.',
    learnings: 'Mastered end-to-end full-stack API architecture, cookie security attributes (HttpOnly, SameSite, Secure), and accessible UI component design.',
    architecture: 'React Frontend → Express API Router → Zod Validation Middleware → Service Layer → Mongoose Models → MongoDB',
    screenshots: [],
    isDemo: false,
  }
];

export const INITIAL_POSTS: Array<BlogPostInput> = [
  {
    title: 'Why I Chose MX Linux as My Daily Driver for CS Studies',
    slug: 'why-mx-linux-daily-driver',
    excerpt: 'My experience transitioning from Windows to MX Linux for my 1st semester in CSIT, and how it fundamentally changed how I understand operating systems.',
    content: `When I started my CSIT program at RJU, I decided to switch completely to Linux as my primary operating system. After researching various distributions, I settled on MX Linux.

### Why MX Linux?
MX Linux is Debian-based, which gives it rock-solid stability and access to the vast Debian package repositories. But what stood out to me was its lightweight footprint and clean system management tools. It doesn't consume 4GB of RAM idling; it boots into less than 600MB of memory, leaving all system resources available for compiling C++ code, running local servers, and experimenting in VMs.

### What Hands-on Linux Taught Me
1. **The Filesystem Hierarchy**: Understanding \`/etc\`, \`/var/log\`, \`/usr/bin\`, and permissions (\`chmod\`, \`chown\`) is completely different when you interact with them daily.
2. **Process Management**: Using \`top\`, \`htop\`, \`ps aux\`, and \`kill\` to troubleshoot frozen processes taught me how the kernel schedules and manages resources.
3. **The Power of the Shell**: Writing small bash loops to batch-rename files or grep through system logs is faster than any GUI.

I'm still a beginner, but using Linux every day has made server concepts in my courses tangible rather than abstract.`,
    category: 'Linux',
    tags: ['MX Linux', 'Debian', 'Terminal', 'Operating Systems'],
    status: 'published',
    readTimeMinutes: 4,
  },
  {
    title: 'Learning C++ Pointers: From Confusion to Mental Models',
    slug: 'learning-cpp-pointers-mental-models',
    excerpt: 'A beginner\'s reflection on understanding pointers, memory addresses, and why memory safety is foundational to cybersecurity.',
    content: `In our first semester programming lectures, pointers were initially the most intimidating concept. Moving from simple Python variables to raw memory addresses required changing how I visualized programs.

### The Turning Point
What helped me understand pointers was using a debugger (GDB) in the Linux terminal to inspect variables:
\`\`\`bash
(gdb) print &myVar
$1 = (int *) 0x7fffffffe34c
(gdb) x/1xw 0x7fffffffe34c
0x7fffffffe34c: 0x0000002a
\`\`\`
Seeing the actual hexadecimal memory address and the 4-byte integer stored at that location made the abstraction click. A pointer isn't magic; it's simply a variable whose content happens to be a number representing a memory address.

### The Security Connection
This is also where my interest in cybersecurity started connecting with programming. When you understand how buffer overflows occur—how writing past an array boundary overwrites adjacent memory on the stack—you realize that secure coding starts with respecting memory limits.`,
    category: 'Programming',
    tags: ['C++', 'Pointers', 'Memory Management', 'Security'],
    status: 'published',
    readTimeMinutes: 5,
  },
  {
    title: 'Hardware Diagnostics: Lessons from Repairing Mobile Devices',
    slug: 'hardware-diagnostics-phone-repair-lessons',
    excerpt: 'How troubleshooting and repairing phone hardware taught me patience, methodical diagnosis, and respect for physical hardware.',
    content: `Alongside software, I have a strong interest in phone hardware repair and electronics diagnostics. Taking apart a smartphone to replace a broken display, damaged charging port, or failing battery requires precision and a calm approach.

### Key Skills Learned:
- **Component Isolation**: When a device doesn't turn on, you test the power rail, battery voltage, and display before assuming the mainboard is dead. This diagnostic mindset directly translates to debugging software and network issues.
- **Micro-soldering & Cable Integrity**: Working with fragile ribbon cables taught me that one torn pin can disable touch input or cellular reception.
- **Physical Device Security**: Working with hardware has given me a deeper appreciation for secure enclaves, biometric sensors, and why physical access is a major vector in hardware security.

Understanding the physical layer makes software feel less like an abstract cloud and more like instructions running on real silicon.`,
    category: 'Server Management',
    tags: ['Hardware', 'Diagnostics', 'Mobile Repair', 'Electronics'],
    status: 'published' as const,
    readTimeMinutes: 3,
  }
];

export async function runSeed(): Promise<void> {
  console.log('[Seed] Starting seed process...');
  const connected = await connectToDatabase();

  const adminEmail = (process.env.ADMIN_EMAIL || 'aashrayashrestha24@gmail.com').toLowerCase().trim();
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!process.env.ADMIN_PASSWORD) throw new Error('ADMIN_PASSWORD is not set');

  if (connected && isDbConnected()) {
    console.log('[Seed] Seeding MongoDB database...');
    // Seed Admin
    const existingAdmin = await UserModel.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const passwordHash = await AuthService.hashPassword(adminPass);
      await UserModel.create({
        email: adminEmail,
        passwordHash,
        role: 'admin',
      });
      console.log('[Seed] Created admin account in MongoDB:', adminEmail);
    }

    // Seed Projects
    for (const p of INITIAL_PROJECTS) {
      const exists = await ProjectModel.findOne({ slug: p.slug });
      if (!exists) {
        await ProjectModel.create(p);
        console.log('[Seed] Created project in MongoDB:', p.title);
      }
    }

    // Seed Posts
    for (const post of INITIAL_POSTS) {
      const exists = await BlogPostModel.findOne({ slug: post.slug });
      if (!exists) {
        await BlogPostModel.create(post);
        console.log('[Seed] Created blog post in MongoDB:', post.title);
      }
    }
  } else {
    console.log('[Seed] Populating local document store with initial seed data...');
    const store = getLocalStore();

    // Ensure Admin
    const existingUser = store.users?.find((u) => u.email.toLowerCase() === adminEmail);
    if (!existingUser) {
      const passwordHash = await AuthService.hashPassword(adminPass);
      store.users = store.users || [];
      store.users.push({
        _id: 'admin_seed_1',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log('[Seed] Created admin account in local store:', adminEmail);
    }

    // Ensure Projects
    store.projects = store.projects || [];
    for (const p of INITIAL_PROJECTS) {
      if (!store.projects.some((item) => item.slug === p.slug)) {
        store.projects.push({
          ...p,
          _id: 'proj_' + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        console.log('[Seed] Created project in local store:', p.title);
      }
    }

    // Ensure Posts
    store.posts = store.posts || [];
    for (const post of INITIAL_POSTS) {
      if (!store.posts.some((item) => item.slug === post.slug)) {
        store.posts.push({
          ...post,
          _id: 'post_' + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        console.log('[Seed] Created blog post in local store:', post.title);
      }
    }

    saveLocalStore(store);
  }

  console.log('[Seed] Seeding completed successfully.');
}

// If invoked directly from CLI
if (process.argv[1]?.endsWith('seed.ts')) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
}
