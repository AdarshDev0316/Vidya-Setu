'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import {
  MessageSquare, X, Send, Bot, User, Sparkles, Shield,
  ChevronDown, ArrowRight, CheckCircle2, Clock, ThumbsUp,
  AlertCircle, RefreshCw, HelpCircle, FileText, Star, Lock,
  ShieldCheck, AlertTriangle, KeyRound, LogOut, Check, Eye, EyeOff
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionPills?: {
    label: string;
    href: string;
    primary?: boolean;
    roleLogin?: string;
  }[];
  isAlert?: boolean;
}

interface FeedbackRecord {
  id: string;
  ticketNo: string;
  role: string;
  category: string;
  subject: string;
  description: string;
  rating: number;
  status: string;
  createdAt: string;
}

const DEMO_ACCOUNTS = [
  { role: 'student', label: 'Student', email: 'student@iitb.ac.in', pass: 'Student@123', icon: '🎓', desc: 'APAAR ID, ABC credits, degree verification certificate, name corrections' },
  { role: 'institution_admin', label: 'College Admin', email: 'admin@iitb.ac.in', pass: 'Admin@123', icon: '🏛️', desc: 'Batch student upload, seat intake ceilings, 15% supernumerary, duplicates' },
  { role: 'aicte_officer', label: 'AICTE Officer', email: 'officer@aicte.gov.in', pass: 'Officer@123', icon: '📋', desc: 'National intake monitor, anomaly engine triage, compliance audits' },
  { role: 'employer', label: 'Employer / HR', email: 'employer@infosys.com', pass: 'Employer@123', icon: '🏢', desc: 'Purpose-limited candidate verification, SHA-256 QR checking' },
  { role: 'auditor', label: 'Statutory Auditor', email: 'auditor@cag.gov.in', pass: 'Auditor@123', icon: '🔍', desc: 'Read-only compliance records and submission audit logs' },
];

const AUTHORIZED_ROLE_PROMPTS: Record<string, string[]> = {
  student: [
    'How do I check my ABC credits balance?',
    'How do I download my verified degree certificate?',
    'Request a correction in my name or DOB',
    'Am I eligible for UGC dual-degree enrollment?'
  ],
  institution_admin: [
    'What is the prescribed CSV schema for batch student upload?',
    'How does the system enforce the 15% supernumerary ceiling?',
    'How do I resolve duplicate APAAR ID flags?',
    'Download AICTE Approval Process Handbook (APH) guide'
  ],
  aicte_officer: [
    'How does the anomaly engine flag intake quota breaches?',
    'How do I initiate an institutional admission freeze?',
    'View state-wise reservation compliance analytics',
    'What are the audit standards under DPDP Act 2023?'
  ],
  employer: [
    'How can I verify a candidate’s degree using APAAR ID?',
    'What student data is shielded under DPDP Act 2023?',
    'How do I verify the cryptographic SHA-256 QR code?',
    'Is there any fee charged for candidate background verification?'
  ],
  auditor: [
    'View statutory compliance logs and submission timestamps',
    'How does the platform ensure tamper-proof audit trails?'
  ],
  public: [
    'What is APAAR ID and why is it mandatory under NEP 2020?',
    'Where is the free public verification portal?',
    'AICTE 24x7 Helpline numbers and contacts',
    'View AICTE Approval Process & Reservation Guidelines'
  ]
};

