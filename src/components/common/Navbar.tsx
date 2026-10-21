import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  Bell,
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Users,
  Building2,
  Menu,
  X,
  Flame,
  Award,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Navbar: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    currentRole,
    isPublicMode,
    switchRole,
    language,
    setLanguage,
    theme,
    toggleTheme,
    setActiveView,
    firebaseUser,
    signInGoogle,
    signOutUser,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rolesList: { role: UserRole | 'PUBLIC'; label: string; icon: any; desc: string }[] = [
    { role: 'STUDENT', label: 'Student Portal', icon: GraduationCap, desc: 'Aarav (Grade 10) • Learn, Build, Prove' },
    { role: 'TEACHER', label: 'Teacher Studio', icon: Briefcase, desc: 'Prof. Ananya • Lessons, Grading, Projects' },
    { role: 'SCHOOL_ADMIN', label: 'School Admin', icon: Building2, desc: 'Principal Marcus • Apex STEM Academy' },
    { role: 'SUPER_ADMIN', label: 'Super Admin', icon: ShieldAlert, desc: 'Dr. Evelyn • Multi-School & AI Monitor' },
    { role: 'PARENT', label: 'Parent Portal', icon: Users, desc: 'Vikram & Priya • Child Mastery & Alerts' },
    { role: 'PUBLIC', label: 'Public Website', icon: Globe, desc: 'Landing Page, Curriculum & Pricing' },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#705CF6]/20 bg-[#0B1020]/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Mobile toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && !isPublicMode && (
            <button
              onClick={onToggleSidebar}
              className="mr-1 rounded-lg p-2 text-slate-400 hover:bg-[#151D30] hover:text-white md:hidden"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div
            onClick={() => {
              if (isPublicMode) setActiveView('public_home');
              else switchRole('PUBLIC');
            }}
            className="flex cursor-pointer items-center gap-2.5 group"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#705CF6] via-[#45D6C6] to-[#705CF6] p-[1.5px] transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0B1020]">
                <Sparkles className="h-5 w-5 text-[#45D6C6]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-[#45D6C6] transition-colors">
                  Aether<span className="text-[#45D6C6]">Learn</span>
                </span>
                <span className="hidden sm:inline-block rounded-full bg-[#705CF6]/20 px-2 py-0.5 text-[10px] font-semibold text-[#705CF6] border border-[#705CF6]/30">
                  AI K-12
                </span>
              </div>
              <p className="hidden md:block text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                Learn → Build → Prove
              </p>
            </div>
          </div>
        </div>

        {/* Public Navigation Tabs (when in public mode) */}
        {isPublicMode && (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveView('public_home')}
              className="hover:text-white transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('public_curriculum')}
              className="hover:text-white transition-colors"
            >
              K-12 Curriculum
            </button>
            <button
              onClick={() => setActiveView('public_schools')}
              className="hover:text-white transition-colors"
            >
              For Schools
            </button>
            <button
              onClick={() => setActiveView('public_pricing')}
              className="hover:text-white transition-colors"
            >
              Subscriptions
            </button>
            <button
              onClick={() => setActiveView('public_blog')}
              className="hover:text-white transition-colors"
            >
              AI Insights
            </button>
          </nav>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak & XP for student */}
          {!isPublicMode && currentRole === 'STUDENT' && (
            <div className="hidden sm:flex items-center gap-3 rounded-full bg-[#151D30] px-3 py-1 border border-[#705CF6]/20 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-semibold" title="14-day study streak">
                <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>14d</span>
              </div>
              <div className="h-3 w-[1px] bg-slate-700" />
              <div className="flex items-center gap-1 text-[#45D6C6] font-semibold" title="Experience Points">
                <Award className="h-4 w-4" />
                <span>{currentUser.xp || 3450} XP</span>
              </div>
            </div>
          )}

          {/* Multilingual Selector (English, Hindi, Marathi) */}
          <div className="relative">
            <button
              onClick={() => {
                setLangDropdownOpen(!langDropdownOpen);
                setRoleDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-[#151D30] px-2.5 py-1.5 text-xs font-medium text-slate-300 border border-[#705CF6]/20 hover:border-[#45D6C6]/40 transition-colors"
              title="Select Language"
            >
              <Globe className="h-3.5 w-3.5 text-[#45D6C6]" />
              <span className="uppercase font-semibold">{language}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[#151D30] p-1.5 shadow-2xl border border-[#705CF6]/30 z-50">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code as any);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                      language === l.code
                        ? 'bg-[#705CF6] text-white font-semibold'
                        : 'text-slate-300 hover:bg-[#202b47]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="rounded-lg bg-[#151D30] p-2 text-slate-400 hover:text-white border border-[#705CF6]/20 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </button>

          {/* Role Switcher Dropdown (Primary Demo control) */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleDropdownOpen(!roleDropdownOpen);
                setLangDropdownOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#705CF6]/20 to-[#45D6C6]/20 hover:from-[#705CF6]/30 hover:to-[#45D6C6]/30 px-3 py-1.5 text-xs font-semibold text-white border border-[#705CF6]/40 transition-all shadow-sm"
              title="Switch Platform Role"
            >
              <div className="h-2 w-2 rounded-full bg-[#45D6C6] animate-pulse" />
              <span className="hidden sm:inline">Role:</span>
              <span className="text-[#45D6C6]">
                {isPublicMode ? 'Public' : currentRole.replace('_', ' ')}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-300" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#151D30] p-2 shadow-2xl border border-[#705CF6]/30 z-50">
                <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
                  Switch Persona / Demo Role
                </div>
                <div className="mt-1 space-y-1">
                  {rolesList.map((item) => {
                    const Icon = item.icon;
                    const isActive = isPublicMode ? item.role === 'PUBLIC' : currentRole === item.role;
                    return (
                      <button
                        key={item.role}
                        onClick={() => {
                          switchRole(item.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left transition-all ${
                          isActive
                            ? 'bg-[#705CF6]/30 border border-[#705CF6]/60 text-white'
                            : 'text-slate-300 hover:bg-[#202b47]'
                        }`}
                      >
                        <div
                          className={`mt-0.5 rounded-lg p-1.5 ${
                            isActive ? 'bg-[#705CF6] text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{item.label}</span>
                            {isActive && (
                              <span className="text-[10px] font-semibold text-[#45D6C6]">Active</span>
                            )}
                          </div>
                          <p className="truncate text-[11px] text-slate-400">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Google Firebase Auth */}
          {firebaseUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700/60">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-[11px] font-bold text-white truncate max-w-[120px]">
                  {firebaseUser.displayName || 'Google User'}
                </span>
                <span className="text-[9px] text-[#45D6C6] font-mono">Firestore Connected</span>
              </div>
              <button
                onClick={signOutUser}
                title="Sign out of Google"
                className="rounded-lg p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#151D30] transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={signInGoogle}
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-[#151D30] hover:bg-[#202b47] px-3 py-1.5 text-xs font-semibold text-slate-200 border border-[#705CF6]/30 hover:border-[#45D6C6]/50 transition-colors"
              title="Sign in with your Google account"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.13C3.28 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.27C.46 8.22 0 10.05 0 12s.46 3.78 1.27 5.4l4.01-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.28 2.64 1.27 6.6l4.01 3.13c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Google Sign-In</span>
            </button>
          )}

          {/* User Avatar */}
          {!isPublicMode && (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-700/60">
              <img
                src={firebaseUser?.photoURL || currentUser.avatar}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-[#705CF6]/40"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
