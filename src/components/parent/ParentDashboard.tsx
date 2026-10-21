import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  CheckSquare,
  Bot,
  HeartHandshake,
  Clock,
  Award,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ParentDashboard: React.FC = () => {
  const { currentUser, parentChildren, selectedChildId, selectChild, activeView, setActiveView, addToast } = useApp();

  const currentChild = parentChildren.find((c) => c.childId === selectedChildId) || parentChildren[0];

  // Consent toggles
  const [coppaConsent, setCoppaConsent] = useState(true);
  const [aiUsageConsent, setAiUsageConsent] = useState(true);
  const [anonymizedAnalytics, setAnonymizedAnalytics] = useState(false);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#151D30] via-[#1A233D] to-[#151D30] p-6 sm:p-8 border border-[#705CF6]/25 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-[#45D6C6]/20 px-3 py-1 text-xs font-bold text-[#45D6C6] border border-[#45D6C6]/30">
                PARENT GUARDIAN PORTAL
              </span>
              <span className="rounded-full bg-[#705CF6]/20 px-3 py-1 text-xs font-semibold text-[#705CF6] border border-[#705CF6]/30">
                Apex STEM Academy
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Family Guardian Portal: <span className="text-[#45D6C6]">{currentUser.name}</span>
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Monitor academic mastery, homework assignments, AI curiosity topics, and child privacy protections.
            </p>
          </div>

          {/* Child Switcher Chips */}
          <div className="flex items-center gap-3 bg-[#0B1020]/80 p-2 rounded-2xl border border-[#705CF6]/30">
            {parentChildren.map((child) => {
              const isSelected = child.childId === currentChild.childId;
              return (
                <button
                  key={child.childId}
                  onClick={() => selectChild(child.childId)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#705CF6] text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-[#151D30]'
                  }`}
                >
                  <img src={child.avatar} alt={child.childName} className="h-6 w-6 rounded-full object-cover" />
                  <div className="text-left">
                    <div>{child.childName}</div>
                    <div className="text-[10px] font-normal opacity-80">Grade {child.grade}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
          {[
            { id: 'parent_overview', label: 'Mastery Overview', icon: Users },
            { id: 'parent_child', label: 'Subject Performance', icon: TrendingUp },
            { id: 'parent_assignments', label: 'Assignments & Lab Tasks', icon: CheckSquare },
            { id: 'parent_ai_summary', label: 'AI Tutor Safety & Topics', icon: Bot },
            { id: 'parent_consent', label: 'Child Privacy & COPPA', icon: HeartHandshake },
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

      {/* VIEW: MASTERY OVERVIEW */}
      {(activeView === 'parent_overview' || activeView === 'parent_child') && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-[#151D30] p-5 border border-[#705CF6]/20">
              <span className="text-xs text-slate-400 font-medium">Overall Academic Mastery</span>
              <div className="text-3xl font-black text-[#45D6C6] mt-1">{currentChild.overallMasteryPct}%</div>
              <div className="text-[10px] text-emerald-400 mt-1">Consistent High Performer</div>
            </div>

            <div className="rounded-2xl bg-[#151D30] p-5 border border-[#705CF6]/20">
              <span className="text-xs text-slate-400 font-medium">Weekly Study Hours</span>
              <div className="text-3xl font-black text-white mt-1">{currentChild.weeklyStudyHours} hrs</div>
              <div className="text-[10px] text-slate-400 mt-1">Goal: 10 hrs / week</div>
            </div>

            <div className="rounded-2xl bg-[#151D30] p-5 border border-[#705CF6]/20">
              <span className="text-xs text-slate-400 font-medium">Completed Lessons</span>
              <div className="text-3xl font-black text-[#705CF6] mt-1">{currentChild.completedLessonsCount}</div>
              <div className="text-[10px] text-slate-400 mt-1">Across STEM & AI Modules</div>
            </div>

            <div className="rounded-2xl bg-[#151D30] p-5 border border-[#705CF6]/20">
              <span className="text-xs text-slate-400 font-medium">AI Tutor Inquiry Health</span>
              <div className="text-lg font-bold text-amber-300 mt-2 truncate">{currentChild.aiTutorSentiment}</div>
              <div className="text-[10px] text-slate-400 mt-1">Curious & Highly Engaged</div>
            </div>
          </div>

          {/* Recent AI Exploration Highlight */}
          <div className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#705CF6] to-[#45D6C6] flex items-center justify-center text-white shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#45D6C6]">Recent Topic Explored</span>
                <h4 className="text-base font-bold text-white mt-0.5">{currentChild.recentTopicExplored}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentChild.childName} worked through 3 Socratic hint steps with the Gemini AI Tutor yesterday.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveView('parent_ai_summary')}
              className="shrink-0 text-xs font-semibold text-[#45D6C6] hover:underline"
            >
              View Full AI Log
            </button>
          </div>
        </div>
      )}

      {/* VIEW: AI TUTOR SAFETY & TOPICS */}
      {activeView === 'parent_ai_summary' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#45D6C6]" />
              Safe AI Learning Logs for {currentChild.childName} (Grade {currentChild.grade})
            </h3>
            <p className="text-xs text-slate-400">
              All AI interactions use Google AI Studio Gemini with pedagogical Socratic restrictions and kid-safe content filters.
            </p>

            <div className="space-y-3 pt-2">
              {[
                {
                  date: 'Yesterday, 04:15 PM',
                  subject: 'Artificial Intelligence',
                  inquiry: 'How do neurons determine the weighted sum before ReLU activation?',
                  pedagogy: 'AI provided 2 guiding hints leading to correct formula derivation',
                  status: 'SAFE',
                },
                {
                  date: 'Oct 19, 06:30 PM',
                  subject: 'Physics',
                  inquiry: 'Orbital velocity difference between LEO and Geostationary orbits',
                  pedagogy: 'AI explained gravitational balance with an interactive satellite analogy',
                  status: 'SAFE',
                },
                {
                  date: 'Oct 17, 03:20 PM',
                  subject: 'Mathematics',
                  inquiry: 'Eigenvalue computation for 2x2 coordinate transformation matrices',
                  pedagogy: 'AI recommended practice problem and verified step 1',
                  status: 'SAFE',
                },
              ].map((log, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#0B1020] border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{log.subject}</span>
                    <span className="rounded bg-emerald-400/20 text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-slate-300">"{log.inquiry}"</p>
                  <p className="text-slate-400 text-[11px] pt-1">
                    <strong>Tutor Interaction:</strong> {log.pedagogy} • {log.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: COPPA & PRIVACY CONTROLS */}
      {activeView === 'parent_consent' && (
        <div className="rounded-3xl bg-[#151D30] p-6 sm:p-8 border border-[#705CF6]/30 space-y-6 max-w-2xl">
          <div>
            <span className="rounded-full bg-[#45D6C6]/20 px-3 py-1 text-xs font-bold text-[#45D6C6] border border-[#45D6C6]/30">
              CHILD DATA PRIVACY (COPPA / GDPR-K)
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Guardian Consent & Privacy Protections</h2>
            <p className="text-xs text-slate-300 mt-1">
              Your child's educational data is protected with Zero-Trust isolation. We do not sell data or expose minors' information.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0B1020] border border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-white">Socratic AI Tutoring Consent</h4>
                <p className="text-[11px] text-slate-400">Allow child to interact with educational Gemini AI assistant</p>
              </div>
              <input
                type="checkbox"
                checked={aiUsageConsent}
                onChange={(e) => setAiUsageConsent(e.target.checked)}
                className="h-4 w-4 rounded accent-[#705CF6]"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0B1020] border border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-white">Skill Passport Public Verification</h4>
                <p className="text-[11px] text-slate-400">Allow cryptographic verification links for university applications</p>
              </div>
              <input
                type="checkbox"
                checked={coppaConsent}
                onChange={(e) => setCoppaConsent(e.target.checked)}
                className="h-4 w-4 rounded accent-[#705CF6]"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0B1020] border border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-white">Anonymized Pedagogical Research</h4>
                <p className="text-[11px] text-slate-400">Share non-PII metrics to improve grade curriculum</p>
              </div>
              <input
                type="checkbox"
                checked={anonymizedAnalytics}
                onChange={(e) => setAnonymizedAnalytics(e.target.checked)}
                className="h-4 w-4 rounded accent-[#705CF6]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                addToast({
                  type: 'success',
                  title: 'Privacy Preferences Saved',
                  message: 'Guardian settings have been synchronized securely.',
                });
              }}
              className="rounded-xl bg-[#705CF6] hover:bg-[#5e49e2] px-5 py-2.5 text-xs font-bold text-white shadow-md"
            >
              Save Guardian Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