export default function RoleAwareAIHelpdesk() {
  const router = useRouter();
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'login' | 'feedback' | 'tickets'>('chat');

  // Authentication & Clearance State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('public');
  const [userName, setUserName] = useState<string>('Normal User');
  const [userInstitution, setUserInstitution] = useState<string>('');
  const [userClearance, setUserClearance] = useState<string>('Normal User (Public Information Only)');

  // Chat state
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // In-Chatbot Login form state
  const [loginRole, setLoginRole] = useState('student');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Feedback form state
  const [feedbackCategory, setFeedbackCategory] = useState('Data Correction Request');
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackDesc, setFeedbackDesc] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Saved tickets history
  const [savedTickets, setSavedTickets] = useState<FeedbackRecord[]>([]);

  // Check authentication session on mount, pathname change, and whenever open state changes
  useEffect(() => {
    checkUserSession();
    loadTickets();
  }, [isOpen, pathname]);

  useEffect(() => {
    const handleSync = () => {
      checkUserSession();
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const checkUserSession = () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        const u = JSON.parse(userStr);
        setIsAuthenticated(true);
        const role = u.role || 'student';
        setUserRole(role);
        setUserName(u.name || 'Authorized User');
        setUserInstitution(u.institution || 'AICTE Affiliated Entity');

        let clearance = 'Level 1 - Student Academic Identity (Self Records Only)';
        if (role.includes('admin') || role.includes('operator') || role.includes('approver')) {
          clearance = 'Level 3 - Institutional Administration (Campus Ledger)';
        } else if (role.includes('aicte')) {
          clearance = 'Level 4 - AICTE Central Regulation Bureau (Full Oversight)';
        } else if (role === 'employer') {
          clearance = 'Level 2 - Recruiter / Verification Clearance (Purpose-Limited)';
        } else if (role === 'auditor') {
          clearance = 'Level 3A - Statutory Auditor (Read-Only Audit Logs)';
        }
        setUserClearance(clearance);
        initializeWelcomeMessage(true, role, u.name || 'Authorized User', clearance, u.institution);
        return;
      }
    } catch {
      // fallback
    }

    setIsAuthenticated(false);
    setUserRole('public');
    setUserName('Normal User');
    setUserInstitution('');
    setUserClearance('Normal User (Public Information Only)');
    initializeWelcomeMessage(false, 'public', 'Normal User', 'Normal User (Public Information Only)', '');
  };

  const loadTickets = () => {
    try {
      const local = localStorage.getItem('vidyasetu_feedback_records');
      if (local) {
        setSavedTickets(JSON.parse(local));
      } else {
        fetch('/api/feedback')
          .then(res => res.json())
          .then(data => {
            if (data.success && data.items) {
              setSavedTickets(data.items);
              localStorage.setItem('vidyasetu_feedback_records', JSON.stringify(data.items));
            }
          })
          .catch(() => {});
      }
    } catch {
      // ignore
    }
  };

  const initializeWelcomeMessage = (
    authenticated: boolean,
    role: string,
    name: string,
    clearance: string,
    institution: string
  ) => {
    let welcome = '';
    let pills: { label: string; href: string; primary?: boolean; roleLogin?: string }[] = [];

    if (!authenticated || role === 'public') {
      welcome = `Namaste! 🙏 Welcome to the **VIDYA-SETU Role-Aware AI Helpdesk**.\n\nYou are currently chatting as a **Normal User** (Unauthenticated Guest).\n\n• **Public Information:** As a normal user, you can ask about general APAAR ID guidelines, public student verification, published circulars, and AICTE helpline contacts.\n• **Role-Based Access Enforcement:** Information is strictly role-isolated—no all info is delivered to anybody. If your role is other than a normal user (Student, College Admin, AICTE Officer, or Employer), **first log in with your role** below to unlock your authorized queries.`;
      pills = [
        { label: '🎓 Log in as Student', href: '#role-login', roleLogin: 'student', primary: true },
        { label: '🏛️ Log in as College Admin', href: '#role-login', roleLogin: 'institution_admin' },
        { label: '📋 Log in as AICTE Officer', href: '#role-login', roleLogin: 'aicte_officer' },
        { label: '🏢 Log in as Employer', href: '#role-login', roleLogin: 'employer' },
        { label: '🔍 Public Student Verification', href: '/verify' },
        { label: '📜 Policy Guidelines Directory', href: '/guidelines' }
      ];
    } else if (role === 'student') {
      welcome = `Namaste ${name}! 🎓 You are logged in with **${clearance}**.\n\n**Authorized Information for Student Role:**\n• View personal 12-digit APAAR ID details\n• Academic Bank of Credits (ABC) balances & DigiLocker transfers\n• Tamper-proof Degree Verification Certificate with SHA-256 seal\n• Name / DOB demographic correction appeals\n• UGC Dual-Degree concurrent enrollment rules\n\n*Strict Role Boundary: College intake rosters, backend CSV uploads, and regulatory anomaly logs are strictly restricted to Administrators.*`;
      pills = [
        { label: 'Verify My APAAR ID', href: '/verify', primary: true },
        { label: 'View Digital Credentials', href: '/dashboard/credentials' },
        { label: 'Submit Name/DOB Correction', href: '#feedback' },
        { label: 'Read APAAR Mandate Guide', href: '/guidelines/apaar-mandate' }
      ];
    } else if (role.includes('admin') || role.includes('operator') || role.includes('approver')) {
      welcome = `Namaste ${name}! 🏛️ You are logged in with **${clearance}** for **${institution}**.\n\n**Authorized Information for College Admin Role:**\n• Prescribed CSV/Excel schema for batch student uploads\n• Sanctioned seat intake ceilings & Approval Process Handbook (APH) compliance\n• 15% Supernumerary quota caps (FN/NRI/OCI) and 5% Tuition Fee Waiver (TFW)\n• Duplicate APAAR ID conflict resolution protocols\n\n*Strict Role Boundary: Access to other colleges' confidential ledgers or national quota modifications is strictly restricted.*`;
      pills = [
        { label: 'Open Batch Upload', href: '/dashboard/upload', primary: true },
        { label: 'AICTE Approval Handbook', href: '/guidelines/approval-process' },
        { label: 'Check Anomaly Alerts', href: '/dashboard/anomalies' },
        { label: 'Supernumerary Seat Guide', href: '/guidelines/supernumerary-seats' }
      ];
    } else if (role.includes('aicte')) {
      welcome = `Welcome Officer ${name}! 📋 You are logged in with **${clearance}**.\n\n**Authorized Information for AICTE Officer Role:**\n• National enrollment analytics and state quota matrices\n• Automated Anomaly Engine triage (intake breaches, duplicate enrollments)\n• Institutional batch upload freeze powers & show-cause protocols\n• Constitutional reservation quota compliance (GEN, OBC-NCL, SC, ST, EWS, PwD)\n\n*Strict Role Boundary: Raw 12-digit Aadhaar numbers and blockchain ledger keys remain cryptographically shielded under DPDP Act 2023.*`;
      pills = [
        { label: 'AICTE National Monitor', href: '/dashboard/aicte', primary: true },
        { label: 'Regulatory BI Reports', href: '/dashboard/reports' },
        { label: 'Anomaly Engine Triage', href: '/dashboard/anomalies' },
        { label: 'Reservation Policy Guide', href: '/guidelines/reservation-policy' }
      ];
    } else if (role === 'employer') {
      welcome = `Welcome ${name}! 🏢 You are logged in with **${clearance}**.\n\n**Authorized Information for Employer / Recruiter Role:**\n• Purpose-limited candidate academic credential verification\n• Cryptographic SHA-256 certificate QR seal validation\n• Verification status confirmation receipts\n\n*Strict Role Boundary: Under Section 6 of the DPDP Act 2023, full transcripts, GPA breakdowns, phone numbers, and home addresses are shielded from recruiters.*`;
      pills = [
        { label: 'Verify Candidate Record', href: '/verify', primary: true },
        { label: 'NAD Real-Time Norms', href: '/guidelines/nad-depository' }
      ];
    } else {
      welcome = `Welcome ${name}! 🔍 You are logged in with **${clearance}**.\n\n**Authorized Information for Auditor Role:**\n• Read-only access to statutory compliance records\n• Tamper-proof audit logs and timestamped submission trails\n\n*Strict Role Boundary: Uploading batches or altering admission records is prohibited under read-only clearance.*`;
      pills = [
        { label: 'View Audit Logs', href: '/dashboard/audit', primary: true }
      ];
    }

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionPills: pills
      }
    ]);
  };

  // Perform In-Chatbot Login
  const handleInChatLogin = async (e?: React.FormEvent, directAccount?: typeof DEMO_ACCOUNTS[0]) => {
    if (e) e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    setLoginLoading(true);

    const emailToUse = directAccount ? directAccount.email : loginEmail.trim();
    const passwordToUse = directAccount ? directAccount.pass : loginPassword;
    const roleToUse = directAccount ? directAccount.role : loginRole;

    if (!emailToUse || !passwordToUse) {
      setLoginError('Email and password are required.');
      setLoginLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse, password: passwordToUse, role: roleToUse }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Authentication failed. Please verify credentials.');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUserRole(data.user.role);
        setUserName(data.user.name);
        setUserInstitution(data.user.institution || '');

        let clearance = 'Level 1 - Student Academic Identity';
        if (data.user.role.includes('admin') || data.user.role.includes('operator')) clearance = 'Level 3 - Institutional Administration';
        else if (data.user.role.includes('aicte')) clearance = 'Level 4 - AICTE Central Regulation Bureau';
        else if (data.user.role === 'employer') clearance = 'Level 2 - Recruiter / Verification Clearance';
        else if (data.user.role === 'auditor') clearance = 'Level 3A - Statutory Auditor';

        setUserClearance(clearance);
        setLoginSuccess(`Successfully authenticated as ${data.user.name} (${data.user.role.replace('_', ' ')})!`);

        // Post confirmation message in chat
        const authConfirmMsg: ChatMessage = {
          id: `auth-${Date.now()}`,
          sender: 'bot',
          text: `✅ **Authentication Successful!**\n\nYou are now logged in as **${data.user.name}** with **${clearance}**.\n\nNow you can ask questions with the relevant information you are authorized to get for this role. Remember that no all info is delivered to anybody—your access is strictly bounded to ${data.user.role.replace('_', ' ')} permissions. What would you like to query?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionPills: (AUTHORIZED_ROLE_PROMPTS[data.user.role] || []).map(p => ({
            label: p,
            href: '#prompt'
          }))
        };

        setMessages(prev => [...prev, authConfirmMsg]);

        setTimeout(() => {
          setActiveTab('chat');
        }, 500);
      }
    } catch {
      setLoginError('Network error. Unable to verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Perform In-Chatbot Logout (Reset to Normal User)
  const handleInChatLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole('public');
    setUserName('Normal User');
    setUserInstitution('');
    setUserClearance('Normal User (Public Information Only)');

    const logoutMsg: ChatMessage = {
      id: `logout-${Date.now()}`,
      sender: 'bot',
      text: `🔒 **Session Terminated:** You have logged out and returned to **Normal User** mode. Privileged institutional, student, and AICTE records are now locked.\n\nTo query role-specific information again, first log in with that role using the buttons below:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionPills: [
        { label: '🎓 Log in as Student', href: '#role-login', roleLogin: 'student', primary: true },
        { label: '🏛️ Log in as College Admin', href: '#role-login', roleLogin: 'institution_admin' },
        { label: '📋 Log in as AICTE Officer', href: '#role-login', roleLogin: 'aicte_officer' },
        { label: '🏢 Log in as Employer', href: '#role-login', roleLogin: 'employer' },
        { label: '🔍 Public Student Verification', href: '/verify' }
      ]
    };

    setMessages(prev => [...prev, logoutMsg]);
    setActiveTab('chat');
  };

  // Strict Role-Based Knowledge Engine (Only delivers authorized information for that specific role)
  const evaluateRoleQuery = (
    query: string,
    authenticated: boolean,
    role: string
  ): { text: string; actionPills?: { label: string; href: string; primary?: boolean; roleLogin?: string }[]; isAlert?: boolean } => {
    const q = query.toLowerCase();

    // Query Classifiers
    const isStudentQuery =
      q.includes('credit') || q.includes('abc') || q.includes('digilocker') ||
      q.includes('certificate') || q.includes('marksheet') || q.includes('degree') ||
      q.includes('transcript') || q.includes('cgpa') || q.includes('grade') ||
      q.includes('name correction') || q.includes('dob correction') || q.includes('correction') ||
      q.includes('my apaar') || q.includes('my record') || q.includes('my enrollment') ||
      q.includes('dual degree') || q.includes('two degree') || q.includes('simultaneous');

    const isAdminQuery =
      q.includes('batch') || q.includes('csv') || q.includes('upload') ||
      q.includes('schema') || q.includes('excel') || q.includes('roster') ||
      q.includes('seat ceiling') || q.includes('intake ceiling') || q.includes('sanctioned intake') ||
      q.includes('supernumerary') || q.includes('15%') || q.includes('tfw') ||
      q.includes('5%') || q.includes('waiver') || q.includes('duplicate flag') ||
      q.includes('duplicate apaar') || q.includes('conflict resolution') ||
      q.includes('aph') || q.includes('approval handbook') || q.includes('college approval');

    const isAICTEQuery =
      q.includes('national anomaly') || q.includes('anomaly engine') || q.includes('triage') ||
      q.includes('freeze') || q.includes('admission freeze') || q.includes('show cause') ||
      q.includes('penalty') || q.includes('reservation quota') || q.includes('category roster') ||
      q.includes('sc st') || q.includes('obc-ncl') || q.includes('ews quota') ||
      q.includes('constitutional roster') || q.includes('state quota matrix') ||
      q.includes('regulatory report') || q.includes('bi report') || q.includes('central regulation');

    const isEmployerQuery =
      q.includes('employer') || q.includes('recruiter') || q.includes('background check') ||
      q.includes('candidate verification') || q.includes('candidate record') ||
      q.includes('verify candidate') || q.includes('qr seal') || q.includes('sha-256 qr') ||
      q.includes('verification api') || q.includes('hr check');

    const isAuditorQuery =
      q.includes('audit log') || q.includes('audit trail') || q.includes('cag audit') ||
      q.includes('tamper proof') || q.includes('submission timestamp') || q.includes('statutory audit');

    // ─────────────────────────────────────────────────────────
    // CASE A: NORMAL USER (NOT LOGGED IN OR PUBLIC GUEST)
    // ─────────────────────────────────────────────────────────
    if (!authenticated || role === 'public') {
      // 1. Privileged queries attempted by Normal User -> DENY & REQUEST FIRST LOGIN AS THAT ROLE
      if (isStudentQuery) {
        return {
          text: `🔒 **Role Login Required (Student Level 1)**\n\nPersonal academic records, credit bank ledgers, degree certificates, and demographic corrections are protected under Section 6 of the DPDP Act 2023.\n\n**To access student information, you must first log in as a Student.** As a Normal User, this information cannot be delivered to you because not all info is delivered to anybody.\n\nPlease log in as a Student below to unlock student records:`,
          actionPills: [
            { label: '🎓 Sign In as Student', href: '#role-login', roleLogin: 'student', primary: true },
            { label: '🌱 Register Free Student Account', href: '/register' },
            { label: '🔍 Public Student Verification', href: '/verify' }
          ],
          isAlert: true
        };
      }

      if (isAdminQuery) {
        return {
          text: `🔒 **Role Login Required (Institution Admin Level 3)**\n\nBatch student upload schemas, approved seat intake ceilings, 15% supernumerary quotas, and duplicate flag resolutions are strictly restricted to approved college administrators.\n\n**To access college administrative information, you must first log in as an Institution Admin.** As a Normal User, this information cannot be delivered to you.\n\nPlease log in as a College Admin below:`,
          actionPills: [
            { label: '🏛️ Sign In as College Admin', href: '#role-login', roleLogin: 'institution_admin', primary: true },
            { label: '🌱 Register College Account', href: '/register' },
            { label: '📜 AICTE Approval Process Guide', href: '/guidelines/approval-process' }
          ],
          isAlert: true
        };
      }

      if (isAICTEQuery) {
        return {
          text: `🔒 **Role Login Required (AICTE Regulation Bureau Level 4)**\n\nNational intake anomaly triage, quota breach penalties, institutional admission freezes, and reservation compliance audits are executive tools restricted to regulatory officers.\n\n**To access central regulatory information, you must first log in as an AICTE Officer.** As a Normal User, this information cannot be delivered to you.\n\nPlease log in as an AICTE Officer below:`,
          actionPills: [
            { label: '📋 Sign In as AICTE Officer', href: '#role-login', roleLogin: 'aicte_officer', primary: true },
            { label: '📜 Reservation Policy Guide', href: '/guidelines/reservation-policy' }
          ],
          isAlert: true
        };
      }

      if (isEmployerQuery) {
        return {
          text: `🔒 **Role Login Required (Employer / Verifier Level 2)**\n\nCandidate background verification APIs, cryptographic SHA-256 certificate validation, and recruiter clearance tools require recruiter authentication.\n\n**To access candidate verification features, you must first log in as an Employer.** As a Normal User, this information cannot be delivered to you.\n\nPlease log in as an Employer below:`,
          actionPills: [
            { label: '🏢 Sign In as Employer', href: '#role-login', roleLogin: 'employer', primary: true },
            { label: '🔍 Public Student Verification', href: '/verify' }
          ],
          isAlert: true
        };
      }

      if (isAuditorQuery) {
        return {
          text: `🔒 **Role Login Required (Statutory Auditor Level 3A)**\n\nStatutory compliance logs, tamper-proof audit trails, and submission timestamps require Auditor credentials.\n\n**To view audit records, you must first log in as an Auditor.**\n\nPlease log in as an Auditor below:`,
          actionPills: [
            { label: '🔍 Sign In as Auditor', href: '#role-login', roleLogin: 'auditor', primary: true }
          ],
          isAlert: true
        };
      }

      // 2. Allowed queries for Normal User
      if (q.includes('login') || q.includes('sign in') || q.includes('authenticate') || q.includes('role')) {
        return {
          text: `**How Role-Based Access Works on VIDYA-SETU:**\n\nVIDYA-SETU strictly isolates information so that **no all info is delivered to anybody**:\n\n1. **Normal User:** Access to general FAQ, public verification at \`/verify\`, and policy circulars.\n2. **Student (Level 1):** First log in to access your personal APAAR ID, ABC credits, and degree certificates.\n3. **College Admin (Level 3):** First log in to access batch upload schemas, seat intake ceilings, and duplicate flag resolutions.\n4. **AICTE Officer (Level 4):** First log in to access national anomaly engines, upload freezes, and quota audits.\n5. **Employer (Level 2):** First log in to access candidate verification and QR seal validation.\n\nSelect your role below to log in immediately:`,
          actionPills: [
            { label: '🎓 Student Login', href: '#role-login', roleLogin: 'student', primary: true },
            { label: '🏛️ College Admin Login', href: '#role-login', roleLogin: 'institution_admin' },
            { label: '📋 AICTE Officer Login', href: '#role-login', roleLogin: 'aicte_officer' },
            { label: '🏢 Employer Login', href: '#role-login', roleLogin: 'employer' }
          ]
        };
      }

      if (q.includes('apaar') || q.includes('what is apaar') || q.includes('12-digit') || q.includes('nep')) {
        return {
          text: `**What is APAAR ID? (Public Information for Normal Users)**\n\n• **Concept:** The Automated Permanent Academic Account Registry (APAAR ID) is a 12-digit unique national academic identity established under National Education Policy (NEP) 2020 Para 4.8.\n• **Purpose:** It connects all student degrees, diplomas, and course credits into a single verifiable lifelong record across institutions.\n• **Public Verification:** Anyone can verify the validity of a student's enrollment status for free at \`/verify\` without needing to log in.\n• **Role Notice:** To view your own personal credits or certificate, please first log in as a Student.`,
          actionPills: [
            { label: '🔍 Public Student Verification', href: '/verify', primary: true },
            { label: '📜 Read APAAR Mandate Policy', href: '/guidelines/apaar-mandate' },
            { label: '🎓 Student Login', href: '#role-login', roleLogin: 'student' }
          ]
        };
      }

      if (q.includes('helpline') || q.includes('contact') || q.includes('phone') || q.includes('support')) {
        return {
          text: `**AICTE 24x7 Helpline & Support:**\n\n• **Toll-Free Numbers:** \`011-29581222, 011-29581223\` (9:30 AM - 5:30 PM, Mon-Fri)\n• **Support Email:** \`vidyasetu-support@aicte-india.org\`\n• **Central Office:** AICTE Headquarters, Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070\n• **Public Verification:** Free 24x7 instant credential lookup at \`/verify\``,
          actionPills: [
            { label: 'Go to Verification Portal', href: '/verify', primary: true },
            { label: 'All Policy Circulars', href: '/guidelines' }
          ]
        };
      }

      return {
        text: `You are chatting as a **Normal User** (Public FAQ Only).\n\n• As a normal user, you can ask about: APAAR ID overview, public student verification, AICTE helpline contacts, and published policy circulars.\n• **Role-Based Access:** To ask questions about student credits, college batch uploads, seat quotas, or AICTE regulatory triage, **you must first log in with your role** so that only authorized info is delivered to you.\n\nPlease select your role below to log in:`,
        actionPills: [
          { label: '🎓 Log in as Student', href: '#role-login', roleLogin: 'student', primary: true },
          { label: '🏛️ Log in as College Admin', href: '#role-login', roleLogin: 'institution_admin' },
          { label: '📋 Log in as AICTE Officer', href: '#role-login', roleLogin: 'aicte_officer' },
          { label: '🏢 Log in as Employer', href: '#role-login', roleLogin: 'employer' },
          { label: '🔍 Public Student Verification', href: '/verify' }
        ]
      };
    }

    // ─────────────────────────────────────────────────────────
    // CASE B: STUDENT (LEVEL 1 CLEARANCE)
    // ─────────────────────────────────────────────────────────
    if (role === 'student') {
      // 1. Attempting to access Admin / AICTE / Employer information -> STRICT DENIAL
      if (isAdminQuery) {
        return {
          text: `⛔ **Access Denied (Student Role Boundary Violation)**\n\nYou are logged in as an **Enrolled Student** (Level 1 Clearance).\n\nCollege batch CSV uploads, sanctioned seat ceilings, 15% supernumerary quotas, and duplicate admission resolutions are strictly restricted to **Institution Administrators** and **AICTE Officers** under Section 6 of the DPDP Act 2023.\n\nAs a student, you are only authorized to query your personal academic identity, credit bank ledger, and verification certificate. No administrative data is delivered to student accounts.`,
          actionPills: [
            { label: 'Verify My Own Record', href: '/verify', primary: true },
            { label: 'View My Credentials', href: '/dashboard/credentials' },
            { label: 'Submit Name/DOB Correction', href: '#feedback' }
          ],
          isAlert: true
        };
      }

      if (isAICTEQuery) {
        return {
          text: `⛔ **Access Denied (Student Role Boundary Violation)**\n\nYou are logged in as an **Enrolled Student**.\n\nRegulatory anomaly detection, institutional admission freezes, and reservation audits are executive tools restricted to the **AICTE Central Regulation Bureau**. Students cannot access regulatory enforcement ledgers.`,
          actionPills: [
            { label: 'Verify My Own Record', href: '/verify', primary: true },
            { label: 'View My Credentials', href: '/dashboard/credentials' }
          ],
          isAlert: true
        };
      }

      if (isEmployerQuery) {
        return {
          text: `⛔ **Access Denied (Student Role Boundary Violation)**\n\nRecruiter candidate screening dashboards are purpose-limited to verified **Employers**. As a student, you can verify your own certificate at \`/verify\` or download it from your Student Dashboard.`,
          actionPills: [
            { label: 'Download My Certificate', href: '/dashboard/credentials', primary: true },
            { label: 'Verify My Own Certificate', href: '/verify' }
          ],
          isAlert: true
        };
      }

      // 2. Allowed Student Queries
      if (q.includes('credit') || q.includes('abc') || q.includes('digilocker')) {
        return {
          text: `**Your Academic Bank of Credits (ABC) Status (Authorized for Student):**\n\n• **Credit Repository:** Your earned course credits are automatically deposited into your DigiLocker ABC account by your approved college upon result declaration.\n• **Multiple Exit / Re-entry (MEME):** Under NEP 2020, you can earn a Certificate (40 credits), Diploma (80 credits), or B.Tech Degree (160 credits).\n• **Tamper-Proof Ledger:** All credits are cryptographically sealed in the National Academic Depository (NAD).`,
          actionPills: [
            { label: 'View My Credentials Vault', href: '/dashboard/credentials', primary: true },
            { label: 'ABC & DigiLocker Guidelines', href: '/guidelines/abc-credits' }
          ]
        };
      }

      if (q.includes('certificate') || q.includes('download') || q.includes('degree') || q.includes('marksheet')) {
        return {
          text: `**Your Verified Degree Certificate & QR Validation (Authorized for Student):**\n\n• **Download:** You can download your digitally signed verification certificate from your Student Dashboard.\n• **Verifiable QR Code:** Every issued certificate incorporates a secure SHA-256 cryptographic seal.\n• **Zero Attestation Fees:** Employers can scan your QR code instantly without charging you any physical transcript fees.`,
          actionPills: [
            { label: 'Download My Certificate', href: '/dashboard/credentials', primary: true },
            { label: 'Test QR Verification', href: '/verify' }
          ]
        };
      }

      if (q.includes('correct') || q.includes('name') || q.includes('dob') || q.includes('error') || q.includes('spelling')) {
        return {
          text: `**Student Record Rectification Protocol (Authorized for Student):**\n\nIf your name, date of birth, or college details contain an error:\n\n1. Switch to the **📝 Feedback** tab in this chatbot.\n2. Select \`Data Correction Request\`.\n3. Enter your correct details and Roll Number.\n4. Your request will generate an official **Tracking Reference Number** (e.g. \`VS-TKT-2026-XXXXX\`) logged for your College Nodal Officer to verify.`,
          actionPills: [
            { label: 'Go to Feedback Tab', href: '#feedback', primary: true }
          ]
        };
      }

      if (q.includes('dual') || q.includes('two degree') || q.includes('simultaneous')) {
        return {
          text: `**UGC Dual Degree Guidelines for Students:**\n\n• You may pursue two academic degrees simultaneously: one in full-time physical mode and another in online/ODL mode, or two online/ODL programmes.\n• Class timings must not clash.\n• Both enrollments are mapped under your single 12-digit APAAR ID without triggering duplicate student anomalies.`,
          actionPills: [
            { label: 'Check My Enrollment Status', href: '/dashboard' }
          ]
        };
      }

      return {
        text: `You are logged in as an **Enrolled Student**.\n\nYou have access to your personal academic records, ABC credit transfers, and degree verification. How can I assist you with your student records?`,
        actionPills: [
          { label: 'Verify My APAAR ID', href: '/verify', primary: true },
          { label: 'View Digital Credentials', href: '/dashboard/credentials' },
          { label: 'Submit Correction Request', href: '#feedback' }
        ]
      };
    }

    // ─────────────────────────────────────────────────────────
    // CASE C: INSTITUTION ADMIN / NODAL OPERATOR (LEVEL 3)
    // ─────────────────────────────────────────────────────────
    if (role.includes('admin') || role.includes('operator') || role.includes('approver')) {
      // 1. Attempting to query student private wallet or modify national policy -> STRICT DENIAL
      if (isStudentQuery && (q.includes('my credits') || q.includes('my degree') || q.includes('my certificate'))) {
        return {
          text: `⛔ **Access Denied (Institution Admin Boundary Violation)**\n\nYou are logged in as an **Institution Administrator** for your college.\n\nUnder Section 6 of the DPDP Act 2023, individual student DigiLocker credit wallets and personal credentials are protected student identity assets. College Admins may upload and verify admission rosters, but cannot inspect or download an individual student's personal private wallet without consent.`,
          actionPills: [
            { label: 'View College Dashboard', href: '/dashboard', primary: true },
            { label: 'Check Batch Upload', href: '/dashboard/upload' }
          ],
          isAlert: true
        };
      }

      if (
        q.includes('other college') || q.includes('other institution') ||
        q.includes('modify national quota') || q.includes('national reservation percentage') ||
        q.includes('freeze institution')
      ) {
        return {
          text: `⛔ **Access Denied (Institution Admin Boundary Violation)**\n\nYou are logged in as an **Institution Administrator**.\n\nUnder AICTE multi-tenant data governance, your authorization is strictly restricted to **your own college's admission ledger, batch upload engine, and approved intake ceilings**.\n\nQuerying other colleges' admission records, freezing institutions, or modifying national reservation percentages requires **AICTE Central Regulation Bureau** executive authorization.`,
          actionPills: [
            { label: 'View My College Dashboard', href: '/dashboard', primary: true },
            { label: 'Check Batch Upload', href: '/dashboard/upload' }
          ],
          isAlert: true
        };
      }

      // 2. Allowed Admin Queries
      if (q.includes('csv') || q.includes('upload') || q.includes('format') || q.includes('batch') || q.includes('schema')) {
        return {
          text: `**Prescribed Batch Student Data Schema (Authorized for Institution Admins):**\n\nUpload bulk enrollment records in CSV/Excel with mandatory columns:\n\n1. \`apaar_id\` (12 numeric digits)\n2. \`student_name\` (Full legal name)\n3. \`roll_number\` (Institutional roll no)\n4. \`program_code\` & \`branch\` (e.g. B.Tech CSE)\n5. \`admission_category\` (GEN, OBC-NCL, SC, ST, EWS, PwD)\n6. \`quota_type\` (Merit, Management, FN/NRI, TFW)\n7. \`academic_year\` (e.g. 2024-25)\n\nVIDYA-SETU performs automated pre-validation against AICTE seat limits and flags duplicates before committing records.`,
          actionPills: [
            { label: 'Open Batch Upload Portal', href: '/dashboard/upload', primary: true },
            { label: 'AICTE Approval Guide', href: '/guidelines/approval-process' }
          ]
        };
      }

      if (q.includes('supernumerary') || q.includes('quota') || q.includes('nri') || q.includes('tfw') || q.includes('ceiling')) {
        return {
          text: `**Approved Seat Intake & Quota Ceilings (Authorized for Institution Admins):**\n\n• **Approved Intake:** Total general enrollment must not exceed the sanctioned ceiling in your approval order.\n• **Foreign National / NRI / OCI:** Capped at a strict maximum of **15% supernumerary** over sanctioned intake.\n• **Tuition Fee Waiver (TFW):** Maximum **5% supernumerary** seats for meritorious students with family income under ₹8 Lakh/year.\n• **Anomaly Warning:** Exceeding these statutory quotas automatically triggers a Red Anomaly alert to the AICTE Regional Office.`,
          actionPills: [
            { label: 'Supernumerary Quota Guide', href: '/guidelines/supernumerary-seats', primary: true },
            { label: 'AICTE Approval Handbook', href: '/guidelines/approval-process' },
            { label: 'Check Anomaly Alerts', href: '/dashboard/anomalies' }
          ]
        };
      }

      if (q.includes('duplicate') || q.includes('flag') || q.includes('conflict')) {
        return {
          text: `**Duplicate APAAR Flag Resolution Protocol (Authorized for Institution Admins):**\n\nWhen a student is flagged as enrolled across multiple institutions:\n\n1. Go to **Duplicate Records** at \`/dashboard/duplicates\`.\n2. Verify the student's formal migration certificate or seat cancellation letter.\n3. Submit an online resolution clearance with the student's signed transfer receipt.\n4. Once validated, the prior institutional claim is cleared and your college record is confirmed.`,
          actionPills: [
            { label: 'View Duplicate Records', href: '/dashboard/duplicates', primary: true },
            { label: 'Check Anomaly Alerts', href: '/dashboard/anomalies' }
          ]
        };
      }

      return {
        text: `You are logged in as a **College Administrator**.\n\nYou have Level 3 authorization for batch uploads, seat ceiling compliance, and duplicate resolution for your institution. How can I assist you with your college records?`,
        actionPills: [
          { label: 'Go to Batch Upload', href: '/dashboard/upload', primary: true },
          { label: 'AICTE Approval Handbook', href: '/guidelines/approval-process' },
          { label: 'Check Anomaly Alerts', href: '/dashboard/anomalies' }
        ]
      };
    }

    // ─────────────────────────────────────────────────────────
    // CASE D: EMPLOYER / VERIFIER (LEVEL 2)
    // ─────────────────────────────────────────────────────────
    if (role === 'employer') {
      // 1. Attempting to query student private data or college quotas -> STRICT DENIAL
      if (
        q.includes('transcript') || q.includes('cgpa breakdown') ||
        q.includes('address') || q.includes('phone') || q.includes('parent name') ||
        q.includes('batch upload') || q.includes('college quota') || q.includes('seat matrix')
      ) {
        return {
          text: `⛔ **Access Denied (Employer Purpose Limitation Violation under DPDP Act 2023)**\n\nYou are logged in as an **Employer / Background Verifier** (Level 2 Clearance).\n\nUnder Section 6 of the DPDP Act 2023, employer clearance is strictly purpose-limited to verifying candidate enrollment status and degree credential validity.\n\nDetailed academic score breakdowns, home addresses, contact numbers, parent names, and institutional quotas are shielded to prevent PII data leakage.`,
          actionPills: [
            { label: 'Verify Candidate Record', href: '/verify', primary: true },
            { label: 'NAD Real-Time Norms', href: '/guidelines/nad-depository' }
          ],
          isAlert: true
        };
      }

      if (q.includes('verify') || q.includes('candidate') || q.includes('apaar') || q.includes('qr') || q.includes('how to')) {
        return {
          text: `**Candidate Verification Protocol (Authorized for Employers):**\n\n1. Go to the Verification Gateway at \`/verify\`.\n2. Input the candidate's 12-digit APAAR ID.\n3. The platform performs instant cryptographic validation against the AICTE Central Ledger.\n4. You will receive an official verifiable digital status receipt.\n5. All queries are cryptographically logged with an immutable audit hash for compliance.`,
          actionPills: [
            { label: 'Verify Candidate Now', href: '/verify', primary: true },
            { label: 'NAD Real-Time Norms', href: '/guidelines/nad-depository' }
          ]
        };
      }

      return {
        text: `You are logged in as an **Employer / Background Verifier**.\n\nYou have Level 2 clearance for background credential verification and QR validation. What candidate credential would you like to verify?`,
        actionPills: [
          { label: 'Verify Candidate Now', href: '/verify', primary: true },
          { label: 'NAD Real-Time Norms', href: '/guidelines/nad-depository' }
        ]
      };
    }

    // ─────────────────────────────────────────────────────────
    // CASE E: AICTE OFFICER / REGULATORY BUREAU (LEVEL 4)
    // ─────────────────────────────────────────────────────────
    if (role.includes('aicte')) {
      if (q.includes('aadhaar') && (q.includes('unmask') || q.includes('raw') || q.includes('decrypt'))) {
        return {
          text: `⛔ **Access Denied (Statutory Protection)**\n\nIn compliance with Supreme Court Aadhaar privacy jurisprudence and Section 6 of the DPDP Act 2023, raw 12-digit Aadhaar numbers and immutable cryptographic blockchain hashes cannot be unmasked or overridden.`,
          actionPills: [
            { label: 'AICTE National Monitor', href: '/dashboard/aicte', primary: true }
          ],
          isAlert: true
        };
      }

      if (q.includes('anomaly') || q.includes('violation') || q.includes('freeze') || q.includes('triage')) {
        return {
          text: `**AICTE National Anomaly & Regulatory Enforcement (Level 4):**\n\n• **Intake Violation Anomaly:** Triggered when uploaded student enrollment exceeds approved APH ceilings.\n• **Duplicate Enrollment Anomaly:** Triggered when the same APAAR ID appears concurrently in two full-time physical programs.\n• **Supernumerary Quota Breach:** Triggered if FN/NRI/OCI exceeds 15% or TFW exceeds 5%.\n• **Enforcement Action:** Regulatory officers have executive authority to freeze an institution's batch upload portal and issue statutory show-cause notices.`,
          actionPills: [
            { label: 'National Anomaly Dashboard', href: '/dashboard/anomalies', primary: true },
            { label: 'AICTE National Monitor', href: '/dashboard/aicte' },
            { label: 'Regulatory BI Reports', href: '/dashboard/reports' }
          ]
        };
      }

      if (q.includes('reservation') || q.includes('quota') || q.includes('state')) {
        return {
          text: `**Category Reservation Compliance Oversight (Level 4):**\n\n• **Constitutional Roster Audit:** Compares institutional category uploads against central/state statutory quotas (GEN, OBC-NCL, SC, ST, EWS, PwD).\n• **State Quota Matrix:** Automated cross-state reconciliation prevents unauthorized conversion of vacant reserved seats into management seats.\n• **Annual Compliance Certification:** Required from all approved institutes prior to academic approval extension.`,
          actionPills: [
            { label: 'Reservation Policy Guide', href: '/guidelines/reservation-policy', primary: true },
            { label: 'Regulatory BI Reports', href: '/dashboard/reports' }
          ]
        };
      }

      return {
        text: `Welcome Officer! You are logged in with **Level 4 Executive Regulatory Clearance** over national enrollment statistics, anomaly engines, and compliance enforcement. Select a regulatory action below:`,
        actionPills: [
          { label: 'AICTE National Monitor', href: '/dashboard/aicte', primary: true },
          { label: 'Anomaly Engine Triage', href: '/dashboard/anomalies' },
          { label: 'Regulatory BI Reports', href: '/dashboard/reports' }
        ]
      };
    }

    // ─────────────────────────────────────────────────────────
    // CASE F: AUDITOR (LEVEL 3A)
    // ─────────────────────────────────────────────────────────
    if (role === 'auditor') {
      if (q.includes('modify') || q.includes('upload') || q.includes('edit')) {
        return {
          text: `⛔ **Access Denied (Read-Only Clearance Violation)**\n\nStatutory Auditors hold Level 3A read-only clearance. Uploading batches or altering admission records is strictly prohibited under audit regulations.`,
          actionPills: [
            { label: 'View Audit Logs', href: '/dashboard/audit', primary: true }
          ],
          isAlert: true
        };
      }

      if (q.includes('audit') || q.includes('log') || q.includes('trail') || q.includes('timestamp')) {
        return {
          text: `**Statutory Audit & Compliance Verification (Authorized for Auditor):**\n\n• **Tamper-Proof Audit Trail:** Every batch student upload and verification query is logged with a SHA-256 cryptographic signature and UTC timestamp.\n• **Submission Integrity:** Records once committed to the central ledger cannot be overwritten without generating a formal audit variance flag.\n• **Compliance Certificates:** Periodic audit certificates can be exported directly from \`/dashboard/audit\`.`,
          actionPills: [
            { label: 'Open Audit Ledger', href: '/dashboard/audit', primary: true }
          ]
        };
      }

      return {
        text: `Welcome Auditor! You are logged in with **Level 3A Read-Only Audit Clearance**. You can inspect statutory audit trails, submission logs, and compliance records.`,
        actionPills: [
          { label: 'View Audit Logs', href: '/dashboard/audit', primary: true }
        ]
      };
    }

    // Default Fallback for Authenticated User
    return {
      text: `Understood! You are logged in with **${userClearance}**.\n\nYour query has been evaluated under your role-authorized permissions. How can I assist you with your authorized tools?`,
      actionPills: [
        { label: 'Open Verification Portal', href: '/verify', primary: true },
        { label: 'View All Policy Circulars', href: '/guidelines' },
        { label: 'File Feedback / Grievance', href: '#feedback' }
      ]
    };
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    // Append user message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = evaluateRoleQuery(userText, isAuthenticated, userRole);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionPills: response.actionPills,
        isAlert: response.isAlert
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = evaluateRoleQuery(prompt, isAuthenticated, userRole);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionPills: response.actionPills,
        isAlert: response.isAlert
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 350);
  };

  // Submit Feedback / Grievance
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackSubject.trim() || !feedbackDesc.trim()) return;

    setFeedbackSubmitting(true);
    const payload = {
      role: userRole,
      category: feedbackCategory,
      subject: feedbackSubject.trim(),
      description: feedbackDesc.trim(),
      rating: feedbackRating,
      email: feedbackEmail.trim() || undefined,
      userName: userName,
      userInstitution: userInstitution || undefined
    };

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const ticketNo = data.ticketNo || `VS-TKT-2026-${Math.floor(10000 + Math.random() * 90000)}`;

      const newRecord: FeedbackRecord = {
        id: `fb-${Date.now()}`,
        ticketNo: ticketNo,
        role: userRole,
        category: feedbackCategory,
        subject: feedbackSubject,
        description: feedbackDesc,
        rating: feedbackRating,
        status: 'Submitted & In Triage',
        createdAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      const existingStored = JSON.parse(localStorage.getItem('vidyasetu_feedback_records') || '[]');
      const updatedTickets = [newRecord, ...existingStored];
      localStorage.setItem('vidyasetu_feedback_records', JSON.stringify(updatedTickets));
      setSavedTickets(updatedTickets);

      setFeedbackSuccess(ticketNo);
      setFeedbackSubject('');
      setFeedbackDesc('');
    } catch {
      // Local fallback
      const ticketNo = `VS-TKT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newRecord: FeedbackRecord = {
        id: `fb-${Date.now()}`,
        ticketNo: ticketNo,
        role: userRole,
        category: feedbackCategory,
        subject: feedbackSubject,
        description: feedbackDesc,
        rating: feedbackRating,
        status: 'Received (Local)',
        createdAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      const existingStored = JSON.parse(localStorage.getItem('vidyasetu_feedback_records') || '[]');
      const updatedTickets = [newRecord, ...existingStored];
      localStorage.setItem('vidyasetu_feedback_records', JSON.stringify(updatedTickets));
      setSavedTickets(updatedTickets);

      setFeedbackSuccess(ticketNo);
      setFeedbackSubject('');
      setFeedbackDesc('');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const roleLabel =
    userRole === 'student' ? 'Student' :
    userRole === 'institution_admin' ? 'College Admin' :
    userRole === 'aicte_officer' ? 'AICTE Bureau' :
    userRole === 'employer' ? 'Employer/HR' :
    userRole === 'auditor' ? 'Statutory Auditor' : 'Normal User';

  const roleColor =
    userRole === 'student' ? 'bg-orange-100 text-[#E8571A] border-orange-200' :
    userRole === 'institution_admin' ? 'bg-blue-100 text-[#003087] border-blue-200' :
    userRole === 'aicte_officer' ? 'bg-amber-100 text-amber-900 border-amber-300' :
    userRole === 'employer' ? 'bg-purple-100 text-purple-700 border-purple-200' :
    userRole === 'auditor' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
    'bg-gray-100 text-gray-700 border-gray-300';

  return (
    <>
      {/* ── FLOATING TRIGGER BUTTON (Cleanly positioned at bottom-6 right-6 with minimize toggle so it NEVER hides page content) ── */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 select-none animate-in fade-in slide-in-from-bottom-2 duration-200">
          {isMinimized ? (
            /* Minimized discrete circular button: ultra-compact footprint (44x44px) */
            <button
              onClick={() => setIsMinimized(false)}
              className="w-11 h-11 bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white rounded-full shadow-[0_6px_20px_rgba(124,58,237,0.4)] hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center border-2 border-purple-200 relative group"
              title={language === 'hi' ? 'एआई हेल्पडेस्क दिखाएं' : 'Show AI Helpdesk & Feedback'}
              aria-label="Expand AI Helpdesk"
            >
              <Bot size={20} className="animate-pulse" />
              <span className={`w-2.5 h-2.5 rounded-full absolute -top-0.5 -right-0.5 border-2 border-white ${
                isAuthenticated ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
            </button>
          ) : (
            /* Standard sleek launcher with minimize button */
            <div className="flex items-center bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white font-bold text-xs rounded-full shadow-[0_6px_24px_rgba(124,58,237,0.35)] hover:shadow-[0_10px_30px_rgba(124,58,237,0.45)] transition-all duration-300 p-0.5 border-2 border-purple-200/70 group">
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 cursor-pointer hover:opacity-95 transition-opacity"
                title={language === 'hi' ? 'रोल-आधारित एआई हेल्पडेस्क एवं फीडबैक' : 'Open Role-Authorized AI Helpdesk & Feedback'}
              >
                <div className="relative">
                  <Bot size={18} className="animate-pulse" />
                  <span className={`w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 border border-white ${
                    isAuthenticated ? 'bg-emerald-400' : 'bg-amber-400'
                  }`} />
                </div>
                <span className="hidden sm:inline font-bold tracking-tight text-[11px]">
                  {language === 'hi' ? 'एआई हेल्पडेस्क' : 'AI Helpdesk'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  isAuthenticated ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400 text-blue-950'
                }`}>
                  {isAuthenticated ? roleLabel.toUpperCase() : (language === 'hi' ? 'सामान्य' : 'PUBLIC')}
                </span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                className="w-6 h-6 rounded-full hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer mr-1"
                title={language === 'hi' ? 'छोटा करें (Minimize)' : 'Minimize to compact icon'}
                aria-label="Minimize AI Helpdesk"
              >
                <EyeOff size={12} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── CHATBOT MODAL WINDOW ── */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[470px] max-h-[85vh] h-[650px] bg-white rounded-3xl shadow-2xl border-2 border-amber-300/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 font-sans">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#001D4A] via-[#002B7A] to-[#0A2540] text-white p-4 flex items-center justify-between border-b-2 border-amber-400 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E8571A] to-amber-400 flex items-center justify-center text-white shadow-md">
                <Bot size={22} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-white">VIDYA-SETU AI Helpdesk</h3>
                  <span className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${roleColor}`}>
                    {roleLabel}
                  </span>
                  <span className="text-[10px] text-blue-200 truncate max-w-[170px]">
                    {userName}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Minimize Helpdesk"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Role Status Bar & Direct Login Trigger */}
          <div className={`px-4 py-2 border-b flex items-center justify-between text-[11px] ${
            isAuthenticated
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/90 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center gap-1.5 font-bold">
              {isAuthenticated ? (
                <>
                  <ShieldCheck size={14} className="text-emerald-700 flex-shrink-0" />
                  <span className="text-emerald-900 truncate max-w-[240px]">
                    {userClearance}
                  </span>
                </>
              ) : (
                <>
                  <Lock size={13} className="text-[#E8571A] flex-shrink-0" />
                  <span className="text-amber-900 font-extrabold">
                    Normal User · Public Information Only
                  </span>
                </>
              )}
            </div>

            {!isAuthenticated ? (
              <button
                onClick={() => setActiveTab('login')}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#003087] to-[#E8571A] text-white font-extrabold text-[10px] hover:scale-102 transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <KeyRound size={11} />
                <span>Role Sign In</span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-2 py-0.5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[10px] transition-colors cursor-pointer"
                >
                  Switch Role
                </button>
                <button
                  onClick={handleInChatLogout}
                  className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-rose-100 hover:text-rose-700 text-gray-700 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Log out and return to Normal User mode"
                >
                  <LogOut size={10} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

          {/* 4 Mode Navigation Tabs */}
          <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2.5 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'border-[#003087] bg-white text-[#003087]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              💬 AI Chat
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`py-2.5 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === 'login'
                  ? 'border-[#003087] bg-white text-[#003087]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>{isAuthenticated ? '👤 Account' : '🔐 Sign In'}</span>
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`py-2.5 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === 'feedback'
                  ? 'border-[#E8571A] bg-white text-[#E8571A]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              📝 Feedback
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`py-2.5 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === 'tickets'
                  ? 'border-emerald-600 bg-white text-emerald-700'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>📋 Tickets</span>
              {savedTickets.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-bold">
                  {savedTickets.length}
                </span>
              )}
            </button>
          </div>

          {/* ── TAB 1: AI CHATBOT ── */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0 bg-white">

              {/* Upfront Role Gate Bar for Normal Users */}
              {!isAuthenticated && (
                <div className="p-2.5 bg-gradient-to-r from-amber-50 via-blue-50 to-orange-50 border-b border-amber-200/90 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#003087] flex items-center gap-1">
                      <Lock size={12} className="text-[#E8571A]" />
                      Role-Based Access: First Log In to Your Role
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded">
                      Public View
                    </span>
                  </div>
                  <p className="text-gray-600 text-[10.5px] leading-tight">
                    Information is role-authorized—no all info is delivered to anybody. If your role is other than normal user, log in first:
                  </p>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {DEMO_ACCOUNTS.map(demo => (
                      <button
                        key={demo.role}
                        type="button"
                        onClick={() => handleInChatLogin(undefined, demo)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-[#003087] hover:text-white border border-gray-200 text-[#003087] font-bold text-[10px] transition-all shadow-2xs cursor-pointer"
                        title={`Log in as ${demo.label}`}
                      >
                        <span>{demo.icon}</span>
                        <span>{demo.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {messages.map(m => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[92%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        m.sender === 'user'
                          ? 'bg-gradient-to-r from-[#003087] to-blue-700 text-white rounded-tr-none shadow-xs'
                          : m.isAlert
                          ? 'bg-rose-50 border-2 border-rose-300 text-rose-950 rounded-tl-none shadow-xs'
                          : 'bg-gray-50 border border-gray-200 text-gray-800 rounded-tl-none shadow-xs'
                      }`}
                    >
                      {m.text}

                      {/* Action Navigation & Role Login Pills */}
                      {m.actionPills && m.actionPills.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-gray-200/80 flex flex-wrap gap-1.5">
                          {m.actionPills.map((p, pIdx) => {
                            if (p.roleLogin) {
                              return (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => {
                                    const acc = DEMO_ACCOUNTS.find(d => d.role === p.roleLogin);
                                    if (acc) handleInChatLogin(undefined, acc);
                                    else setActiveTab('login');
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r from-[#003087] to-[#E8571A] text-white hover:opacity-90 transition-all shadow-2xs cursor-pointer"
                                >
                                  <KeyRound size={10} />
                                  <span>{p.label}</span>
                                </button>
                              );
                            }

                            if (p.href === '#login') {
                              return (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => setActiveTab('login')}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#003087] text-white hover:bg-[#002060] transition-all shadow-2xs cursor-pointer"
                                >
                                  <KeyRound size={10} />
                                  <span>{p.label}</span>
                                </button>
                              );
                            }

                            if (p.href === '#prompt') {
                              return (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => handleQuickPrompt(p.label)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white text-[#003087] border border-blue-200 hover:bg-blue-50 transition-all shadow-2xs cursor-pointer"
                                >
                                  <span>💡 {p.label}</span>
                                </button>
                              );
                            }

                            return (
                              <Link
                                key={pIdx}
                                href={p.href}
                                onClick={() => {
                                  if (p.href === '#feedback') setActiveTab('feedback');
                                  else if (p.href.startsWith('/')) setIsOpen(false);
                                }}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shadow-2xs ${
                                  p.primary
                                    ? 'bg-[#003087] hover:bg-[#002060] text-white'
                                    : 'bg-white text-[#003087] border border-blue-200 hover:bg-amber-50 hover:border-amber-300 hover:text-[#E8571A]'
                                }`}
                              >
                                <span>{p.label}</span>
                                <ArrowRight size={10} />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1 px-1">
                      {m.timestamp}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-gray-400 text-xs italic">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-2 h-2 rounded-full bg-orange-600 animate-bounce" style={{ animationDelay: '0.3s' }} />
                    <span className="text-[10px]">Evaluating role permissions &amp; delivering authorized info…</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips (STRICTLY FILTERED FOR CURRENT ROLE) */}
              <div className="p-2 bg-gray-50/90 border-t border-gray-100 overflow-x-auto flex gap-1.5 scrollbar-none">
                {(AUTHORIZED_ROLE_PROMPTS[userRole] || AUTHORIZED_ROLE_PROMPTS.public).map((prompt, prIdx) => (
                  <button
                    key={prIdx}
                    type="button"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="whitespace-nowrap px-2.5 py-1 bg-white border border-gray-200 hover:border-[#003087] hover:bg-blue-50/50 text-[10px] font-medium text-gray-700 rounded-full transition-all flex-shrink-0 cursor-pointer shadow-2xs"
                  >
                    💡 {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={
                    isAuthenticated
                      ? `Ask query authorized for ${roleLabel}…`
                      : 'Ask a normal user query or log in for role access…'
                  }
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  className="flex-1 text-xs py-2 px-3 rounded-xl border border-gray-300 focus:border-[#003087] focus:ring-1 focus:ring-[#003087] outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2.5 bg-gradient-to-r from-[#003087] to-[#E8571A] text-white rounded-xl disabled:opacity-40 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}

          {/* ── TAB 2: IN-CHATBOT ROLE SIGN IN & AUTHENTICATION ── */}
          {activeTab === 'login' && (
            <div className="flex-1 overflow-y-auto p-5 bg-white space-y-4 text-xs">
              {isAuthenticated ? (
                /* Authenticated User Status Card */
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold">
                        <Check size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Role Verified &amp; Active
                        </span>
                        <h4 className="font-extrabold text-sm text-emerald-950 mt-0.5">{userName}</h4>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-emerald-900 pt-2 border-t border-emerald-200">
                      <p><strong>Authenticated Role:</strong> <span className="font-bold">{roleLabel}</span></p>
                      <p><strong>Assigned Entity:</strong> <span>{userInstitution || 'AICTE Central Registry'}</span></p>
                      <p><strong>Clearance Boundary:</strong> <span className="font-mono text-[11px] font-bold text-blue-900">{userClearance}</span></p>
                      <p className="text-[10.5px] text-emerald-800 italic pt-1">
                        *Role isolation active: Only information authorized for {roleLabel} is delivered. Queries for other roles will be denied.*
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleInChatLogout}
                        className="px-3.5 py-2 bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <LogOut size={12} />
                        <span>Log Out to Normal User</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('chat')}
                        className="px-4 py-2 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002060] cursor-pointer"
                      >
                        Back to Chat →
                      </button>
                    </div>
                  </div>

                  {/* Switch to Another Demo Role */}
                  <div className="space-y-2 pt-2">
                    <h5 className="font-bold text-gray-700 text-xs">Switch to Another Role:</h5>
                    <div className="space-y-1.5">
                      {DEMO_ACCOUNTS.map(demo => (
                        <button
                          key={demo.role}
                          type="button"
                          onClick={() => handleInChatLogin(undefined, demo)}
                          className="w-full p-2.5 rounded-xl border border-gray-200 hover:border-blue-400 bg-gray-50/70 hover:bg-blue-50/50 flex items-center justify-between text-left transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span>{demo.icon}</span>
                            <div>
                              <span className="font-bold text-gray-900 block leading-tight">{demo.label}</span>
                              <span className="text-[10px] text-gray-500">{demo.desc}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-blue-800 font-bold">Switch →</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Unauthenticated Sign-In Panel */
                <div className="space-y-4">
                  <div className="p-3.5 bg-gradient-to-r from-blue-50 to-amber-50 border border-blue-200 rounded-2xl space-y-1">
                    <span className="font-bold text-[#003087] flex items-center gap-1">
                      <KeyRound size={13} className="text-[#E8571A]" /> Role-Based Access Authentication
                    </span>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      If your role is other than a normal user (Student, College Admin, AICTE Officer, Employer), <strong>first log in with your role</strong>. The chatbot delivers only the information permitted for that role so no all info is delivered to anybody.
                    </p>
                  </div>

                  {loginSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 size={15} />
                      <span>{loginSuccess}</span>
                    </div>
                  )}

                  {loginError && (
                    <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <AlertCircle size={15} />
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* 1-Click Fast Role Login for Evaluator/User Convenience */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      ⚡ 1-Click Role Login (Official AICTE Accounts):
                    </span>
                    <div className="space-y-1.5">
                      {DEMO_ACCOUNTS.map(demo => (
                        <button
                          key={demo.role}
                          type="button"
                          onClick={() => handleInChatLogin(undefined, demo)}
                          className="w-full p-2.5 rounded-xl border border-gray-200 hover:border-[#003087] hover:bg-amber-50/40 bg-white flex items-center justify-between text-left transition-all shadow-2xs group cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{demo.icon}</span>
                            <div>
                              <span className="font-bold text-gray-900 group-hover:text-[#003087] transition-colors block text-xs">
                                {demo.label}
                              </span>
                              <span className="text-[10px] text-gray-500 line-clamp-1">
                                {demo.desc}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-[#003087] bg-blue-50 px-2 py-0.5 rounded-md group-hover:bg-[#003087] group-hover:text-white transition-all">
                            Sign In →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Credentials Form */}
                  <form onSubmit={handleInChatLogin} className="space-y-3 pt-3 border-t border-gray-200">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Or Sign In With Custom Registered Account:
                    </span>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Select Role</label>
                      <select
                        value={loginRole}
                        onChange={e => setLoginRole(e.target.value)}
                        className="w-full p-2 rounded-xl border border-gray-300 text-xs bg-white font-medium outline-none"
                      >
                        <option value="student">🎓 Student</option>
                        <option value="institution_admin">🏛️ Institution / College Admin</option>
                        <option value="aicte_officer">📋 AICTE Regulation Officer</option>
                        <option value="employer">🏢 Employer / Background Verifier</option>
                        <option value="auditor">🔍 Statutory Auditor</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. yourname@domain.com"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        className="w-full p-2 rounded-xl border border-gray-300 text-xs outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        className="w-full p-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full py-2.5 bg-gradient-to-r from-[#003087] to-[#E8571A] text-white font-bold rounded-xl shadow-md transition-all hover:scale-101 disabled:opacity-60 cursor-pointer"
                    >
                      {loginLoading ? 'Verifying Credentials…' : 'Sign In & Unlock Role Features'}
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="text-xs text-[#003087] font-bold hover:underline"
                    >
                      New user? Register an official account →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 3: SUBMIT FEEDBACK & GRIEVANCE (LOCKED TO VERIFIED ROLE) ── */}
          {activeTab === 'feedback' && (
            <div className="flex-1 overflow-y-auto p-5 bg-white space-y-4 text-xs">
              {feedbackSuccess ? (
                <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="font-bold text-sm text-emerald-950">Grievance / Feedback Saved!</h4>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Your submission has been authenticated and stored in the central registry.
                  </p>
                  <div className="p-2 bg-white rounded-xl border border-emerald-200 font-mono font-bold text-xs text-blue-900">
                    Tracking Ref: {feedbackSuccess}
                  </div>
                  <button
                    onClick={() => {
                      setFeedbackSuccess(null);
                      setActiveTab('tickets');
                    }}
                    className="btn-primary py-2 px-4 text-xs font-bold"
                  >
                    View in My Tickets History →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  {isAuthenticated ? (
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-[#003087] flex items-center justify-between">
                      <span>Submitting as: <strong>{userName}</strong> ({roleLabel})</span>
                      <span className="text-emerald-700 font-bold">✓ Verified Identity</span>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center justify-between">
                      <span>Normal User Inquiry Mode</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="underline font-bold text-[#003087]"
                      >
                        Sign In for official tracking
                      </button>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Category of Request *</label>
                    <select
                      value={feedbackCategory}
                      onChange={e => setFeedbackCategory(e.target.value)}
                      className="w-full p-2 rounded-xl border border-gray-300 outline-none text-xs bg-white font-medium"
                    >
                      <option value="Data Correction Request">✏️ Data Correction Request (Name, APAAR, DOB)</option>
                      <option value="Anomaly Clarification">🚨 Anomaly or Quota Ceiling Clarification</option>
                      <option value="Bug Report">🐛 Technical Issue or Bug Report</option>
                      <option value="Policy Inquiry">📜 Regulatory Policy or Circular Inquiry</option>
                      <option value="Platform Suggestion">💡 Platform Enhancement Suggestion</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Subject / Headline *</label>
                    <input
                      type="text"
                      placeholder="e.g. Spelling error in APAAR registration name"
                      value={feedbackSubject}
                      onChange={e => setFeedbackSubject(e.target.value)}
                      required
                      className="w-full p-2 rounded-xl border border-gray-300 outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Detailed Description *</label>
                    <textarea
                      rows={3}
                      placeholder="Provide all relevant details (Roll No, APAAR ID, College Name, or specific error observed)…"
                      value={feedbackDesc}
                      onChange={e => setFeedbackDesc(e.target.value)}
                      required
                      className="w-full p-2 rounded-xl border border-gray-300 outline-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Contact Email</label>
                      <input
                        type="email"
                        placeholder="your.email@domain.com"
                        value={feedbackEmail}
                        onChange={e => setFeedbackEmail(e.target.value)}
                        className="w-full p-2 rounded-xl border border-gray-300 outline-none text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700">Rating Experience</label>
                      <div className="flex items-center gap-1 pt-1.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedbackRating(star)}
                            className={`text-base cursor-pointer transition-transform hover:scale-115 ${
                              star <= feedbackRating ? 'text-amber-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={feedbackSubmitting}
                    className="w-full py-2.5 bg-gradient-to-r from-[#003087] to-[#E8571A] text-white font-bold rounded-xl shadow-md transition-all hover:scale-101 disabled:opacity-60 cursor-pointer"
                  >
                    {feedbackSubmitting ? 'Recording Ticket Locally…' : 'Submit Feedback & Log Ticket'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ── TAB 4: TICKETS & GRIEVANCE HISTORY ── */}
          {activeTab === 'tickets' && (
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-500 uppercase text-[10px]">
                  Locally Saved Feedback Records ({savedTickets.length})
                </span>
                <button
                  onClick={loadTickets}
                  className="text-[#003087] hover:underline text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={10} /> Refresh
                </button>
              </div>

              {savedTickets.length === 0 ? (
                <div className="text-center py-12 text-gray-400 space-y-2">
                  <FileText size={28} className="mx-auto opacity-50" />
                  <p>No feedback or grievance tickets filed yet.</p>
                  <button
                    onClick={() => setActiveTab('feedback')}
                    className="text-[#003087] font-bold hover:underline"
                  >
                    File a new ticket now →
                  </button>
                </div>
              ) : (
                savedTickets.map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-[#003087]">
                          {t.ticketNo}
                        </span>
                        <h4 className="font-bold text-gray-900 leading-snug mt-0.5">
                          {t.subject}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        {t.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-600 line-clamp-2">
                      {t.description}
                    </p>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                      <span>Category: {t.category}</span>
                      <span>{t.createdAt}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      )}
    </>
  );
}
