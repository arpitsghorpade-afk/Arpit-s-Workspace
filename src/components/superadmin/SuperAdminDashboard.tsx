import React, { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  Users,
  Cpu,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Plus,
  Check,
  AlertTriangle,
  Globe,
  Save,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SuperAdminDashboard: React.FC = () => {
  const { currentUser, activeView, setActiveView, schools, registerSchool, addToast } = useApp();

  // School Onboarding Modal
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [schoolCity, setSchoolCity] = useState('');
  const [schoolCountry, setSchoolCountry] = useState('India');
  const [schoolPlan, setSchoolPlan] = useState<'Starter' | 'Pro Academy' | 'Global Enterprise'>('Pro Academy');

  // SEO Settings State
  const [seoTitle, setSeoTitle] = useState('AetherLearn AI - K-12 AI Education SaaS Platform');
  const [seoDescription, setSeoDescription] = useState(
    'Futuristic AI-powered education ecosystem for Grade 1-12 students with adaptive AI tutoring, real-world project workspaces, and verified skill passports.'
  );
  const [seoKeywords, setSeoKeywords] = useState('AI Education, K-12 STEM, Gemini Tutor, Skill Passport, EdTech SaaS');

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) return;

    registerSchool({
      name: schoolName,
      city: schoolCity || 'Global Campus',
      country: schoolCountry,
      plan: schoolPlan,
      studentCount: 450,
      teacherCount: 28,
    });

    setShowSchoolModal(false);
    setSchoolName('');
    setSchoolCity('');
  };

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'SEO Metadata Updated',
      message: 'Canonical tags, OpenGraph share cards, and JSON-LD schema have been synced.',
    });
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#151D30] via-[#1A233D] to-[#151D30] p-6 sm:p-8 border border-[#705CF6]/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/30">
                PLATFORM ROOT COMMAND
              </span>
              <span className="rounded-full bg-[#45D6C6]/20 px-3 py-1 text-xs font-semibold text-[#45D6C6] border border-[#45D6C6]/30">
                AetherLearn Global OS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Super Admin: <span className="text-[#45D6C6]">{currentUser.name}</span>
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Global multi-tenant infrastructure, AI token consumption guardrails, SaaS recurring revenue, and student data security.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#0B1020]/80 p-4 rounded-2xl border border-[#705CF6]/30 backdrop-blur-md">
            <div>
              <div className="text-2xl font-black text-[#45D6C6]">{schools.length}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Partner Campuses</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-700" />
            <div>
              <div className="text-2xl font-black text-white">5,200</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Global Students</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
          {[
            { id: 'super_overview', label: 'Command Overview', icon: ShieldAlert },
            { id: 'super_schools', label: 'Schools Management', icon: Building2 },
            { id: 'super_ai', label: 'AI Usage & Safety', icon: Cpu },
            { id: 'super_revenue', label: 'SaaS Revenue & MRR', icon: TrendingUp },
            { id: 'super_security', label: 'Security & Audit Logs', icon: ShieldCheck },
            { id: 'super_seo', label: 'SEO & Metadata Editor', icon: Sparkles },
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

      {/* VIEW: COMMAND OVERVIEW */}
      {activeView === 'super_overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Monthly Recurring Revenue', val: '$48,500', change: '+18.2% MoM', color: 'text-[#45D6C6]' },
              { label: 'Active Partner Schools', val: `${schools.length}`, change: '4 Global Campuses', color: 'text-white' },
              { label: 'Monthly Gemini Tokens', val: '15.19M', change: 'Model: gemini-3.8-flash', color: 'text-[#705CF6]' },
              { label: 'Platform Safety Rate', val: '99.98%', change: 'Kid-Safe Guardrails Active', color: 'text-emerald-400' },
            ].map((kpi, i) => (
              <div key={i} className="rounded-2xl bg-[#151D30] p-5 border border-[#705CF6]/20">
                <span className="text-xs text-slate-400 font-medium">{kpi.label}</span>
                <div className={`text-2xl font-black ${kpi.color} mt-1`}>{kpi.val}</div>
                <div className="text-[10px] text-slate-500 mt-1">{kpi.change}</div>
              </div>
            ))}
          </div>

          {/* Quick Schools Table */}
          <div className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#45D6C6]" />
                  Provisioned School Tenants
                </h3>
                <span className="text-xs text-slate-400">Strict tenant data isolation enforced</span>
              </div>
              <button
                onClick={() => setShowSchoolModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#705CF6] hover:bg-[#5d48e6] px-4 py-2 text-xs font-bold text-white"
              >
                <Plus className="h-4 w-4" />
                <span>Onboard School</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700/60 text-slate-400">
                    <th className="pb-3 font-semibold">School Name</th>
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">Students</th>
                    <th className="pb-3 font-semibold">Subscription Plan</th>
                    <th className="pb-3 font-semibold">AI Consumption</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {schools.map((sch) => (
                    <tr key={sch.id} className="hover:bg-[#0B1020]/40">
                      <td className="py-3 font-bold text-white">{sch.name}</td>
                      <td className="py-3 text-slate-300">
                        {sch.city}, {sch.country}
                      </td>
                      <td className="py-3 text-slate-300">{sch.studentCount} Students</td>
                      <td className="py-3">
                        <span className="rounded bg-[#705CF6]/20 text-[#705CF6] font-semibold px-2 py-0.5 text-[10px]">
                          {sch.plan}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300">{(sch.aiTokensUsedMonth / 1000000).toFixed(2)}M Tokens</td>
                      <td className="py-3">
                        <span className="rounded-full bg-emerald-400/20 text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                          {sch.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SCHOOLS MANAGEMENT */}
      {activeView === 'super_schools' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#45D6C6]" />
                Institutional School Network
              </h2>
              <p className="text-xs text-slate-400">Manage school tenant provisioning and district license agreements.</p>
            </div>
            <button
              onClick={() => setShowSchoolModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#705CF6] to-[#45D6C6] px-4 py-2 text-xs font-bold text-white shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Provision New School</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schools.map((sch) => (
              <div
                key={sch.id}
                className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#705CF6]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#705CF6]">
                      {sch.code}
                    </span>
                    <span className="rounded-full bg-emerald-400/20 text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                      {sch.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2">{sch.name}</h3>
                  <p className="text-xs text-slate-400">
                    {sch.city}, {sch.country} • Contact: {sch.contactEmail}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#0B1020] p-3 rounded-xl border border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">Students</span>
                    <div className="font-bold text-white">{sch.studentCount}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Teachers</span>
                    <div className="font-bold text-white">{sch.teacherCount}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Plan</span>
                    <div className="font-bold text-[#45D6C6]">{sch.plan}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Provision Modal */}
          {showSchoolModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="w-full max-w-md rounded-3xl bg-[#151D30] p-6 border border-[#705CF6]/40 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Provision New School Tenant</h3>
                <form onSubmit={handleCreateSchool} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">School Full Name</label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. Cambridge International STEM"
                      className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Campus City</label>
                    <input
                      type="text"
                      value={schoolCity}
                      onChange={(e) => setSchoolCity(e.target.value)}
                      placeholder="e.g. Pune / London"
                      className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subscription Tier</label>
                    <select
                      value={schoolPlan}
                      onChange={(e) => setSchoolPlan(e.target.value as any)}
                      className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700"
                    >
                      <option value="Starter">Starter (Up to 500 students)</option>
                      <option value="Pro Academy">Pro Academy (Up to 1,500 students)</option>
                      <option value="Global Enterprise">Global Enterprise (Unlimited seats + API pool)</option>
                    </select>
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSchoolModal(false)}
                      className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-[#0B1020]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#705CF6] hover:bg-[#5d48e6] px-5 py-2 text-xs font-bold text-white"
                    >
                      Provision School
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: AI USAGE & SAFETY MONITOR */}
      {activeView === 'super_ai' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#151D30] p-6 sm:p-8 border border-[#705CF6]/30 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="rounded-full bg-[#45D6C6]/20 px-3 py-1 text-xs font-bold text-[#45D6C6] border border-[#45D6C6]/30">
                  REAL-TIME TELEMETRY
                </span>
                <h2 className="text-xl font-bold text-white mt-2">Gemini AI Usage & Kid-Safe Filter Monitor</h2>
                <p className="text-xs text-slate-300">
                  Active Model: <code className="text-[#45D6C6]">gemini-3.8-flash</code> • Socratic Pedagogy Enforced
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-[#0B1020] border border-slate-800">
                <div className="text-xs text-slate-400">Average Inference Latency</div>
                <div className="text-2xl font-black text-[#45D6C6] mt-1">420 ms</div>
                <div className="text-[10px] text-emerald-400 mt-1">High throughput SLA</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1020] border border-slate-800">
                <div className="text-xs text-slate-400">Total Monthly Inquiries</div>
                <div className="text-2xl font-black text-white mt-1">142,850</div>
                <div className="text-[10px] text-slate-500 mt-1">Avg 27 queries per student</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1020] border border-slate-800">
                <div className="text-xs text-slate-400">Child Safety Filter Rejections</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">0 Inappropriate</div>
                <div className="text-[10px] text-slate-500 mt-1">100% Kid-Safe Compliance</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SEO & METADATA CONFIG */}
      {activeView === 'super_seo' && (
        <div className="rounded-3xl bg-[#151D30] p-6 sm:p-8 border border-[#705CF6]/30 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="rounded-full bg-[#705CF6]/20 px-3 py-1 text-xs font-bold text-[#705CF6] border border-[#705CF6]/30">
                SEARCH ENGINE OPTIMIZATION
              </span>
              <h2 className="text-xl font-bold text-white mt-2">Public Portal SEO & Schema.org Editor</h2>
              <p className="text-xs text-slate-400">
                Configures metadata, OpenGraph cards, Twitter cards, and structured schema for Google search indexing.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSeo} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Global Meta Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description</label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Keywords</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#705CF6] to-[#45D6C6] px-5 py-2.5 text-xs font-bold text-white hover:opacity-95 shadow-md"
            >
              <Save className="h-4 w-4" />
              <span>Save & Publish SEO Configuration</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
