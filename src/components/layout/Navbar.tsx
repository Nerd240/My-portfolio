import React, { useState } from 'react';
import { Terminal, Moon, Sun, Menu, X, Shield, FileText, ChevronRight } from 'lucide-react';
import { siteConfig } from '../../config/site';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onNavigateProjectSlug?: (slug: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  onNavigateProjectSlug,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'systems', label: 'Systems & Linux' },
    { id: 'blog', label: 'Learning Log' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    if (onNavigateProjectSlug) {
      onNavigateProjectSlug(null);
    }
    setActiveTab(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-neutral-950/85 dark:bg-neutral-950/90 border-b border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-1"
          aria-label="Go to Home"
        >
          <div className="w-8 h-8 rounded-md bg-neutral-900 border border-neutral-700 flex items-center justify-center text-sky-400 group-hover:border-sky-500 transition-colors">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-sm font-semibold tracking-tight text-neutral-100 group-hover:text-sky-400 transition-colors">
              <span>{siteConfig.displayName}</span>
              <span className="text-neutral-500">/</span>
              <span className="text-xs text-neutral-400 font-normal hidden sm:inline">mx-linux</span>
            </div>
            <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
              <span>1st Sem CSIT</span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  isActive
                    ? 'bg-neutral-800 text-sky-400 font-semibold border border-neutral-700 shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Quick Resume Link */}
          <button
            onClick={() => handleNavClick('resume')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-neutral-100 hover:border-neutral-600 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>CV</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-neutral-100 hover:border-neutral-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-400" />}
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-neutral-800 bg-neutral-950 px-4 pt-3 pb-5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 text-xs font-mono text-neutral-500 uppercase tracking-wider border-b border-neutral-900">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-neutral-800 text-sky-400 border border-neutral-700'
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-neutral-600'}`} />
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
