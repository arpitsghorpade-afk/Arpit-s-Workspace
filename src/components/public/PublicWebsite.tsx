import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Award,
  FolderGit2,
  BookOpen,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Globe,
  Zap,
  Star,
  Layers,
  Send,
  Play,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PublicWebsite: React.FC = () => {
  const { switchRole, setActiveView, addToast } = useApp();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSchool, setContactSchool] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    addToast({
      type: 'success',
      title: 'Demo Request Received',
      message: 'An AetherLearn institutional specialist will contact your academy within 24 hours.',
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F8FAFC]">
      {/* Schema.org Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            name: 'AetherLearn AI',
            description: 'Futuristic AI Education SaaS Platform for Grade 1 to Grade 12 students.',
            url: 'https://aetherlearn.ai',
            audience: 'K-12 Students, Teachers, Schools, and Parents',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Futuristic glowing ambient orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-tr from-[#705CF6]/30 via-[#45D6C6]/20 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#151D30] px-4 py-1.5 border border-[#705CF6]/40 shadow-lg shadow-[#705CF6]/10">
            <span className="flex h-2 w-2 rounded-full bg-[#45D6C6] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#45D6C6]">
              LEARN → BUILD → PROVE
            </span>
            <span className="text-xs text-slate-400">• Grade 1 to 12 AI Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight">
            The Next-Generation <br />
            <span className="bg-gradient-to-r from-white via-[#45D6C6] to-[#705CF6] bg-clip-text text-transparent">
              AI Education Ecosystem
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Empowering students from Grade 1 through Grade 12 with an adaptive Gemini AI Personal Tutor, real-world engineering project workspaces, and cryptographically verified Skill Passports.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => switchRole('STUDENT')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#705CF6] to-[#45D6C6] px-8 py-4 text-sm font-extrabold text-[#0B1020] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#705CF6]/30"
            >
              <span>Launch Student Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => switchRole('TEACHER')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-[#151D30] hover:bg-[#202b47] px-8 py-4 text-sm font-bold text-white border border-[#705CF6]/30 transition-all shadow-md"
            >
              <span>Teacher Studio Demo</span>
            </button>

            <button
              onClick={() => switchRole('SUPER_ADMIN')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-[#0B1020] hover:bg-[#151D30] px-6 py-4 text-sm font-semibold text-slate-400 hover:text-white border border-slate-800 transition-all"
            >
              <span>Super Admin Dashboard</span>
            </button>
          </div>

          {/* Interactive Hero Preview Card */}
          <div className="mt-12 rounded-3xl bg-[#151D30]/80 p-4 sm:p-6 border border-[#705CF6]/30 shadow-2xl backdrop-blur-xl max-w-5xl mx-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-slate-400">aetherlearn.ai/live-session/grade-10-ai</span>
              </div>
              <span className="rounded-full bg-[#45D6C6]/20 text-[#45D6C6] px-2.5 py-0.5 text-[10px] font-bold">
                GEMINI 3.8 FLASH ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#0B1020] border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#705CF6]">
                  <BookOpen className="h-4 w-4" />
                  <span>1. LEARN: Socratic Guidance</span>
                </div>
                <p className="text-xs text-slate-300">
                  Instead of giving away answers, our AI poses guided thought-questions that build deep conceptual comprehension.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B1020] border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#45D6C6]">
                  <FolderGit2 className="h-4 w-4" />
                  <span>2. BUILD: Real Capstone Projects</span>
                </div>
                <p className="text-xs text-slate-300">
                  Students build autonomous rovers, train computer vision models, and code climate drones with git evidence.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B1020] border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Award className="h-4 w-4" />
                  <span>3. PROVE: Verified Skill Passport</span>
                </div>
                <p className="text-xs text-slate-300">
                  Faculty verify deliverables, issuing cryptographically signed credentials recognized by top universities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM EXPLORER: GRADES 1 TO 12 */}
      <section className="py-20 bg-[#151D30]/40 border-y border-[#705CF6]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#45D6C6]">
              Comprehensive K-12 Syllabus
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Age-Adapted Pedagogy for Every Learning Stage
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              From visual math journeys in Grade 1 to advanced neural network architectures and synthetic biology in Grade 12.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                tier: 'Primary Explorers',
                grades: 'Grades 1 – 5',
                color: 'border-emerald-500/30 text-emerald-400',
                desc: 'Visual math puzzles, story-based science, intuitive Scratch block coding, and sensory nature discovery.',
                focus: ['Multiplication Constellations', 'Nature & Animal Systems', 'Intro to Algorithms'],
              },
              {
                tier: 'Middle School Innovators',
                grades: 'Grades 6 – 8',
                color: 'border-cyan-500/30 text-[#45D6C6]',
                desc: 'Transition to MicroPython, autonomous robotics, pre-algebra modeling, and earth atmospheric sciences.',
                focus: ['Robotics Sensors & PWM', 'Algebraic Patterns', 'Climate Data Modeling'],
              },
              {
                tier: 'High School Builders',
                grades: 'Grades 9 – 10',
                color: 'border-purple-500/30 text-[#705CF6]',
                desc: 'Artificial intelligence foundations, convolutional neural networks, kinematics, and data science capstones.',
                focus: ['Perceptrons & CNNs', 'Orbital Mechanics', 'Quadratic Matrices'],
              },
              {
                tier: 'Senior High Scholars',
                grades: 'Grades 11 – 12',
                color: 'border-amber-500/30 text-amber-400',
                desc: 'Advanced machine learning, CRISPR synthetic biology, quantum concepts, and university-ready research.',
                focus: ['Transformer LLMs', 'Gene Editing & mRNA', 'Quantum Computing Intro'],
              },
            ].map((cohort, i) => (
              <div
                key={i}
                className="rounded-3xl bg-[#151D30] p-6 border border-[#705CF6]/20 flex flex-col justify-between space-y-4 hover:border-[#45D6C6]/40 transition-all hover:scale-[1.02]"
              >
                <div>
                  <span className={`rounded-full bg-[#0B1020] px-3 py-1 text-xs font-bold border ${cohort.color}`}>
                    {cohort.grades}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-3">{cohort.tier}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{cohort.desc}</p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-700/60">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Sample Modules</div>
                  {cohort.focus.map((f, fIdx) => (
                    <div key={fIdx} className="text-xs text-slate-200 flex items-center gap-1.5">
                      <span className="text-[#45D6C6]">•</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MULTILINGUAL & SOCRATIC TUTOR SPOTLIGHT */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#705CF6]">
                Proprietary AI Tutoring Model
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Fluent in English, हिंदी, and मराठी
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Education is most impactful when students can express doubts in their native tongue. Our Socratic tutor seamlessly switches between English, Hindi, and Marathi while maintaining rigorous scientific vocabulary.
              </p>

              <div className="space-y-3">
                {[
                  'Guided Socratic hints instead of shortcut answers',
                  'Grade-adaptive explanations using real-world analogies',
                  'Instant practice question generation with tailored feedback',
                  '100% Kid-Safe child privacy and COPPA protection',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                    <CheckCircle2 className="h-5 w-5 text-[#45D6C6] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => switchRole('STUDENT')}
                  className="rounded-xl bg-[#705CF6] hover:bg-[#5f4be2] px-6 py-3 text-xs font-bold text-white transition-colors shadow-lg shadow-[#705CF6]/20"
                >
                  Test Drive AI Tutor Now
                </button>
              </div>
            </div>

            {/* Chat Simulation Display */}
            <div className="rounded-3xl bg-[#151D30] p-6 border border-[#705CF6]/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#705CF6] to-[#45D6C6] flex items-center justify-center text-white">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">AetherLearn AI Tutor</h4>
                    <span className="text-[10px] text-[#45D6C6]">Grade 10 • Mathematics & Physics</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">Language: हिंदी / English</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#0B1020] text-slate-300 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Student</span>
                  "सर, मुझे Perceptron में Activation Function का क्या उपयोग है समझ नहीं आया।"
                </div>

                <div className="p-3.5 rounded-2xl bg-[#705CF6]/20 text-slate-200 border border-[#705CF6]/40 leading-relaxed">
                  <span className="text-[10px] font-bold text-[#45D6C6] uppercase block mb-1">
                    AI Socratic Tutor
                  </span>
                  "बहुत अच्छा सवाल! सोचिए अगर किसी कमरे में सिर्फ एक सीधा स्विच (Straight Line) हो, तो क्या वह जटिल पैटर्न पहचान पाएगा? Activation Function न्यूरॉन में **Non-linearity (गैर-रेखीयता)** लाता है ताकि नेटवर्क बिल्ली और कुत्ते जैसे पेचीदा फ़ोटो पहचान सके। क्या आप ReLU फ़ंक्शन का नियम याद कर सकते हैं?"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING & SUBSCRIPTIONS */}
      <section className="py-20 bg-[#151D30]/30 border-t border-[#705CF6]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#45D6C6]">Transparent Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Built for Independent Scholars & Whole Schools</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Empowering self-driven learners and complete K-12 school districts with zero hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Plan */}
            <div className="rounded-3xl bg-[#151D30] p-8 border border-slate-700 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Independent Learner</span>
                <h3 className="text-xl font-bold text-white mt-1">Student Pro</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$15</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">Perfect for ambitious Grade 1-12 students studying independently.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#45D6C6]" />
                    <span>Unlimited Socratic AI Tutor queries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#45D6C6]" />
                    <span>Grade 1-12 STEM & AI course access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#45D6C6]" />
                    <span>Personal Project Workspace</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#45D6C6]" />
                    <span>Basic Skill Passport credentialing</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => switchRole('STUDENT')}
                className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-xs font-bold text-white transition-colors"
              >
                Start Student Trial
              </button>
            </div>

            {/* School Pro Plan (Featured) */}
            <div className="relative rounded-3xl bg-gradient-to-b from-[#1A233D] to-[#151D30] p-8 border-2 border-[#45D6C6] shadow-2xl flex flex-col justify-between space-y-6 scale-[1.03]">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#45D6C6] px-4 py-1 text-[10px] font-black uppercase text-[#0B1020]">
                MOST POPULAR FOR ACADEMIES
              </span>

              <div>
                <span className="text-xs font-bold text-[#45D6C6] uppercase">K-12 Campus License</span>
                <h3 className="text-xl font-bold text-white mt-1">Pro Academy</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$1,200</span>
                  <span className="text-xs text-slate-400">/ campus / mo</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">Up to 1,500 students with full teacher studios and parent dashboards.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#45D6C6]" />
                    <span>Full School Admin & Teacher Studio suites</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#45D6C6]" />
                    <span>AI Quiz & Assignment Generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#45D6C6]" />
                    <span>Faculty Capstone Verification Studio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#45D6C6]" />
                    <span>Parent Progress Portal with COPPA safeguards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#45D6C6]" />
                    <span>Dedicated School-Level Data Isolation</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => switchRole('SCHOOL_ADMIN')}
                className="w-full rounded-xl bg-gradient-to-r from-[#705CF6] to-[#45D6C6] py-3 text-xs font-bold text-[#0B1020] hover:opacity-95 transition-opacity shadow-lg"
              >
                Experience School Admin Portal
              </button>
            </div>

            {/* Global District Enterprise */}
            <div className="rounded-3xl bg-[#151D30] p-8 border border-slate-700 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Multi-Campus & District</span>
                <h3 className="text-xl font-bold text-white mt-1">Global Enterprise</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">Custom</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">Designed for regional ministries of education and multi-school chains.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#45D6C6]" />
                    <span>Unlimited schools, teachers, and students</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#45D6C6]" />
                    <span>Custom state/national curriculum mapping</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#45D6C6]" />
                    <span>Private Cloud Firestore & LLM provisioning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#45D6C6]" />
                    <span>24/7 dedicated enterprise SLA & training</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => switchRole('SUPER_ADMIN')}
                className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-xs font-bold text-white transition-colors"
              >
                Inspect Super Admin Command
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#705CF6]">FAQ</span>
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How does AetherLearn AI differ from ChatGPT or general chatbots?',
              a: 'Unlike open conversational models that provide direct answers, AetherLearn AI is specifically tuned with K-12 pedagogical Socratic guardrails. It never gives away homework solutions, but breaks complex concepts into intuitive guiding hints and analogies tailored to the exact grade level.',
            },
            {
              q: 'What languages are supported by the AI Tutor?',
              a: 'AetherLearn natively supports English, Hindi (हिंदी), and Marathi (मराठी) with full mathematical and scientific precision. Students can switch languages at any moment.',
            },
            {
              q: 'How does the Skill Passport work?',
              a: 'When a student builds a real-world project (such as a robotics rover or machine learning classifier), a verified school teacher reviews the code and deliverables. Once approved, a cryptographically signed credential is added to the student’s Skill Passport.',
            },
            {
              q: 'Is student data isolated between different schools?',
              a: 'Yes. School A has strictly zero access to School B’s student records, grades, or faculty information. The architecture uses multi-tenant security rules and role-based access control.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-[#151D30] border border-[#705CF6]/20 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* INSTITUTIONAL INQUIRY FORM */}
      <section className="py-16 bg-[#151D30]/60 border-t border-[#705CF6]/20">
        <div className="max-w-xl mx-auto px-4 text-center space-y-6">
          <h3 className="text-2xl font-bold text-white">Bring AetherLearn to Your School</h3>
          <p className="text-xs text-slate-300">
            Request an institutional walkthrough, district pilot proposal, or custom curriculum demo.
          </p>

          {contactSubmitted ? (
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#45D6C6]/40 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-[#45D6C6] mx-auto" />
              <h4 className="text-sm font-bold text-white">Thank you for your interest!</h4>
              <p className="text-xs text-slate-400">Our academic engineering team will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Principal or Academic Director Name"
                  className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-[#45D6C6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="name@school-district.edu"
                  className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-[#45D6C6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">School / District Name</label>
                <input
                  type="text"
                  required
                  value={contactSchool}
                  onChange={(e) => setContactSchool(e.target.value)}
                  placeholder="e.g. Apex Global STEM Academy"
                  className="w-full rounded-xl bg-[#0B1020] px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:border-[#45D6C6]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#705CF6] to-[#45D6C6] py-3 text-xs font-bold text-[#0B1020] hover:opacity-95 shadow-lg mt-2"
              >
                Request Institutional Walkthrough
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#705CF6]/15 bg-[#0B1020] py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#45D6C6]" />
            <span className="font-bold text-white">AetherLearn AI</span>
            <span>— The K-12 AI Learning OS</span>
          </div>

          <div className="flex flex-wrap gap-6 text-slate-400">
            <button onClick={() => switchRole('STUDENT')} className="hover:text-white">
              Student
            </button>
            <button onClick={() => switchRole('TEACHER')} className="hover:text-white">
              Teacher
            </button>
            <button onClick={() => switchRole('SCHOOL_ADMIN')} className="hover:text-white">
              School Admin
            </button>
            <button onClick={() => switchRole('SUPER_ADMIN')} className="hover:text-white">
              Super Admin
            </button>
            <button onClick={() => switchRole('PARENT')} className="hover:text-white">
              Parent
            </button>
          </div>

          <div>© 2026 AetherLearn Global Technologies. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
