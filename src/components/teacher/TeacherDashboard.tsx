import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  FileCheck,
  Award,
  Sparkles,
  Bot,
  Plus,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ExternalLink,
  Loader2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    assignments,
    submissions,
    gradeSubmission,
    projects,
    verifyProject,
    courses,
    addToast,
  } = useApp();

  // AI Quiz/Lesson Studio Generator State
  const [studioGrade, setStudioGrade] = useState(10);
  const [studioSubject, setStudioSubject] = useState('Artificial Intelligence');
  const [studioTopic, setStudioTopic] = useState('Convolutional Neural Networks & Feature Maps');
  const [studioLoading, setStudioLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  // Grading form state
  const [gradingScores, setGradingScores] = useState<Record<string, number>>({});
  const [gradingFeedbacks, setGradingFeedbacks] = useState<Record<string, string>>({});

  // Project verification state
  const [verificationFeedback, setVerificationFeedback] = useState<Record<string, string>>({});

  const handleGenerateQuestions = async () => {
    setStudioLoading(true);
    try {
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: studioGrade,
          subject: studioSubject,
          topic: studioTopic,
          count: 2,
        }),
      });

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setGeneratedQuestions(data.questions);
        addToast({
          type: 'success',
          title: 'Curriculum Generated with Gemini!',
          message: `Created 2 Socratic assessment questions for Grade ${studioGrade}.`,
        });
      } else {
        // Fallback demo questions if API key is not configured
        setGeneratedQuestions([
          {
            id: 'gen_1',
            question: `How does a convolution kernel detect spatial edges in ${studioTopic}?`,
            options: [
              'By calculating dot products over sliding receptive fields',
              'By deleting random pixels from the image',
              'By converting the color palette to sepia',
              'By increasing memory clock frequency',
            ],
            correctAnswerIndex: 0,
            explanation: 'Kernels slide across input matrices to calculate feature representations like vertical or horizontal edges.',
            hint: 'Think about sliding a small matrix window across the image grid.',
          },
        ]);
        addToast({
          type: 'info',
          title: 'Curriculum Loaded',
          message: 'Sample questions prepared for classroom assignment.',
        });
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: err?.message || 'Unable to generate questions.',
      });
    } finally {
      setStudioLoading(false);
    }
  };

  const handleSaveGrade = (submissionId: string) => {
    const score = gradingScores[submissionId] || 95;
    const feedback = gradingFeedbacks[submissionId] || 'Well engineered solution with clear documentation.';
    gradeSubmission(submissionId, score, feedback);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Teacher Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#151D30] via-[#1A233D] to-[#151D30] p-6 sm:p-8 border border-[#705CF6]/25 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-[#705CF6]/20 px-3 py-1 text-xs font-bold text-[#705CF6] border border-[#705CF6]/30">
                FACULTY PORTAL
              </span>
              <span className="rounded-full bg-[#45D6C6]/20 px-3 py-1 text-xs font-semibold text-[#45D6C6] border border-[#45D6C6]/30">
                {currentUser.schoolName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Instructor Studio: <span className="text-[#45D6C6]">{currentUser.name}</span>
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Curriculum designer, Socratic coach, and Capstone Project Verifier for Grades 7-12 STEM & AI.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#0B1020]/80 p-4 rounded-2xl border border-[#705CF6]/30 backdrop-blur-md">
            <div>
              <div className="text-2xl font-black text-white">3</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Assigned Cohorts</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-700" />
            <div>
              <div className="text-2xl font-black text-[#45D6C6]">{submissions.length}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Submissions</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
          {[
            { id: 'teacher_overview', label: 'Classes & Overview', icon: Users },
            { id: 'teacher_studio', label: 'AI Curriculum Studio (Gemini)', icon: Bot },
            { id: 'teacher_grading', label: 'Grading Queue', icon: FileCheck },
            { id: 'teacher_projects', label: 'Project Verification (Skill Passport)', icon: Award },
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

      {/* VIEW: TEACHER OVERVIEW & CLASSES */}
      {activeView === 'teacher_overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Grade 10: Artificial Intelligence & Neural Nets',
                students: 32,
                avgMastery: 91,
                pendingLab: 2,
                nextClass: 'Tomorrow, 09:30 AM',
              },
              {
                title: 'Grade 10: Kinematics & Space Dynamics',
                students: 28,
                avgMastery: 86,
                pendingLab: 0,
                nextClass: 'Thursday, 11:00 AM',
              },
              {
                title: 'Grade 7: Autonomous Mobile Robotics',
                students: 24,
                avgMastery: 88,
                pendingLab: 1,
                nextClass: 'Friday, 01:15 PM',
              },
            ].map((cls, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25 flex flex-col justify-between space-y-4 hover:border-[#45D6C6]/40 transition-colors"
              >
                <div>
                  <span className="rounded-full bg-[#705CF6]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#705CF6] border border-[#705CF6]/30">
                    Active Class Cohort
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{cls.title}</h3>

                  <div className="mt-4 grid grid-cols-2 gap-3 bg-[#0B1020]/60 p-3 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-[10px] text-slate-400">Students</div>
                      <div className="text-sm font-bold text-white">{cls.students} Enrolled</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Avg Mastery</div>
                      <div className="text-sm font-bold text-[#45D6C6]">{cls.avgMastery}%</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Next: {cls.nextClass}</span>
                  <button
                    onClick={() => setActiveView('teacher_grading')}
                    className="text-[#45D6C6] font-bold hover:underline"
                  >
                    View Cohort
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions Bar */}
          <div className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#45D6C6]" />
                Accelerate Lesson Prep with Gemini 3.8 Flash
              </h3>
              <p className="text-xs text-slate-300">
                Generate Socratic practice problems, rubrics, and interactive analogies in seconds.
              </p>
            </div>
            <button
              onClick={() => setActiveView('teacher_studio')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#705CF6] to-[#45D6C6] px-5 py-2.5 text-xs font-bold text-white hover:opacity-95 shadow-md"
            >
              <Bot className="h-4 w-4" />
              <span>Open AI Lesson Studio</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW: AI LESSON & QUIZ STUDIO */}
      {activeView === 'teacher_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#45D6C6]" />
              AI Curriculum Generator
            </h3>
            <p className="text-xs text-slate-400">
              Powered by Google AI Studio Gemini 3.8 Flash with age-adapted educational system instructions.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Grade</label>
              <select
                value={studioGrade}
                onChange={(e) => setStudioGrade(Number(e.target.value))}
                className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Grade {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Area</label>
              <input
                type="text"
                value={studioSubject}
                onChange={(e) => setStudioSubject(e.target.value)}
                className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Specific Chapter or Topic</label>
              <textarea
                rows={3}
                value={studioTopic}
                onChange={(e) => setStudioTopic(e.target.value)}
                className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700"
              />
            </div>

            <button
              onClick={handleGenerateQuestions}
              disabled={studioLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#705CF6] to-[#45D6C6] px-4 py-3 text-xs font-bold text-white hover:opacity-95 disabled:opacity-50 transition-opacity shadow-lg"
            >
              {studioLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Curriculum with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Socratic Questions</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Content Preview */}
          <div className="lg:col-span-2 rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Generated Assessment Items</h3>
                <span className="text-xs text-slate-400">
                  Ready for instant classroom deployment or quiz assignment
                </span>
              </div>
              {generatedQuestions.length > 0 && (
                <button
                  onClick={() => {
                    addToast({
                      type: 'success',
                      title: 'Added to Homework Queue',
                      message: 'These questions have been attached to the active class syllabus.',
                    });
                  }}
                  className="rounded-lg bg-[#45D6C6]/20 text-[#45D6C6] border border-[#45D6C6]/30 px-3 py-1.5 text-xs font-bold hover:bg-[#45D6C6]/30"
                >
                  Publish to Class
                </button>
              )}
            </div>

            {generatedQuestions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
                <Bot className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold">No questions generated yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust parameters on the left and click "Generate Socratic Questions".
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {generatedQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0B1020] border border-slate-700/60 space-y-2.5">
                    <div className="text-xs font-bold text-white">
                      Q{idx + 1}: {q.question}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt: string, optI: number) => (
                        <div
                          key={optI}
                          className={`p-2 rounded-lg border ${
                            optI === q.correctAnswerIndex
                              ? 'bg-[#45D6C6]/15 border-[#45D6C6]/40 text-[#45D6C6] font-semibold'
                              : 'bg-[#151D30] border-slate-800 text-slate-300'
                          }`}
                        >
                          {opt} {optI === q.correctAnswerIndex && '✓ (Correct)'}
                        </div>
                      ))}
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#705CF6]/10 border border-[#705CF6]/20 text-[11px] text-slate-300">
                      <strong>Pedagogical Socratic Hint:</strong> {q.hint}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <strong>Rationale:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: ASSIGNMENTS & GRADING QUEUE */}
      {activeView === 'teacher_grading' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-[#45D6C6]" />
                Student Submissions & Grading Console
              </h2>
              <p className="text-xs text-slate-400">
                Review submitted code, simulation outputs, and lab notebooks with inline feedback.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {submissions.map((sub) => {
              const isGraded = sub.status === 'GRADED';
              return (
                <div
                  key={sub.id}
                  className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{sub.studentName}</span>
                        <span className="text-xs text-slate-400">• {sub.assignmentTitle}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Submitted at {sub.submittedAt}</span>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold self-start sm:self-auto ${
                        isGraded
                          ? 'bg-[#45D6C6]/20 text-[#45D6C6] border border-[#45D6C6]/30'
                          : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      }`}
                    >
                      {isGraded ? `Graded: ${sub.gradeScore}/100` : 'Pending Review'}
                    </span>
                  </div>

                  {/* Submission Body */}
                  <div className="p-4 rounded-xl bg-[#0B1020] border border-slate-800 text-xs text-slate-200 leading-relaxed">
                    <p>{sub.content}</p>
                    {sub.fileAttachment && (
                      <div className="mt-3 pt-3 border-t border-slate-800">
                        <a
                          href={sub.fileAttachment}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#45D6C6] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>View Attached Artifact / GitHub Repository</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Grading Controls */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="w-28 shrink-0">
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Score / 100
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={sub.gradeScore || 95}
                          onChange={(e) =>
                            setGradingScores((prev) => ({ ...prev, [sub.id]: Number(e.target.value) }))
                          }
                          className="w-full rounded-lg bg-[#0B1020] px-3 py-1.5 text-xs text-white border border-slate-700"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Instructor Constructive Feedback
                        </label>
                        <input
                          type="text"
                          defaultValue={sub.feedback || 'Outstanding neural net precision and documentation!'}
                          onChange={(e) =>
                            setGradingFeedbacks((prev) => ({ ...prev, [sub.id]: e.target.value }))
                          }
                          className="w-full rounded-lg bg-[#0B1020] px-3 py-1.5 text-xs text-white border border-slate-700"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleSaveGrade(sub.id)}
                      className="self-end sm:self-auto shrink-0 rounded-xl bg-[#705CF6] hover:bg-[#5e49e2] px-4 py-2 text-xs font-bold text-white transition-colors shadow-md"
                    >
                      {isGraded ? 'Update Grade' : 'Submit Grade & Notify Student'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: PROJECT VERIFICATION STUDIO (SKILL PASSPORT ISSUANCE) */}
      {activeView === 'teacher_projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-[#45D6C6]" />
                Capstone Project Verification ("PROVE" Phase)
              </h2>
              <p className="text-xs text-slate-400">
                Verify student projects and mint official credentials for their Skill Passport.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {projects.map((proj) => {
              const isVerified = proj.status === 'VERIFIED';
              return (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                        <span className="rounded bg-[#705CF6]/20 text-[#705CF6] text-[10px] font-bold px-2 py-0.5">
                          Grade {proj.grade}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Student: <span className="text-white font-semibold">{proj.studentName}</span> • Subject: {proj.subject}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isVerified
                          ? 'bg-[#45D6C6]/20 text-[#45D6C6] border border-[#45D6C6]/30'
                          : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      }`}
                    >
                      {isVerified ? 'VERIFIED ON PASSPORT' : 'PENDING FACULTY REVIEW'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-[#0B1020] p-4 rounded-xl border border-slate-800">
                    {proj.summary}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {proj.evidences.map((ev, eIdx) => (
                      <a
                        key={eIdx}
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-lg bg-[#0B1020] px-3 py-1 text-xs text-slate-300 border border-slate-700 hover:border-[#45D6C6]"
                      >
                        <ExternalLink className="h-3 w-3 text-[#45D6C6]" />
                        <span>{ev.label}</span>
                      </a>
                    ))}
                  </div>

                  {/* Verification action */}
                  {!isVerified && (
                    <div className="pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <input
                        type="text"
                        placeholder="Instructor validation notes & badge justification..."
                        onChange={(e) =>
                          setVerificationFeedback((prev) => ({ ...prev, [proj.id]: e.target.value }))
                        }
                        className="w-full sm:flex-1 rounded-xl bg-[#0B1020] px-3.5 py-2 text-xs text-white border border-slate-700"
                      />
                      <button
                        onClick={() =>
                          verifyProject(
                            proj.id,
                            'Master Environmental Drone & Geospatial Analytics',
                            verificationFeedback[proj.id] ||
                              'Impressive empirical methodology and georeferenced data modeling.'
                          )
                        }
                        className="w-full sm:w-auto shrink-0 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#45D6C6] to-[#705CF6] px-5 py-2 text-xs font-bold text-[#0B1020] hover:opacity-95 shadow-md"
                      >
                        <Award className="h-4 w-4" />
                        <span>Verify & Mint to Skill Passport</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
