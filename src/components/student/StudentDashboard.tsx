import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  BookOpen,
  FolderGit2,
  Award,
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Loader2,
  Play,
  RotateCcw,
  ExternalLink,
  Flame,
  Plus,
  ShieldCheck,
  Languages,
  HelpCircle,
  Lightbulb,
  Check,
  X,
  Share2,
  CheckSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateLevel, calculateSkillMastery, getGradeTier } from '../../utils/education';
import { Project, AIMessage } from '../../types';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    courses,
    lessons,
    activeCourseId,
    activeLessonId,
    openCourse,
    openLesson,
    completeLesson,
    assignments,
    submitAssignment,
    projects,
    createProject,
    skills,
    language,
    setLanguage,
    addToast,
  } = useApp();

  const currentGrade = currentUser.grade || 10;
  const gradeInfo = getGradeTier(currentGrade);
  const levelInfo = calculateLevel(currentUser.xp || 3450);

  // AI Tutor State
  const [tutorMessage, setTutorMessage] = useState('');
  const [tutorSubject, setTutorSubject] = useState('Artificial Intelligence');
  const [tutorMode, setTutorMode] = useState<'socratic_hints' | 'explain_concept' | 'generate_quiz'>('socratic_hints');
  const [tutorLoading, setTutorLoading] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<AIMessage[]>([
    {
      id: 'init_1',
      sender: 'model',
      text: `Hello ${currentUser.name}! I am your AetherLearn Socratic AI Tutor for Grade ${currentGrade} ${tutorSubject}. 
      
Instead of just handing you final answers, I'm here to ask guiding questions, unlock concepts, and help you think like a scientist. What are you exploring today?`,
      timestamp: 'Just now',
    },
  ]);

  // Quiz state for active lesson
  const currentLesson = lessons[activeLessonId] || Object.values(lessons)[0];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  // Project Modal State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectSubject, setNewProjectSubject] = useState('AI & Robotics');
  const [newProjectSummary, setNewProjectSummary] = useState('');
  const [newProjectDeliverable, setNewProjectDeliverable] = useState('');
  const [newProjectGithub, setNewProjectGithub] = useState('');

  // Send message to Gemini 3.8 Flash server route
  const handleSendTutorMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || tutorMessage;
    if (!textToSend.trim() || tutorLoading) return;

    const userMsg: AIMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAiChatHistory((prev) => [...prev, userMsg]);
    setTutorMessage('');
    setTutorLoading(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          grade: currentGrade,
          subject: tutorSubject,
          language,
          mode: tutorMode,
          history: aiChatHistory,
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        setAiChatHistory((prev) => [
          ...prev,
          {
            id: `ai_${Date.now()}`,
            sender: 'model',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        // Fallback demo response if server API key is unconfigured
        setAiChatHistory((prev) => [
          ...prev,
          {
            id: `ai_${Date.now()}`,
            sender: 'model',
            text:
              data.fallbackReply ||
              `[Socratic Guidance - ${tutorSubject}]: Great inquiry! Consider this: what is the fundamental relationship between the input variables and the objective? Try breaking down step 1 first.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err: any) {
      setAiChatHistory((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'model',
          text: `I experienced a brief connection hiccup. Let's revisit: "${textToSend}". What is your hypothesis?`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setTutorLoading(false);
    }
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim() || !newProjectSummary.trim()) {
      addToast({ type: 'warning', title: 'Missing Info', message: 'Please provide project title and description.' });
      return;
    }

    createProject({
      title: newProjectTitle,
      subject: newProjectSubject,
      summary: newProjectSummary,
      deliverables: newProjectDeliverable ? [newProjectDeliverable] : ['Working prototype', 'Source code documentation'],
      evidences: [
        { type: 'github', label: 'Source Repository', url: newProjectGithub || 'https://github.com/student/project' },
        { type: 'live_demo', label: 'Interactive Demo / Video', url: 'https://demo.aetherlearn.ai' },
      ],
    });

    setShowProjectModal(false);
    setNewProjectTitle('');
    setNewProjectSummary('');
    setNewProjectDeliverable('');
    setNewProjectGithub('');
  };

  /* Render Subviews based on activeView */
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner: Greeting, Grade Badge & Level Progress */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#151D30] via-[#1A233D] to-[#151D30] p-6 sm:p-8 border border-[#705CF6]/25 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-gradient-to-br from-[#705CF6]/20 to-[#45D6C6]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-[#45D6C6]/20 px-3 py-1 text-xs font-bold text-[#45D6C6] border border-[#45D6C6]/30">
                Grade {currentGrade} • {gradeInfo.tier.toUpperCase()}
              </span>
              <span className="rounded-full bg-[#705CF6]/20 px-3 py-1 text-xs font-semibold text-[#705CF6] border border-[#705CF6]/30">
                {currentUser.schoolName || 'Apex STEM Academy'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-[#45D6C6]">{currentUser.name}</span>!
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              "LEARN → BUILD → PROVE". You are currently exploring neural architectures, orbital dynamics, and edge robotics.
            </p>
          </div>

          {/* Level & Streak Widget */}
          <div className="flex items-center gap-4 bg-[#0B1020]/80 p-4 rounded-2xl border border-[#705CF6]/30 backdrop-blur-md">
            <div className="text-center">
              <div className="text-2xl font-black text-[#45D6C6]">Lvl {levelInfo.level}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Mastery Rank</div>
            </div>
            <div className="h-10 w-[1px] bg-slate-700" />
            <div className="w-36">
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>{currentUser.xp || 3450} XP</span>
                <span className="text-slate-400">{levelInfo.nextLevelXp} XP</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#705CF6] to-[#45D6C6] transition-all duration-500"
                  style={{ width: `${levelInfo.progressPct}%` }}
                />
              </div>
              <div className="mt-1 text-[10px] text-right text-slate-400 font-medium">
                {levelInfo.progressPct}% to Level {levelInfo.level + 1}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Nav Chips */}
        <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
          {[
            { id: 'student_overview', label: 'Dashboard Overview', icon: Sparkles },
            { id: 'student_courses', label: 'My Courses & Lessons', icon: BookOpen },
            { id: 'student_tutor', label: 'AI Socratic Tutor', icon: Bot },
            { id: 'student_projects', label: 'Project Workspace (Build)', icon: FolderGit2 },
            { id: 'student_passport', label: 'Skill Passport (Prove)', icon: Award },
            { id: 'student_careers', label: 'Career Roadmaps', icon: Compass },
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
      {(activeView === 'student_overview' || activeView === 'student_courses') && (
        <div className="space-y-8">
          {/* Active Courses Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#45D6C6]" />
                  Active Courses & Chapters
                </h2>
                <p className="text-xs text-slate-400">Interactive curriculum aligned with national STEM & AI standards</p>
              </div>
              <button
                onClick={() => setActiveView('student_tutor')}
                className="text-xs font-semibold text-[#45D6C6] hover:underline flex items-center gap-1"
              >
                <span>Ask AI Tutor for Study Plan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const completed = course.completedLessons || 0;
                const pct = Math.round((completed / course.lessonsCount) * 100);
                return (
                  <div
                    key={course.id}
                    className="group flex flex-col justify-between rounded-2xl bg-[#151D30] border border-[#705CF6]/20 overflow-hidden hover:border-[#45D6C6]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#0B1020]"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151D30] via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 rounded-md bg-[#0B1020]/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-[#45D6C6] border border-[#45D6C6]/30">
                        {course.subject}
                      </span>
                      <span className="absolute top-3 right-3 rounded-md bg-[#0B1020]/80 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white">
                        Gr {course.grade}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-[#45D6C6] transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="mt-2 text-xs text-slate-400 line-clamp-2">{course.description}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                          <span>Progress ({pct}%)</span>
                          <span>
                            {completed} / {course.lessonsCount} Lessons
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#705CF6] to-[#45D6C6]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">Instructor: {course.instructorName}</span>
                          <button
                            onClick={() => {
                              openCourse(course.id);
                              openLesson('course_ai_10_l1');
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-[#705CF6] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#5b46e8] transition-colors"
                          >
                            <span>Continue</span>
                            <Play className="h-3 w-3 fill-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Assignments & Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/20">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-amber-400" />
                Active Homework & Lab Assignments
              </h3>
              <div className="space-y-3">
                {assignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="p-4 rounded-xl bg-[#0B1020]/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 border border-amber-400/20">
                          Due {asg.dueDate}
                        </span>
                        <span className="text-[10px] text-slate-400">{asg.courseTitle}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-1">{asg.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{asg.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        submitAssignment(asg.id, 'Uploaded Jupyter Notebook with CNN model weights and training curves.');
                      }}
                      className="shrink-0 rounded-lg bg-[#45D6C6]/20 text-[#45D6C6] hover:bg-[#45D6C6]/30 px-3 py-1.5 text-xs font-bold border border-[#45D6C6]/30 transition-colors"
                    >
                      Submit Lab Work
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Skill Passport Badge Preview */}
            <div className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#45D6C6]" />
                    Verified Skill Passport
                  </h3>
                  <button
                    onClick={() => setActiveView('student_passport')}
                    className="text-xs font-semibold text-[#45D6C6] hover:underline"
                  >
                    View All Credentials
                  </button>
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  Real-world verified achievements ("PROVE" phase). These credentials can be shared with universities and high-tech internships.
                </p>

                <div className="space-y-2.5">
                  {skills.slice(0, 2).map((sk) => (
                    <div
                      key={sk.id}
                      className="p-3 rounded-xl bg-gradient-to-r from-[#705CF6]/15 to-[#45D6C6]/10 border border-[#705CF6]/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-[#705CF6] flex items-center justify-center text-white shadow-md">
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">{sk.skillName}</h5>
                          <span className="text-[10px] text-slate-400">Hash: {sk.verificationHash}</span>
                        </div>
                      </div>
                      <span className="rounded-full bg-[#45D6C6]/20 px-2 py-0.5 text-[10px] font-bold text-[#45D6C6] border border-[#45D6C6]/30">
                        {sk.masteryLevel} ({sk.masteryScore}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-400">
                <span>Verified by Apex STEM Faculty</span>
                <span className="text-[#45D6C6] font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> 100% Cryptographically Signed
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: INTERACTIVE LESSON VIEWER */}
      {activeView === 'student_lesson' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveView('student_courses')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              ← Back to Course Directory
            </button>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#705CF6]/20 px-2.5 py-1 text-xs font-bold text-[#705CF6] border border-[#705CF6]/30">
                Chapter {currentLesson.chapterNumber}: {currentLesson.durationMins} Mins
              </span>
              <button
                onClick={() => completeLesson(currentLesson.id)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#45D6C6] to-[#705CF6] px-4 py-2 text-xs font-bold text-[#0B1020] hover:opacity-95 transition-opacity shadow-lg"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Mark Lesson Complete (+150 XP)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Lesson Content */}
            <div className="lg:col-span-2 rounded-2xl bg-[#151D30] p-6 sm:p-8 border border-[#705CF6]/25 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#45D6C6] uppercase tracking-wider">
                  Interactive AI Curriculum
                </span>
                <h2 className="text-2xl font-black text-white mt-1">{currentLesson.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{currentLesson.summary}</p>
              </div>

              {/* Interactive Neural Perceptron Simulator */}
              <div className="rounded-xl bg-[#0B1020] p-5 border border-[#45D6C6]/30 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#45D6C6] flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-[#45D6C6]" />
                    Interactive Simulator: Single Artificial Neuron
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">z = (x1·w1) + (x2·w2) + bias</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center py-4 bg-[#151D30]/60 rounded-xl border border-slate-700/50">
                  <div>
                    <div className="text-[10px] text-slate-400">Inputs</div>
                    <div className="text-sm font-bold text-white">[1.0, 2.0]</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Learned Weights</div>
                    <div className="text-sm font-bold text-[#705CF6]">[0.8, -0.5]</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">ReLU Output f(z)</div>
                    <div className="text-sm font-bold text-[#45D6C6]">0.80 (Active)</div>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-slate-400 text-center">
                  Notice how the neuron combines signals and decides whether to fire. Try modifying weights in Python lab!
                </p>
              </div>

              {/* Lesson Text Body */}
              <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line border-t border-slate-700/50 pt-4">
                {currentLesson.content}
              </div>

              {/* Key Takeaways */}
              <div className="rounded-xl bg-[#705CF6]/10 p-4 border border-[#705CF6]/30">
                <h4 className="text-xs font-bold text-[#45D6C6] uppercase tracking-wide mb-2">Key Takeaways</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentLesson.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#45D6C6] font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Lesson Comprehension Quiz & Socratic Hints */}
            <div className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25 space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                  <CheckSquare className="h-5 w-5 text-[#45D6C6]" />
                  Comprehension Check
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Test your understanding. If you are stuck, unlock a Socratic Hint instead of guessing!
                </p>

                <div className="space-y-6">
                  {currentLesson.quiz.map((q, idx) => {
                    const answered = selectedAnswers[q.id] !== undefined;
                    const isCorrect = selectedAnswers[q.id] === q.correctAnswerIndex;
                    return (
                      <div key={q.id} className="p-4 rounded-xl bg-[#0B1020]/70 border border-slate-700/50 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-white">
                            {idx + 1}. {q.question}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedAnswers[q.id] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                                }}
                                className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-all ${
                                  isSelected
                                    ? 'bg-[#705CF6] text-white font-semibold'
                                    : 'bg-[#151D30] text-slate-300 hover:bg-[#202b47]'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Hint Button */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => {
                              setRevealedHints((prev) => ({ ...prev, [q.id]: !prev[q.id] }));
                            }}
                            className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                          >
                            <Lightbulb className="h-3.5 w-3.5" />
                            <span>{revealedHints[q.id] ? 'Hide Hint' : 'Need a Socratic Hint?'}</span>
                          </button>

                          {answered && (
                            <span
                              className={`text-[11px] font-bold flex items-center gap-1 ${
                                isCorrect ? 'text-[#45D6C6]' : 'text-rose-400'
                              }`}
                            >
                              {isCorrect ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                              {isCorrect ? 'Correct!' : 'Review Concept'}
                            </span>
                          )}
                        </div>

                        {revealedHints[q.id] && (
                          <div className="p-2.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-[11px] text-amber-200">
                            💡 <strong>Hint:</strong> {q.hint}
                          </div>
                        )}

                        {answered && (
                          <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ask Tutor About this Lesson */}
              <div className="pt-4 border-t border-slate-700/60">
                <button
                  onClick={() => {
                    setActiveView('student_tutor');
                    setTutorMessage(`Can you explain why activation functions are necessary in ${currentLesson.title}?`);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#151D30] hover:bg-[#202b47] px-4 py-2.5 text-xs font-bold text-[#45D6C6] border border-[#45D6C6]/30 transition-colors"
                >
                  <Bot className="h-4 w-4" />
                  <span>Discuss this Chapter with AI Tutor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: REAL AI PERSONAL TUTOR (GEMINI 3.8 FLASH) */}
      {(activeView === 'student_tutor' || activeView === 'student_quizzes') && (
        <div className="rounded-3xl bg-[#151D30] border border-[#705CF6]/30 overflow-hidden shadow-2xl flex flex-col h-[750px]">
          {/* Tutor Header & Controls */}
          <div className="p-4 sm:p-5 border-b border-[#705CF6]/20 bg-[#0B1020]/90 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#705CF6] to-[#45D6C6] flex items-center justify-center text-white shadow-md">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">AetherLearn Socratic AI Tutor</h2>
                  <span className="rounded-full bg-[#45D6C6]/20 px-2 py-0.5 text-[10px] font-bold text-[#45D6C6] border border-[#45D6C6]/30">
                    Gemini 3.8 Flash
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Pedagogy: Hints & Guided Steps • Grade {currentGrade} • Multilingual
                </p>
              </div>
            </div>

            {/* Subject & Mode Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={tutorSubject}
                onChange={(e) => setTutorSubject(e.target.value)}
                className="rounded-lg bg-[#151D30] px-3 py-1.5 text-xs font-semibold text-white border border-[#705CF6]/30 focus:outline-none focus:border-[#45D6C6]"
              >
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Physics & Space Dynamics">Physics & Space</option>
                <option value="Mathematics & Matrices">Mathematics</option>
                <option value="Robotics & Microcontrollers">Robotics</option>
                <option value="Biotechnology & CRISPR">Biotechnology</option>
              </select>

              <select
                value={tutorMode}
                onChange={(e) => setTutorMode(e.target.value as any)}
                className="rounded-lg bg-[#151D30] px-3 py-1.5 text-xs font-semibold text-white border border-[#705CF6]/30 focus:outline-none focus:border-[#45D6C6]"
              >
                <option value="socratic_hints">💡 Socratic Hints Mode</option>
                <option value="explain_concept">🔬 Concept Deep Dive</option>
                <option value="generate_quiz">⚡ Generate Practice Challenge</option>
              </select>

              {/* Language Pills */}
              <div className="flex items-center rounded-lg bg-[#151D30] p-0.5 border border-[#705CF6]/30">
                {(['en', 'hi', 'mr'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`rounded px-2 py-1 text-[11px] font-bold uppercase transition-colors ${
                      language === l ? 'bg-[#705CF6] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-5 py-2.5 bg-[#0B1020]/50 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">Try asking:</span>
            {[
              'Give me a Socratic hint on calculating weighted sum z',
              'Explain backpropagation with a real-world sports analogy',
              'Give me a practice challenge question for Grade 10',
              'What is the difference between ReLU and Sigmoid?',
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendTutorMessage(prompt)}
                className="shrink-0 rounded-full bg-[#151D30] hover:bg-[#202b47] px-3 py-1 text-[11px] text-slate-300 border border-[#705CF6]/20 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {aiChatHistory.map((msg) => {
              const isAi = msg.sender === 'model';
              return (
                <div key={msg.id} className={`flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}`}>
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isAi
                        ? 'bg-gradient-to-tr from-[#705CF6] to-[#45D6C6] text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isAi ? <Bot className="h-4 w-4" /> : <span className="text-xs font-bold">ME</span>}
                  </div>

                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-md ${
                      isAi
                        ? 'bg-[#0B1020] text-slate-200 border border-[#705CF6]/25'
                        : 'bg-[#705CF6] text-white font-medium'
                    }`}
                  >
                    {msg.text}
                    <div
                      className={`mt-2 text-[10px] ${
                        isAi ? 'text-slate-500' : 'text-slate-200/80'
                      } text-right`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {tutorLoading && (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#705CF6] to-[#45D6C6] flex items-center justify-center text-white">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                <div className="rounded-2xl bg-[#0B1020] p-4 text-xs text-slate-400 border border-[#705CF6]/25 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#45D6C6] animate-pulse" />
                  <span>Gemini 3.8 Flash is formulating your Socratic hint...</span>
                </div>
              </div>
            )}
          </div>

          {/* Tutor Input Form */}
          <div className="p-4 bg-[#0B1020]/90 border-t border-[#705CF6]/20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendTutorMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={tutorMessage}
                onChange={(e) => setTutorMessage(e.target.value)}
                placeholder={`Ask your AI Tutor about ${tutorSubject}...`}
                className="flex-1 rounded-xl bg-[#151D30] px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 border border-[#705CF6]/30 focus:outline-none focus:border-[#45D6C6] transition-colors"
              />
              <button
                type="submit"
                disabled={!tutorMessage.trim() || tutorLoading}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#705CF6] to-[#45D6C6] px-5 py-3 text-xs sm:text-sm font-bold text-white hover:opacity-95 disabled:opacity-40 transition-opacity shadow-md"
              >
                <span>Send</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW: PROJECT WORKSPACE ("BUILD" PHASE) */}
      {activeView === 'student_projects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-[#45D6C6]" />
                Project Workspace ("BUILD" Phase)
              </h2>
              <p className="text-xs text-slate-400">
                Turn theoretical knowledge into working prototypes, robots, algorithms, and experiments.
              </p>
            </div>
            <button
              onClick={() => setShowProjectModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#705CF6] to-[#45D6C6] px-4 py-2.5 text-xs font-bold text-white hover:opacity-95 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span>Submit New Capstone Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((proj) => {
              const isVerified = proj.status === 'VERIFIED';
              return (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25 flex flex-col justify-between space-y-4 hover:border-[#45D6C6]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#705CF6]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#705CF6] border border-[#705CF6]/30">
                        {proj.subject}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          isVerified
                            ? 'bg-[#45D6C6]/20 text-[#45D6C6] border border-[#45D6C6]/30'
                            : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        }`}
                      >
                        {isVerified ? 'VERIFIED ON PASSPORT' : 'UNDER FACULTY REVIEW'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mt-2">{proj.title}</h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{proj.summary}</p>

                    {/* Deliverables */}
                    <div className="mt-4 space-y-1.5">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Key Deliverables</div>
                      {proj.deliverables.map((del, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#45D6C6] shrink-0" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>

                    {/* Evidences */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {proj.evidences.map((ev, eIdx) => (
                        <a
                          key={eIdx}
                          href={ev.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 rounded-lg bg-[#0B1020] px-3 py-1 text-xs text-slate-300 border border-slate-700 hover:border-[#45D6C6] transition-colors"
                        >
                          <ExternalLink className="h-3 w-3 text-[#45D6C6]" />
                          <span>{ev.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Teacher Feedback & Badge */}
                  {isVerified && proj.skillBadge && (
                    <div className="pt-4 border-t border-slate-700/60 bg-[#0B1020]/40 -mx-6 -mb-6 p-4 rounded-b-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-[#45D6C6]" />
                          <div>
                            <div className="text-xs font-bold text-white">{proj.skillBadge.name}</div>
                            <div className="text-[10px] text-slate-400">
                              Verified by {proj.verifiedByTeacherName} • {proj.verifiedDate}
                            </div>
                          </div>
                        </div>
                        <span className="font-mono text-[10px] text-[#45D6C6]">{proj.skillBadge.hash}</span>
                      </div>
                      {proj.teacherFeedback && (
                        <p className="mt-2 text-[11px] text-slate-300 italic">"{proj.teacherFeedback}"</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* New Project Modal */}
          {showProjectModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="w-full max-w-lg rounded-3xl bg-[#151D30] p-6 border border-[#705CF6]/40 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="h-5 w-5 text-[#45D6C6]" />
                    Submit Capstone Project
                  </h3>
                  <button
                    onClick={() => setShowProjectModal(false)}
                    className="rounded-lg p-1 text-slate-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
                    <input
                      type="text"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      placeholder="e.g., Autonomous Lunar Rover Obstacle Avoidance"
                      className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-[#45D6C6]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Domain</label>
                    <select
                      value={newProjectSubject}
                      onChange={(e) => setNewProjectSubject(e.target.value)}
                      className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-[#45D6C6]"
                    >
                      <option value="AI & Robotics">AI & Robotics</option>
                      <option value="Physics & Space Sciences">Physics & Space</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="Environmental Computing">Environmental Computing</option>
                      <option value="Applied Mathematics">Applied Mathematics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Summary & Technical Scope</label>
                    <textarea
                      rows={3}
                      value={newProjectSummary}
                      onChange={(e) => setNewProjectSummary(e.target.value)}
                      placeholder="Explain what problem your project solves, the hardware/software stack used, and your results..."
                      className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-[#45D6C6]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub / Code Repository URL</label>
                    <input
                      type="url"
                      value={newProjectGithub}
                      onChange={(e) => setNewProjectGithub(e.target.value)}
                      placeholder="https://github.com/your-username/project-repo"
                      className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-[#45D6C6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Key Deliverable Statement</label>
                    <input
                      type="text"
                      value={newProjectDeliverable}
                      onChange={(e) => setNewProjectDeliverable(e.target.value)}
                      placeholder="e.g., 3D CAD chassis + trained PyTorch CNN model"
                      className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-[#45D6C6]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowProjectModal(false)}
                      className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-[#0B1020]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-[#705CF6] to-[#45D6C6] px-5 py-2 text-xs font-bold text-white hover:opacity-95"
                    >
                      Submit for Faculty Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: SKILL PASSPORT ("PROVE" PHASE) */}
      {activeView === 'student_passport' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-[#151D30] to-[#0B1020] p-6 sm:p-8 border border-[#705CF6]/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="rounded-full bg-[#45D6C6]/20 px-3 py-1 text-xs font-bold text-[#45D6C6] border border-[#45D6C6]/30">
                  VERIFIED CREDENTIAL PASSPORT
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                  {currentUser.name}'s Verified Skill Passport
                </h2>
                <p className="mt-1 text-sm text-slate-300 max-w-xl">
                  Cryptographically verifiable proof of mastery ("PROVE" phase). Issued by accredited partner schools and verified through real-world capstone project evaluations.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://passport.aetherlearn.ai/verify/${currentUser.id}`);
                    addToast({
                      type: 'success',
                      title: 'Passport Link Copied!',
                      message: 'Shareable verification URL copied to clipboard.',
                    });
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#705CF6] hover:bg-[#5e49e2] px-4 py-2.5 text-xs font-bold text-white transition-colors shadow-lg"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share Verification Link</span>
                </button>
              </div>
            </div>

            {/* Passport Badges Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((sk) => (
                <div
                  key={sk.id}
                  className="relative overflow-hidden rounded-2xl bg-[#0B1020] p-6 border border-[#705CF6]/30 hover:border-[#45D6C6]/50 transition-all shadow-xl"
                >
                  <div className="absolute top-0 right-0 h-24 w-24 bg-[#705CF6]/10 rounded-full blur-2xl" />

                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#705CF6] to-[#45D6C6] flex items-center justify-center text-white shadow-md">
                      <Award className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-[#45D6C6]/20 px-2.5 py-1 text-xs font-bold text-[#45D6C6] border border-[#45D6C6]/30">
                      {sk.masteryLevel} ({sk.masteryScore}%)
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white line-clamp-1">{sk.skillName}</h4>
                  <div className="text-xs text-[#705CF6] font-semibold mt-0.5">{sk.category}</div>

                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-1 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Issuing Entity:</span>
                      <span className="text-slate-200 font-medium">{sk.issuingOrganization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Verified Date:</span>
                      <span className="text-slate-200">{sk.issuedAt}</span>
                    </div>
                    <div className="flex justify-between font-mono text-[10px] pt-1 text-[#45D6C6]">
                      <span>Hash:</span>
                      <span>{sk.verificationHash}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CAREER ROADMAPS */}
      {activeView === 'student_careers' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="h-5 w-5 text-[#45D6C6]" />
              AI Career Exploration & Milestones
            </h2>
            <p className="text-xs text-slate-400">
              Future-proof career pathways linked directly to your Grade 1-12 curriculum and Skill Passport.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Quantum & Autonomous Systems Architect',
                industry: 'DeepTech & Robotics',
                readiness: 82,
                desc: 'Designs multi-agent robot swarms, autonomous flight vehicles, and edge intelligence systems.',
                skillsRequired: ['Perceptrons', 'Sensor Fusion', 'PID Feedback', 'Linear Algebra'],
                recommendedSubject: 'Grade 10 AI & Robotics',
              },
              {
                title: 'Bio-Computational & CRISPR Engineer',
                industry: 'Synthetic Biology & Medicine',
                readiness: 65,
                desc: 'Leverages generative models to design targeted RNA therapies and bio-molecular pathways.',
                skillsRequired: ['DNA Sequencing', 'Protein Folding', 'Python Analytics'],
                recommendedSubject: 'Grade 12 Synthetic Biology',
              },
              {
                title: 'Space Propulsion & Orbital Dynamicist',
                industry: 'Aerospace & Exploration',
                readiness: 78,
                desc: 'Calculates planetary transfer trajectories and ion thruster mechanics for interplanetary transit.',
                skillsRequired: ['Kinematics', 'Orbital Vectors', 'Multi-Body Physics'],
                recommendedSubject: 'Grade 10 Physics & Space Dynamics',
              },
              {
                title: 'Ethical AI & Global Algorithmic Auditor',
                industry: 'Governance & Tech Policy',
                readiness: 89,
                desc: 'Audits large generative systems for fairness, security vulnerabilities, and kid-safe interactions.',
                skillsRequired: ['Model Explainability', 'Bias Mitigation', 'Policy Engineering'],
                recommendedSubject: 'Grade 11 AI Ethics & Law',
              },
            ].map((career, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[#151D30] p-6 border border-[#705CF6]/25 flex flex-col justify-between space-y-4 hover:border-[#45D6C6]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#705CF6]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#705CF6] border border-[#705CF6]/30">
                      {career.industry}
                    </span>
                    <span className="text-xs font-bold text-[#45D6C6]">{career.readiness}% Match</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-2">{career.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{career.desc}</p>

                  <div className="mt-4 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Skills Alignment:</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {career.skillsRequired.map((sk, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-md bg-[#0B1020] px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-700"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target: {career.recommendedSubject}</span>
                  <button
                    onClick={() => setActiveView('student_courses')}
                    className="text-[#45D6C6] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View Roadmap</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
