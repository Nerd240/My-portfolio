import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/views/HomeView';
import { ProjectsView } from './components/views/ProjectsView';
import { BlogView } from './components/views/BlogView';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { SystemsSection } from './components/sections/SystemsSection';
import { ResumeSection } from './components/sections/ResumeSection';
import { ContactForm } from './components/forms/ContactForm';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Project, BlogPost } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);

  // Theme state: dark mode default for technical workstation aesthetic
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('ash_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  // Admin auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize theme attribute on html root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ash_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ash_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Initial data loading & hash router initialization
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [projRes, blogRes, authRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/blog'),
          fetch('/api/auth/me'),
        ]);

        if (projRes.ok) {
          const projData = await projRes.json();
          setProjects(projData);
        }

        if (blogRes.ok) {
          const blogData = await blogRes.json();
          setPosts(blogData);
        }

        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData?.user?.role === 'admin') {
            setIsAdminLoggedIn(true);
          }
        }
      } catch (err) {
        console.warn('Initial data synchronization note:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Check window hash on initial mount
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      if (hash.startsWith('project/')) {
        setActiveTab('projects');
        setSelectedProjectSlug(hash.replace('project/', ''));
      } else if (hash.startsWith('blog/')) {
        setActiveTab('blog');
        setSelectedPostSlug(hash.replace('blog/', ''));
      } else if (['about', 'skills', 'projects', 'systems', 'blog', 'resume', 'contact', 'admin'].includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedProjectSlug(null);
    setSelectedPostSlug(null);
    window.location.hash = tab === 'home' ? '' : tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (slug: string) => {
    setSelectedProjectSlug(slug);
    setActiveTab('projects');
    window.location.hash = `project/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPost = (slug: string) => {
    setSelectedPostSlug(slug);
    setActiveTab('blog');
    window.location.hash = `blog/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAdminLoggedIn(false);
      setActiveTab('home');
    } catch (err) {
      console.warn('Logout warning:', err);
      setIsAdminLoggedIn(false);
      setActiveTab('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d11] text-neutral-100 selection:bg-sky-500/30 selection:text-sky-200 antialiased font-sans">
      {/* Top sticky navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onNavigateProjectSlug={setSelectedProjectSlug}
      />

      {/* Main content body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'home' && (
          <HomeView
            projects={projects}
            posts={posts}
            onNavigateTab={handleTabChange}
            onSelectProject={handleSelectProject}
            onSelectPost={handleSelectPost}
          />
        )}

        {activeTab === 'about' && (
          <AboutSection
            onContactClick={() => handleTabChange('contact')}
            onProjectsClick={() => handleTabChange('projects')}
          />
        )}

        {activeTab === 'skills' && <SkillsSection />}

        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            selectedProjectSlug={selectedProjectSlug}
            onSelectProjectSlug={(slug) => {
              setSelectedProjectSlug(slug);
              if (slug) {
                window.location.hash = `project/${slug}`;
              } else {
                window.location.hash = 'projects';
              }
            }}
            loading={loading}
          />
        )}

        {activeTab === 'systems' && <SystemsSection />}

        {activeTab === 'blog' && (
          <BlogView
            posts={posts}
            selectedPostSlug={selectedPostSlug}
            onSelectPostSlug={(slug) => {
              setSelectedPostSlug(slug);
              if (slug) {
                window.location.hash = `blog/${slug}`;
              } else {
                window.location.hash = 'blog';
              }
            }}
            loading={loading}
          />
        )}

        {activeTab === 'resume' && <ResumeSection />}

        {activeTab === 'contact' && (
          <div className="space-y-8 py-4">
            <div className="border-b border-neutral-800 pb-6">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-100 font-sans">
                Contact & Communication
              </h1>
              <p className="mt-2 text-sm sm:text-base text-neutral-400 font-sans">
                Reach out to Ash for discussions about computer science, C++, Linux configurations, or collaborative student projects.
              </p>
            </div>
            <ContactForm />
          </div>
        )}

        {activeTab === 'admin' && (
          <div>
            {isAdminLoggedIn ? (
              <AdminDashboard
                onLogout={handleAdminLogout}
                onBackToSite={() => handleTabChange('home')}
              />
            ) : (
              <AdminLogin
                onSuccess={() => setIsAdminLoggedIn(true)}
                onBack={() => handleTabChange('home')}
              />
            )}
          </div>
        )}
      </main>

      {/* Global site footer */}
      <Footer
        onNavigateAdmin={() => handleTabChange('admin')}
        onNavigateTab={handleTabChange}
      />
    </div>
  );
}
