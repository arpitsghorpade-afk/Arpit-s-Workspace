export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  schoolName?: string;
  grade?: number; // 1 - 12 (for students)
  avatar?: string;
  xp?: number;
  level?: number;
  streakDays?: number;
  enrolledCourseIds?: string[];
  bio?: string;
  childrenIds?: string[]; // for parents
}

export interface School {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  studentCount: number;
  teacherCount: number;
  plan: 'Starter' | 'Pro Academy' | 'Global Enterprise';
  status: 'ACTIVE' | 'PENDING' | 'TRIAL';
  contactEmail: string;
  joinedDate: string;
  aiTokensUsedMonth: number;
}

export interface Course {
  id: string;
  title: string;
  grade: number; // 1-12
  subject: string; // e.g., 'Artificial Intelligence', 'Physics', 'Mathematics', 'Robotics', 'Foundational STEM'
  category: 'STEM' | 'AI & Computing' | 'Humanities' | 'Language' | 'Science & Space';
  thumbnail: string;
  description: string;
  lessonsCount: number;
  completedLessons?: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsTaught: string[];
  instructorName: string;
  enrolledStudentsCount: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  chapterNumber: number;
  durationMins: number;
  summary: string;
  content: string; // markdown or rich text
  keyTakeaways: string[];
  simulationType?: 'interactive_math' | 'code_playground' | 'logic_circuit' | 'concept_animator';
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  teacherId: string;
  teacherName: string;
  grade: number;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  status: 'ACTIVE' | 'ARCHIVED';
  submissionsCount: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  fileAttachment?: string;
  status: 'PENDING' | 'GRADED';
  gradeScore?: number;
  feedback?: string;
}

export interface ProjectEvidence {
  type: 'github' | 'live_demo' | 'drive' | 'text' | 'image';
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  studentId: string;
  studentName: string;
  grade: number;
  subject: string;
  summary: string;
  deliverables: string[];
  evidences: ProjectEvidence[];
  status: 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'NEEDS_REVISION';
  verifiedByTeacherId?: string;
  verifiedByTeacherName?: string;
  verifiedDate?: string;
  skillBadge?: {
    name: string;
    icon: string;
    issuer: string;
    hash: string;
  };
  teacherFeedback?: string;
  likesCount?: number;
}

export interface SkillRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: number;
  skillName: string;
  category: string;
  masteryLevel: 'Apprentice' | 'Proficient' | 'Master' | 'Visionary';
  masteryScore: number;
  issuedAt: string;
  issuingOrganization: string;
  verificationHash: string;
  evidenceProjectId: string;
}

export interface ParentChildSummary {
  childId: string;
  childName: string;
  grade: number;
  avatar: string;
  overallMasteryPct: number;
  weeklyStudyHours: number;
  completedLessonsCount: number;
  activeAssignmentsCount: number;
  attendancePct: number;
  recentTopicExplored: string;
  aiTutorSentiment: 'Curious & Consistent' | 'Needs Math Encouragement' | 'High Performance';
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
  language?: 'en' | 'hi' | 'mr';
  hintsGiven?: number;
}
