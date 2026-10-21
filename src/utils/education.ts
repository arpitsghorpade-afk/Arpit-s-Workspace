/**
 * Educational domain utilities, calculations, and AI prompt generators.
 * Pure logic decoupled from UI for testability and deterministic operation.
 */

export type GradeTier = 'primary' | 'middle' | 'high' | 'senior';

export interface GradeTierInfo {
  tier: GradeTier;
  title: string;
  gradeRange: string;
  tone: string;
  suitableTools: string[];
}

export function getGradeTier(grade: number): GradeTierInfo {
  const g = Math.max(1, Math.min(12, Math.floor(grade)));
  if (g <= 5) {
    return {
      tier: 'primary',
      title: 'Primary Explorers (Grades 1-5)',
      gradeRange: 'Grades 1-5',
      tone: 'playful, encouraging, visually descriptive, simple analogies',
      suitableTools: ['Visual Puzzles', 'Story Math', 'Nature Science', 'Scratch Coding'],
    };
  }
  if (g <= 8) {
    return {
      tier: 'middle',
      title: 'Middle School Innovators (Grades 6-8)',
      gradeRange: 'Grades 6-8',
      tone: 'curious, structured, step-by-step guidance, real-world connections',
      suitableTools: ['Block to Python', 'Pre-Algebra', 'Robotics Basics', 'Earth Systems'],
    };
  }
  if (g <= 10) {
    return {
      tier: 'high',
      title: 'High School Builders (Grades 9-10)',
      gradeRange: 'Grades 9-10',
      tone: 'analytical, academically rigorous, conceptual problem solving',
      suitableTools: ['Python & AI Basics', 'Geometry & Algebra II', 'Physics & Chem Lab', 'Design Thinking'],
    };
  }
  return {
    tier: 'senior',
    title: 'Senior High Scholars (Grades 11-12)',
    gradeRange: 'Grades 11-12',
    tone: 'pre-collegiate, industry-aligned, deep conceptual reasoning, capstone focus',
    suitableTools: ['Machine Learning', 'Advanced Calculus', 'Biotechnology', 'Quantum Computing Intro'],
  };
}

export function calculateLevel(xp: number): {
  level: number;
  currentLevelBaseXp: number;
  nextLevelXp: number;
  progressPct: number;
} {
  const safeXp = Math.max(0, Math.floor(xp));
  const XP_PER_LEVEL = 500;
  const level = Math.floor(safeXp / XP_PER_LEVEL) + 1;
  const currentLevelBaseXp = (level - 1) * XP_PER_LEVEL;
  const nextLevelXp = level * XP_PER_LEVEL;
  const progressPct = Math.min(100, Math.round(((safeXp - currentLevelBaseXp) / XP_PER_LEVEL) * 100));

  return {
    level,
    currentLevelBaseXp,
    nextLevelXp,
    progressPct,
  };
}

export interface SkillMasteryInput {
  lessonCompletionRate: number; // 0 - 1
  quizAverageScore: number;     // 0 - 100
  verifiedProjectsCount: number; // 0+
}

export function calculateSkillMastery(input: SkillMasteryInput): {
  masteryScore: number; // 0 - 100
  tierLabel: 'Novice' | 'Apprentice' | 'Proficient' | 'Master' | 'Visionary';
  isPassportEligible: boolean;
} {
  const lessonComp = Math.max(0, Math.min(1, input.lessonCompletionRate)) * 100;
  const quizScore = Math.max(0, Math.min(100, input.quizAverageScore));
  const projectScore = Math.min(100, Math.max(0, input.verifiedProjectsCount * 25));

  // Weights: 30% lessons, 35% quizzes, 35% verified projects (Learn -> Build -> Prove)
  const masteryScore = Math.round(lessonComp * 0.3 + quizScore * 0.35 + projectScore * 0.35);

  let tierLabel: 'Novice' | 'Apprentice' | 'Proficient' | 'Master' | 'Visionary' = 'Novice';
  if (masteryScore >= 90) tierLabel = 'Visionary';
  else if (masteryScore >= 75) tierLabel = 'Master';
  else if (masteryScore >= 60) tierLabel = 'Proficient';
  else if (masteryScore >= 40) tierLabel = 'Apprentice';

  return {
    masteryScore,
    tierLabel,
    isPassportEligible: masteryScore >= 70 && input.verifiedProjectsCount >= 1,
  };
}

export function buildSocraticPrompt(options: {
  grade: number;
  subject: string;
  language?: 'en' | 'hi' | 'mr';
  mode?: 'socratic_hints' | 'explain_concept' | 'generate_quiz' | 'review_project';
}): string {
  const { grade, subject, language = 'en', mode = 'socratic_hints' } = options;
  const tier = getGradeTier(grade);

  const langInstructions: Record<string, string> = {
    en: 'Respond in clear, accessible English appropriate for the student.',
    hi: 'उत्तर सरल, स्पष्ट और सहज हिंदी (Devanagari script) में दें। तकनीकी शब्दों को कोष्ठक में अंग्रेजी में भी लिखें।',
    mr: 'उत्तर सोप्या आणि ओघवत्या मराठी भाषेत (Devanagari script) द्या. क्लिष्ट वैज्ञानिक किंवा तांत्रिक शब्दांसाठी कंसात इंग्रजी शब्द वापरा.',
  };

  const selectedLangInstruction = langInstructions[language] || langInstructions.en;

  const modeInstructions: Record<string, string> = {
    socratic_hints:
      'CRITICAL PEDAGOGY: Act as an interactive Socratic AI Tutor. Do NOT give away the final answer directly. Ask guiding questions, break down the core concept into simple bite-sized steps, and encourage the student to think through the solution.',
    explain_concept:
      'Explain the concept clearly using an engaging real-world metaphor, a step-by-step example, and a 2-question quick-check for comprehension.',
    generate_quiz:
      'Generate 3 progressive questions (1 easy, 1 medium, 1 application-based challenge) tailored for this exact grade level with detailed solution rationales.',
    review_project:
      'Provide constructive, inspiring feedback on the student project. Highlight 2 strengths, 1 area for enhancement, and suggest an advanced real-world extension.',
  };

  return `You are AetherLearn AI, the world-class AI Personal Tutor for K-12 students.
Current Student Context:
- Academic Grade: Grade ${grade} (${tier.title})
- Domain / Subject: ${subject}
- Tone and Pedagogical Style: ${tier.tone}
- Language Directive: ${selectedLangInstruction}
- Mode Directive: ${modeInstructions[mode] || modeInstructions.socratic_hints}

Safety & Age Appropriateness:
- Ensure all content is 100% kid-safe, respectful, encouraging, and adheres to strict educational boundaries.
- Keep explanations crisp, formatting with bold text, bullet points, and code/math blocks when helpful.`;
}
