export interface SiteConfig {
  name: string;
  displayName: string;
  tagline: string;
  bioSummary: string;
  email: string;
  github: string;
  linkedin: string;
  education: {
    institution: string;
    program: string;
    semester: string;
    details: string;
    previous: {
      institution: string;
      details: string;
    };
  };
  currentLevel: string;
  careerDirection: string[];
  os: {
    primary: string;
    experience: string;
    notes: string;
  };
  languages: string[];
  secondaryInterests: {
    title: string;
    description: string;
    items: string[];
  };
}

export const siteConfig: SiteConfig = {
  name: "Aashraya Shrestha",
  displayName: "Ash",
  tagline: "CSIT student developing practical foundations in software engineering, Linux systems, server administration, and cybersecurity.",
  bioSummary: "Currently studying in my 1st semester of CSIT at RJU. My daily driver is MX Linux, and I spend my time building foundational projects in C++, Python, and full-stack web technologies while practicing Linux server administration and secure software fundamentals.",
  email: "aashrayashrestha24@gmail.com",
  github: "https://github.com/Nerd240",
  linkedin: "https://www.linkedin.com/in/aashraya-shrestha-152570365/",
  education: {
    institution: "RJU",
    program: "B.Sc. CSIT (Computer Science & Information Technology)",
    semester: "1st Semester",
    details: "Focusing on core computing foundations, C/C++ programming principles, discrete mathematics, and computer systems architecture.",
    previous: {
      institution: "Caspian Valley College",
      details: "Completed high school / +2 science curriculum with strong analytical and physics grounding."
    }
  },
  currentLevel: "Beginner / Early-Career Student",
  careerDirection: [
    "Cybersecurity",
    "Server Management & Linux Systems",
    "Software Development"
  ],
  os: {
    primary: "MX Linux (Debian-based)",
    experience: "Used as primary daily operating system for development, shell scripting, package management, and system maintenance.",
    notes: "Appreciates lightweight resource utilization, systemd/init flexibility, and granular command-line process management."
  },
  languages: ["C++", "Python", "TypeScript", "JavaScript", "Bash"],
  secondaryInterests: {
    title: "Hardware Repair & Device Diagnostics",
    description: "Hands-on interest in understanding physical compute architectures from the component level up.",
    items: [
      "Phone hardware diagnostics & teardowns",
      "Screen, battery, and flex cable replacements",
      "Board-level component inspection and solder safety",
      "Bridging the connection between physical electronics and software systems"
    ]
  }
};
