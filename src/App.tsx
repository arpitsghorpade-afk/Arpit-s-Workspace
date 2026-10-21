/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { SchoolAdminDashboard } from './components/school/SchoolAdminDashboard';
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { PublicWebsite } from './components/public/PublicWebsite';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentRole, isPublicMode, toasts, removeToast } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020] text-[#F8FAFC]">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Main Container */}
      <div className="flex-1 flex w-full">
        {/* Sidebar (Rendered when in dashboard modes) */}
        {!isPublicMode && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {isPublicMode ? (
            <PublicWebsite />
          ) : (
            <>
              {currentRole === 'STUDENT' && <StudentDashboard />}
              {currentRole === 'TEACHER' && <TeacherDashboard />}
              {currentRole === 'SCHOOL_ADMIN' && <SchoolAdminDashboard />}
              {currentRole === 'SUPER_ADMIN' && <SuperAdminDashboard />}
              {currentRole === 'PARENT' && <ParentDashboard />}
            </>
          )}
        </main>
      </div>

      {/* Toast Notifications Overlay */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
          {toasts.map((toast) => {
            const icons = {
              success: <CheckCircle2 className="h-5 w-5 text-[#45D6C6] shrink-0" />,
              info: <Info className="h-5 w-5 text-[#705CF6] shrink-0" />,
              warning: <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />,
              error: <XCircle className="h-5 w-5 text-rose-400 shrink-0" />,
            };

            return (
              <div
                key={toast.id}
                className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-[#151D30] p-4 border border-[#705CF6]/40 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                {icons[toast.type]}
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-white">{toast.title}</h5>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="rounded-lg p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
