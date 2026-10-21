import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  School,
  Course,
  Lesson,
  Assignment,
  Submission,
  Project,
  SkillRecord,
  ParentChildSummary,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_SCHOOLS,
  INITIAL_COURSES,
  INITIAL_LESSONS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_PROJECTS,
  INITIAL_SKILLS,
  PARENT_CHILDREN_DATA,
} from '../data/seedData';
import { auth, googleProvider, db } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export type AppView =
  | 'public_home'
  | 'public_curriculum'
  | 'public_schools'
  | 'public_pricing'
  | 'public_blog'
  // Student views
  | 'student_overview'
  | 'student_courses'
  | 'student_lesson'
  | 'student_tutor'
  | 'student_quizzes'
  | 'student_projects'
  | 'student_passport'
  | 'student_careers'
  // Teacher views
  | 'teacher_overview'
  | 'teacher_classes'
  | 'teacher_studio'
  | 'teacher_assignments'
  | 'teacher_grading'
  | 'teacher_projects'
  // School Admin views
  | 'school_overview'
  | 'school_teachers'
  | 'school_students'
  | 'school_courses'
  | 'school_analytics'
  | 'school_subscription'
  // Super Admin views
  | 'super_overview'
  | 'super_schools'
  | 'super_users'
  | 'super_ai'
  | 'super_revenue'
  | 'super_security'
  | 'super_seo'
  // Parent views
  | 'parent_overview'
  | 'parent_child'
  | 'parent_assignments'
  | 'parent_ai_summary'
  | 'parent_consent';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  isPublicMode: boolean;
  activeView: AppView;
  language: 'en' | 'hi' | 'mr';
  theme: 'dark' | 'light';
  schools: School[];
  courses: Course[];
  lessons: Record<string, Lesson>;
  assignments: Assignment[];
  submissions: Submission[];
  projects: Project[];
  skills: SkillRecord[];
  parentChildren: ParentChildSummary[];
  selectedChildId: string;
  activeCourseId: string;
  activeLessonId: string;
  toasts: ToastMessage[];
  firebaseUser: FirebaseUser | null;

  // Auth actions
  signInGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;

  // Actions
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void;
  toggleTheme: () => void;
  switchRole: (role: UserRole | 'PUBLIC') => void;
  setActiveView: (view: AppView) => void;
  openCourse: (courseId: string) => void;
  openLesson: (lessonId: string) => void;
  selectChild: (childId: string) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Domain Actions
  completeLesson: (lessonId: string) => void;
  submitAssignment: (assignmentId: string, content: string, fileAttachment?: string) => void;
  gradeSubmission: (submissionId: string, score: number, feedback: string) => void;
  createProject: (newProject: Omit<Project, 'id' | 'status' | 'studentId' | 'studentName' | 'grade'>) => void;
  verifyProject: (projectId: string, badgeName: string, teacherFeedback: string) => void;
  enrollInCourse: (courseId: string) => void;
  registerSchool: (schoolData: Partial<School>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('STUDENT');
  const [isPublicMode, setIsPublicMode] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS.student);
  const [activeView, setActiveView] = useState<AppView>('student_overview');
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Domain state
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [lessons, setLessons] = useState<Record<string, Lesson>>(INITIAL_LESSONS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [skills, setSkills] = useState<SkillRecord[]>(INITIAL_SKILLS);
  const [parentChildren] = useState<ParentChildSummary[]>(PARENT_CHILDREN_DATA);
  const [selectedChildId, setSelectedChildId] = useState<string>('usr_student');

  const [activeCourseId, setActiveCourseId] = useState<string>('course_ai_10');
  const [activeLessonId, setActiveLessonId] = useState<string>('course_ai_10_l1');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        addToast({
          type: 'success',
          title: 'Google Account Authenticated',
          message: `Logged in as ${user.displayName || user.email}`,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const signInGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        // Sync user profile to Firestore
        const userRef = doc(db, 'users', result.user.uid);
        await setDoc(
          userRef,
          {
            id: result.user.uid,
            name: result.user.displayName || 'Learner',
            email: result.user.email || '',
            role: currentRole,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        // Normal user action (closed or dismissed popup)
        addToast({
          type: 'info',
          title: 'Sign-In Dismissed',
          message: 'Google sign-in popup was closed. You can continue with demo personas or try again anytime.',
        });
        return;
      }

      if (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup-blocked')) {
        addToast({
          type: 'warning',
          title: 'Popup Blocked',
          message: 'Your browser blocked the sign-in popup window. Please allow popups for this site.',
        });
        return;
      }

      console.warn('Firebase Auth notice:', err?.message || err);
      addToast({
        type: 'error',
        title: 'Sign In Failed',
        message: err?.message || 'Could not sign in with Google.',
      });
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      addToast({
        type: 'info',
        title: 'Signed Out',
        message: 'Successfully signed out of Google account.',
      });
    } catch (err: any) {
      console.error('Sign Out Error:', err);
    }
  };

  // Apply dark/light theme to document root
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.body.classList.remove('bg-[#0B1020]', 'text-[#F8FAFC]');
      document.body.classList.add('bg-[#F8FAFC]', 'text-[#0F172A]');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('bg-[#F8FAFC]', 'text-[#0F172A]');
      document.body.classList.add('bg-[#0B1020]', 'text-[#F8FAFC]');
    }
  }, [theme]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const switchRole = (role: UserRole | 'PUBLIC') => {
    if (role === 'PUBLIC') {
      setIsPublicMode(true);
      setActiveView('public_home');
      addToast({
        type: 'info',
        title: 'Viewing Public Portal',
        message: 'Exploring AetherLearn AI public landing page, curriculum and school solutions.',
      });
      return;
    }

    setIsPublicMode(false);
    setCurrentRole(role);

    if (role === 'SUPER_ADMIN') {
      setCurrentUser(DEMO_USERS.super_admin);
      setActiveView('super_overview');
    } else if (role === 'SCHOOL_ADMIN') {
      setCurrentUser(DEMO_USERS.school_admin);
      setActiveView('school_overview');
    } else if (role === 'TEACHER') {
      setCurrentUser(DEMO_USERS.teacher);
      setActiveView('teacher_overview');
    } else if (role === 'STUDENT') {
      setCurrentUser(DEMO_USERS.student);
      setActiveView('student_overview');
    } else if (role === 'PARENT') {
      setCurrentUser(DEMO_USERS.parent);
      setActiveView('parent_overview');
    }

    addToast({
      type: 'success',
      title: `Switched to ${role.replace('_', ' ')}`,
      message: `Active user: ${DEMO_USERS[role.toLowerCase() as keyof typeof DEMO_USERS]?.name}`,
    });
  };

  const openCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    setActiveView('student_courses');
  };

  const openLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveView('student_lesson');
  };

  const selectChild = (childId: string) => {
    setSelectedChildId(childId);
  };

  const completeLesson = (lessonId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === activeCourseId) {
          const current = c.completedLessons || 0;
          return { ...c, completedLessons: Math.min(c.lessonsCount, current + 1) };
        }
        return c;
      })
    );

    // Award XP to student
    if (currentRole === 'STUDENT') {
      setCurrentUser((prev) => {
        const newXp = (prev.xp || 0) + 150;
        return {
          ...prev,
          xp: newXp,
          level: Math.floor(newXp / 500) + 1,
        };
      });
    }

    addToast({
      type: 'success',
      title: 'Lesson Completed! +150 XP',
      message: 'Your learning progress and mastery graph have been updated.',
    });
  };

  const submitAssignment = (assignmentId: string, content: string, fileAttachment?: string) => {
    const targetAssignment = assignments.find((a) => a.id === assignmentId);
    const newSub: Submission = {
      id: `sub_${Date.now()}`,
      assignmentId,
      assignmentTitle: targetAssignment?.title || 'Course Assignment',
      studentId: currentUser.id,
      studentName: currentUser.name,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      content,
      fileAttachment,
      status: 'PENDING',
    };

    setSubmissions((prev) => [newSub, ...prev]);
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, submissionsCount: a.submissionsCount + 1 } : a))
    );

    addToast({
      type: 'success',
      title: 'Assignment Submitted',
      message: 'Your teacher has received your work for grading.',
    });
  };

  const gradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: 'GRADED', gradeScore: score, feedback } : s))
    );

    addToast({
      type: 'success',
      title: 'Submission Graded',
      message: `Assigned score: ${score}/100 with teacher feedback.`,
    });
  };

  const createProject = (newProject: Omit<Project, 'id' | 'status' | 'studentId' | 'studentName' | 'grade'>) => {
    const proj: Project = {
      ...newProject,
      id: `proj_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      grade: currentUser.grade || 10,
      status: 'SUBMITTED',
      likesCount: 1,
    };

    setProjects((prev) => [proj, ...prev]);

    addToast({
      type: 'success',
      title: 'Capstone Project Submitted!',
      message: 'Your project is now in the Teacher Verification Queue for Skill Passport issuance.',
    });
  };

  const verifyProject = (projectId: string, badgeName: string, teacherFeedback: string) => {
    const hash = `SK-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    let studentId = '';
    let studentName = '';
    let projTitle = '';

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          studentId = p.studentId;
          studentName = p.studentName;
          projTitle = p.title;
          return {
            ...p,
            status: 'VERIFIED',
            verifiedByTeacherId: currentUser.id,
            verifiedByTeacherName: currentUser.name,
            verifiedDate: new Date().toISOString().split('T')[0],
            teacherFeedback,
            skillBadge: {
              name: badgeName,
              icon: 'Award',
              issuer: 'Apex STEM Academy & AetherLearn Global',
              hash,
            },
          };
        }
        return p;
      })
    );

    // Issue to Skill Passport
    const newSkillRecord: SkillRecord = {
      id: `sk_${Date.now()}`,
      studentId: studentId || 'usr_student',
      studentName: studentName || 'Student',
      grade: 10,
      skillName: badgeName,
      category: 'AI & Engineering',
      masteryLevel: 'Master',
      masteryScore: 95,
      issuedAt: new Date().toISOString().split('T')[0],
      issuingOrganization: 'AetherLearn Global Credential Network',
      verificationHash: hash,
      evidenceProjectId: projectId,
    };

    setSkills((prev) => [newSkillRecord, ...prev]);

    addToast({
      type: 'success',
      title: 'Skill Verified & Passport Updated!',
      message: `Verified badge "${badgeName}" with verifiable cryptographic hash.`,
    });
  };

  const enrollInCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, enrolledStudentsCount: c.enrolledStudentsCount + 1 } : c))
    );
    setCurrentUser((prev) => ({
      ...prev,
      enrolledCourseIds: [...(prev.enrolledCourseIds || []), courseId],
    }));
    addToast({
      type: 'success',
      title: 'Enrolled in Course',
      message: 'You now have full access to lessons, quizzes, and projects.',
    });
  };

  const registerSchool = (schoolData: Partial<School>) => {
    const newSchool: School = {
      id: `sch_${Date.now()}`,
      name: schoolData.name || 'New Academy',
      code: `SCH-${Math.floor(100 + Math.random() * 900)}`,
      city: schoolData.city || 'Global',
      country: schoolData.country || 'Global',
      studentCount: schoolData.studentCount || 250,
      teacherCount: schoolData.teacherCount || 15,
      plan: schoolData.plan || 'Pro Academy',
      status: 'ACTIVE',
      contactEmail: schoolData.contactEmail || 'admin@school.edu',
      joinedDate: new Date().toISOString().split('T')[0],
      aiTokensUsedMonth: 50000,
    };

    setSchools((prev) => [newSchool, ...prev]);
    addToast({
      type: 'success',
      title: 'School Enrolled',
      message: `${newSchool.name} is now provisioned on the platform.`,
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        isPublicMode,
        activeView,
        language,
        theme,
        schools,
        courses,
        lessons,
        assignments,
        submissions,
        projects,
        skills,
        parentChildren,
        selectedChildId,
        activeCourseId,
        activeLessonId,
        toasts,
        firebaseUser,
        signInGoogle,
        signOutUser,
        setLanguage,
        toggleTheme,
        switchRole,
        setActiveView,
        openCourse,
        openLesson,
        selectChild,
        addToast,
        removeToast,
        completeLesson,
        submitAssignment,
        gradeSubmission,
        createProject,
        verifyProject,
        enrollInCourse,
        registerSchool,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
