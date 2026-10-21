import React, { useState } from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  TrendingUp,
  Award,
  BookOpen,
  Plus,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SchoolAdminDashboard: React.FC = () => {
  const { currentUser, activeView, setActiveView, courses, addToast } = useApp();

  const [searchFaculty, setSearchFaculty] = useState('');
  const [facultyList, setFacultyList] = useState([
    {
      id: 'f1',
      name: 'Prof. Ananya Sharma',
      email: 'ananya.sharma@apexstem.edu',
      dept: 'Artificial Intelligence & Robotics',
      grades: 'Grades 7, 10',
      activeClasses: 3,
      status: 'ACTIVE',
    },
    {
      id: 'f2',
      name: 'Dr. Michael Chen',
      email: 'm.chen@apexstem.edu',
      dept: 'Astrophysics & Advanced Mechanics',
      grades: 'Grades 10, 11',
      activeClasses: 4,
      status: 'ACTIVE',
    },
    {
      id: 'f3',
      name: 'Sarah Jenkins',
      email: 's.jenkins@apexstem.edu',
      dept: 'Mathematics & Linear Algebra',
      grades: 'Grades 9, 10, 12',
      activeClasses: 5,
      status: 'ACTIVE',
    },
    {
      id: 'f4',
      name: 'Clara Reed',
      email: 'c.reed@apexstem.edu',
      dept: 'Primary STEM & Discovery',
      grades: 'Grades 3, 4, 5',
      activeClasses: 4,
      status: 'ACTIVE',
    },
  ]);

  const [studentCohorts] = useState([
    { grade: 'Grade 1-2', label: 'Primary Foundations', count: 210, avgMastery: 89 },
    { grade: 'Grade 3-5', label: 'Upper Elementary Discovery', count: 340, avgMastery: 91 },
    { grade: 'Grade 6-8', label: 'Middle School Innovators', count: 390, avgMastery: 88 },
    { grade: 'Grade 9-10', label: 'High School Builders', count: 280, avgMastery: 93 },
    { grade: 'Grade 11-12', label: 'Senior High Scholars', count: 200, avgMastery: 95 },
  ]);

  const filteredFaculty = facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(searchFaculty.toLowerCase()) ||
      f.dept.toLowerCase().includes(searchFaculty.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#151D30] via-[#1A233D] to-[#151D30] p-6 sm:p-8 border border-[#705CF6]/25 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-[#45D6C6]/20 px-3 py-1 text-xs font-bold text-[#45D6C6] border border-[#45D6C6]/30">
                CAMPUS ADMINISTRATION
              </span>
              <span className="rounded-full bg-[#705CF6]/20 px-3 py-1 text-xs font-semibold text-[#705CF6] border border-[#705CF6]/30">
                AFSA-2026
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {currentUser.schoolName || 'Apex Futuristic STEM Academy'}
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Campus executive overview: Faculty deployment, student cohorts, institutional curriculum pacing, and AI compute allocation.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#0B1020]/80 p-4 rounded-2xl border border-[#705CF6]/30 backdrop-blur-md">
            <div>
              <div className="text-2xl font-black text-[#45D6C6]">1,420</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Enrolled</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-700" />
            <div>
              <div className="text-2xl font-black text-white">78</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Faculty Staff</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
          {[
            { id: 'school_overview', label: 'Campus Dashboard', icon: Building2 },
            { id: 'school_teachers', label: 'Faculty Directory', icon: Users },
            { id: 'school_students', label: 'Student Cohorts (Gr 1-12)', icon: GraduationCap },
            { id: 'school_analytics', label: 'Academic Mastery Reports', icon: TrendingUp },
            { id: 'school_subscription', label: 'Institutional Subscription', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-[#705CF6] text-white shadow-lg shadow-[#705CF6]/30'
                    : 'bg-[#151D30]/80 text-slate-300 hover:bg-[#202b47] hover:text-white border border-[#705CF6]/15'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW: OVERVIEW */}
      {(activeView === 'school_overview' || activeView === 'school_analytics') && (
        <div className="space-y-8">
          {/* Key KPI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Campus Completion Rate', val: '94.2%', change: '+3.1% vs last term', color: 'text-[#45D6C6]' },
              { label: 'AI Tutor Queries', val: '48.2k', change: 'Grade 1-12 inquiries', color: 'text-[#705CF6]' },
              { label: 'Verified Skill Passports', val: '864', change: 'Capstone projects minted', color: 'text-amber-400' },
              { label: 'Parent Engagement', val: '92.6%', change: 'Weekly active guardians', color: 'text-emerald-400' },
            ].map((kpi, i) => (
              <div key={i} className="rounded-2xl bg-[#151D30] p-5 border border-[#705CF6]/20">
                <span className="text-xs text-slate-400 font-medium">{kpi.label}</span>
                <div className={`text-2xl font-black ${kpi.color} mt-1`}>{kpi.val}</div>
                <div className="text-[10px] text-slate-500 mt-1">{kpi.change}</div>
              </div>
            ))}
          </div>

          {/* Grade Cohort Performance Table */}
          <div className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#45D6C6]" />
              Grade-by-Grade Enrollment & Curriculum Mastery
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700/60 text-slate-400">
                    <th className="pb-3 font-semibold">Cohort</th>
                    <th className="pb-3 font-semibold">Category Focus</th>
                    <th className="pb-3 font-semibold">Enrolled Students</th>
                    <th className="pb-3 font-semibold">Mastery Benchmark</th>
                    <th className="pb-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {studentCohorts.map((cohort, idx) => (
                    <tr key={idx} className="hover:bg-[#0B1020]/40 transition-colors">
                      <td className="py-3.5 font-bold text-white">{cohort.grade}</td>
                      <td className="py-3.5 text-slate-300">{cohort.label}</td>
                      <td className="py-3.5 text-slate-300">{cohort.count} Students</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#705CF6] to-[#45D6C6]"
                              style={{ width: `${cohort.avgMastery}%` }}
                            />
                          </div>
                          <span className="text-[#45D6C6] font-bold">{cohort.avgMastery}%</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <button
                          onClick={() => {
                            addToast({
                              type: 'info',
                              title: `Inspecting ${cohort.grade}`,
                              message: 'Opening cohort roster and assignment analytics.',
                            });
                          }}
                          className="text-xs text-[#705CF6] hover:text-[#45D6C6] font-semibold"
                        >
                          View Cohort
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: FACULTY DIRECTORY */}
      {activeView === 'school_teachers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-[#45D6C6]" />
                Faculty & Department Instructors
              </h2>
              <p className="text-xs text-slate-400">Manage STEM, AI, and Science faculty credentials and class loads.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchFaculty}
                  onChange={(e) => setSearchFaculty(e.target.value)}
                  placeholder="Search faculty..."
                  className="rounded-xl bg-[#0B1020] pl-9 pr-4 py-2 text-xs text-white border border-slate-700"
                />
              </div>
              <button
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Onboard Faculty',
                    message: 'New teacher invitation link generated.',
                  });
                }}
                className="flex items-center gap-1.5 rounded-xl bg-[#705CF6] px-4 py-2 text-xs font-bold text-white hover:bg-[#5d48e6]"
              >
                <Plus className="h-4 w-4" />
                <span>Onboard Teacher</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFaculty.map((fac) => (
              <div
                key={fac.id}
                className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">{fac.name}</h4>
                    <span className="text-xs text-[#45D6C6]">{fac.dept}</span>
                    <p className="text-xs text-slate-400 mt-1">{fac.email}</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-bold">
                    {fac.status}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                  <span>Assigned: {fac.grades}</span>
                  <span className="font-semibold text-white">{fac.activeClasses} Active Cohorts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: INSTITUTIONAL SUBSCRIPTION */}
      {activeView === 'school_subscription' && (
        <div className="rounded-3xl bg-[#151D30] p-6 sm:p-8 border border-[#705CF6]/30 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="rounded-full bg-[#45D6C6]/20 px-3 py-1 text-xs font-bold text-[#45D6C6] border border-[#45D6C6]/30">
                ACTIVE INSTITUTIONAL LICENSE
              </span>
              <h2 className="text-2xl font-black text-white mt-2">Global Enterprise School Plan</h2>
              <p className="text-xs text-slate-300 mt-1">
                Full-campus access for Grades 1-12 with unlimited Gemini AI Socratic tutoring, teacher studio, and Skill Passport minting.
              </p>
            </div>

            <div className="bg-[#0B1020] p-4 rounded-2xl border border-slate-700 text-right">
              <span className="text-xs text-slate-400">Annual Contract</span>
              <div className="text-2xl font-black text-[#45D6C6]">$24,000 / yr</div>
              <span className="text-[10px] text-emerald-400 font-semibold">Active through Aug 2027</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-[#0B1020] border border-slate-800">
              <div className="text-xs text-slate-400">Student Seat Utilization</div>
              <div className="text-xl font-black text-white mt-1">1,420 / 2,000 Seats</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-[#45D6C6]" style={{ width: '71%' }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1020] border border-slate-800">
              <div className="text-xs text-slate-400">Gemini 3.8 Flash Token Pool</div>
              <div className="text-xl font-black text-white mt-1">4.82M / 10M Tokens</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-[#705CF6]" style={{ width: '48%' }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1020] border border-slate-800">
              <div className="text-xs text-slate-400">Skill Passport Quota</div>
              <div className="text-xl font-black text-white mt-1">Unlimited Minting</div>
              <div className="text-[11px] text-[#45D6C6] mt-2 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> High-Trust Verification
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
