import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  CheckSquare,
  Award,
  Compass,
  FolderGit2,
  Users,
  GraduationCap,
  Building2,
  ShieldCheck,
  TrendingUp,
  Cpu,
  FileCheck,
  HeartHandshake,
  LogOut,
  Sparkles,
  School as SchoolIcon,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = true,
  onClose,
}) => {
  const { currentRole, activeView, setActiveView, currentUser, switchRole } = useApp();

  type NavItem = {
    view: AppView;
    label: string;
    icon: any;
    badge?: string;
  };

  const getStudentNav = (): NavItem[] => [
    { view: 'student_overview', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'student_courses', label: 'My Courses & Lessons', icon: BookOpen, badge: '3 Active' },
    { view: 'student_tutor', label: 'AI Socratic Tutor', icon: Bot, badge: 'Gemini' },
    { view: 'student_quizzes', label: 'Practice & Quizzes', icon: CheckSquare },
    { view: 'student_projects', label: 'Project Workspace', icon: FolderGit2, badge: 'Build' },
    { view: 'student_passport', label: 'Skill Passport', icon: Award, badge: 'Prove' },
    { view: 'student_careers', label: 'Career Roadmaps', icon: Compass },
  ];

  const getTeacherNav = (): NavItem[] => [
    { view: 'teacher_overview', label: 'Teacher Dashboard', icon: LayoutDashboard },
    { view: 'teacher_studio', label: 'AI Lesson Studio', icon: Bot, badge: 'New' },
    { view: 'teacher_grading', label: 'Assignments & Grading', icon: FileCheck, badge: '2 Pending' },
    { view: 'teacher_projects', label: 'Project Verification', icon: Award, badge: '1 Review' },
  ];

  const getSchoolAdminNav = (): NavItem[] => [
    { view: 'school_overview', label: 'Campus Dashboard', icon: Building2 },
    { view: 'school_teachers', label: 'Faculty Directory', icon: Users, badge: '78' },
    { view: 'school_students', label: 'Student Cohorts', icon: GraduationCap, badge: '1,420' },
    { view: 'school_analytics', label: 'School Reports', icon: TrendingUp },
    { view: 'school_subscription', label: 'Enterprise License', icon: Award },
  ];

  const getSuperAdminNav = (): NavItem[] => [
    { view: 'super_overview', label: 'Global Command', icon: LayoutDashboard },
    { view: 'super_schools', label: 'Partner Schools', icon: SchoolIcon, badge: '4 Active' },
    { view: 'super_ai', label: 'AI Usage & Guardrails', icon: Cpu, badge: 'Live' },
    { view: 'super_revenue', label: 'SaaS & Subscriptions', icon: TrendingUp },
    { view: 'super_security', label: 'Security & Audit Logs', icon: ShieldCheck },
    { view: 'super_seo', label: 'SEO & Meta Config', icon: Sparkles },
  ];

  const getParentNav = (): NavItem[] => [
    { view: 'parent_overview', label: 'Family Dashboard', icon: LayoutDashboard },
    { view: 'parent_child', label: 'Child Mastery Reports', icon: TrendingUp },
    { view: 'parent_assignments', label: 'Homework & Submissions', icon: CheckSquare },
    { view: 'parent_ai_summary', label: 'AI Safety & Curiosities', icon: Bot },
    { view: 'parent_consent', label: 'Guardian Consent & COPPA', icon: HeartHandshake },
  ];

  let navItems: NavItem[] = [];
  if (currentRole === 'STUDENT') navItems = getStudentNav();
  else if (currentRole === 'TEACHER') navItems = getTeacherNav();
  else if (currentRole === 'SCHOOL_ADMIN') navItems = getSchoolAdminNav();
  else if (currentRole === 'SUPER_ADMIN') navItems = getSuperAdminNav();
  else if (currentRole === 'PARENT') navItems = getParentNav();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && onClose && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 flex-col border-r border-[#705CF6]/15 bg-[#0B1020] transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0 flex' : '-translate-x-full hidden md:flex'
        }`}
      >
        {/* User Card */}
        <div className="p-4 border-b border-[#705CF6]/15 bg-[#151D30]/60">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-10 w-10 rounded-xl object-cover ring-1 ring-[#45D6C6]/40"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-white truncate">{currentUser.name}</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-[#45D6C6]">
                <span className="font-semibold">{currentRole.replace('_', ' ')}</span>
                {currentUser.grade && <span>• Gr {currentUser.grade}</span>}
              </div>
            </div>
          </div>
          {currentUser.schoolName && (
            <p className="mt-2 text-[10px] text-slate-400 truncate flex items-center gap-1">
              <Building2 className="h-3 w-3 text-slate-500 shrink-0" />
              {currentUser.schoolName}
            </p>
          )}
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {currentRole.replace('_', ' ')} Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => {
                  setActiveView(item.view);
                  if (onClose) onClose();
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#705CF6]/25 to-[#45D6C6]/15 text-white border border-[#705CF6]/40 shadow-sm'
                    : 'text-slate-400 hover:bg-[#151D30] hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-lg p-1.5 transition-colors ${
                      isActive
                        ? 'bg-[#705CF6] text-white shadow-sm shadow-[#705CF6]/50'
                        : 'bg-[#151D30] text-slate-400 group-hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      isActive
                        ? 'bg-[#45D6C6]/20 text-[#45D6C6] border border-[#45D6C6]/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-[#705CF6]/15 bg-[#151D30]/30 space-y-2">
          <button
            onClick={() => switchRole('PUBLIC')}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-[#151D30] hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#45D6C6]" />
              <span>Public Landing Page</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          </button>
        </div>
      </aside>
    </>
  );
};
