import React, { useState, useEffect, useRef, useCallback } from "react";
import { useBehaviourTracker } from "./hooks/useBehaviourTracker";
import { useAISupport, POLL_INTERVAL_MS } from "./hooks/useAISupport";
import { ProgressBar } from "./components/ProgressBar";
import { SuccessScreen } from "./components/SuccessScreen";
import {
  SupportBanner,
  NavigationQuickLinks,
  GuidedWalkthroughBanner,
  getSupportConfig,
} from "./components/SupportBanner";
import {
  StepPersonal,
  StepEducation,
  StepSkills,
  StepDocuments,
} from "./components/FormSteps";
import apiClient from "../services/apiClient.js";
import { useAccessibility } from "./hooks/useAccessibility.js";
import { AccessibilityPanel } from "./components/AccessibilityPanel.jsx";
import { AccessibilityToolbar } from "./components/AccessibilityToolbar.jsx";

// ─── Step config ──────────────────────────────────────────────────────────────
const STEP_LABELS = ["Personal", "Education", "Skills", "Documents"];

const JOB_ROLES = [
  {
    id: "junior-software-developer",
    title: "Junior Software Developer",
    type: "Junior / Full-time",
    location: "London / Hybrid",
    icon: "💻",
    summary:
      "A junior software development role focused on building and maintaining software features, debugging application code, using version control workflows, and contributing to TDD/BDD-based development tasks within an agile engineering team.",
    skills: [
      "JavaScript",
      "Git Version Control",
      "Debugging",
      "TDD/BDD",
      "Agile Workflow",
    ],
    expectations: [
      "Write maintainable code for new and existing software features.",
      "Use branching, commits, pull requests, and code review processes.",
      "Contribute to test-first development activities using TDD and BDD practices.",
      "Identify bugs, reproduce issues, and document technical fixes clearly.",
    ],
  },
  {
    id: "junior-web-application-developer",
    title: "Junior Web Application Developer",
    type: "Junior / Full-time",
    location: "Manchester / Remote",
    icon: "🌐",
    summary:
      "A junior web application role focused on developing user-facing web features, working with REST API endpoints, testing interface behaviour across states, and supporting CI/CD deployment workflows for production-ready applications.",
    skills: [
      "React",
      "REST APIs",
      "Interface Testing",
      "CI/CD",
      "Responsive UI",
    ],
    expectations: [
      "Develop responsive web application components from technical requirements.",
      "Connect frontend features with REST API data and handle loading, error, and success states.",
      "Test user interface behaviour across browsers, devices, and edge cases.",
      "Support CI/CD pipeline tasks including build checks, deployment validation, and release updates.",
    ],
  },
  {
    id: "junior-backend-developer",
    title: "Junior Backend Developer",
    type: "Junior / Full-time",
    location: "Birmingham / Hybrid",
    icon: "🗄️",
    summary:
      "A junior backend development role focused on server-side logic, database queries, API integration, code testing, debugging service behaviour, and maintaining backend application functionality within a structured development environment.",
    skills: [
      "Node.js",
      "Database Queries",
      "API Integration",
      "Unit Testing",
      "Server-side Logic",
    ],
    expectations: [
      "Implement backend routes, services, and validation logic from technical specifications.",
      "Write and optimise database queries while maintaining data accuracy and security.",
      "Integrate internal and external APIs using clear request and response handling.",
      "Debug backend errors, inspect logs, and contribute to automated test coverage.",
    ],
  },
];

// ─── Validation rules per step ────────────────────────────────────────────────
const VALIDATORS = [
  // Step 0 — Personal
  (vals) => {
    const errs = {};
    if (!vals.fullName?.trim()) errs.fullName = "Full name is required";
    if (!vals.email?.trim()) errs.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email))
      errs.email = "Please enter a valid email address";
    if (!vals.phone?.trim()) errs.phone = "Phone number is required";
    else if (
      !/^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/.test(
        vals.phone.replace(/\s/g, ""),
      )
    )
      errs.phone = "Please enter a valid UK phone number (e.g. 07700 900123)";
    if (!vals.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
    if (!vals.address?.trim()) errs.address = "Current address is required";
    if (!vals.postcode?.trim()) errs.postcode = "Postcode is required";
    else if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(vals.postcode.trim()))
      errs.postcode = "Please enter a valid UK postcode (e.g. SW1A 1AA)";
    if (!vals.nationality) errs.nationality = "Nationality is required";
    return errs;
  },

  // Step 1 — Education
  (vals) => {
    const errs = {};
    if (!vals.qualification)
      errs.qualification = "Highest qualification is required";
    if (!vals.yearsExperience && vals.yearsExperience !== 0)
      errs.yearsExperience = "Years of experience is required";
    else if (isNaN(vals.yearsExperience) || Number(vals.yearsExperience) < 0)
      errs.yearsExperience = "Please enter a valid number (0 or more)";
    if (!vals.employmentStatus)
      errs.employmentStatus = "Employment status is required";
    if (
      vals.empStartDate &&
      vals.empEndDate &&
      vals.empStartDate > vals.empEndDate
    )
      errs.empEndDate = "End date cannot be before start date";
    return errs;
  },

  // Step 2 — Skills
  (vals) => {
    const errs = {};
    if (!vals.skills?.length) errs.skills = "Please select at least one skill";
    if (!vals.salaryExpectation)
      errs.salaryExpectation = "Salary expectation is required";
    else if (
      isNaN(vals.salaryExpectation) ||
      Number(vals.salaryExpectation) < 10000
    )
      errs.salaryExpectation =
        "Please enter a realistic annual salary (min £10,000)";
    if (!vals.availabilityDate)
      errs.availabilityDate = "Availability date is required";
    if (!vals.coverLetter?.trim())
      errs.coverLetter = "Cover letter is required";
    else if (vals.coverLetter.trim().length < 20)
      errs.coverLetter = "Cover letter must be at least 20 characters";
    return errs;
  },

  // Step 3 — Documents
  (vals) => {
    const errs = {};
    if (!vals.cvFile) errs.cvFile = "Please upload your CV";
    if (!vals.termsAccepted)
      errs.termsAccepted = "You must accept the terms and conditions";
    return errs;
  },
];

// ─── Guided field sequences ───────────────────────────────────────────────────
const GUIDED_FIELDS = [
  [
    "fullName",
    "dateOfBirth",
    "email",
    "phone",
    "address",
    "postcode",
    "nationality",
  ],
  [
    "qualification",
    "university",
    "yearsExperience",
    "employmentStatus",
    "prevEmployer",
    "empStartDate",
    "empEndDate",
  ],
  [
    "skills",
    "salaryExpectation",
    "availabilityDate",
    "workArrangement",
    "coverLetter",
  ],
  ["cvFile", "termsAccepted"],
];

const GUIDED_TIPS = {
  fullName:
    "Enter your full legal name exactly as it appears on your passport or driving licence.",
  email:
    "Enter an email address you check regularly — we will contact you here.",
  phone: "UK mobile preferred. Format: 07700 900123 or +44 7700 900123.",
  dateOfBirth: "Use the date picker to select your date of birth.",
  address:
    "Enter your full current residential address including street, city, and county.",
  postcode: "UK postcode only, e.g. SW1A 1AA or M1 1AA.",
  nationality:
    "Select your nationality. This is used for right-to-work checks.",
  qualification:
    "Select the highest level of academic or professional qualification you have completed.",
  university:
    "Enter the name of the institution where you completed your highest qualification.",
  yearsExperience:
    "Enter the total number of years you have worked in a relevant professional role.",
  employmentStatus:
    "Select the option that best describes your current working situation.",
  prevEmployer: "Enter the name of your most recent employer (company name).",
  empStartDate: "Select the date you started at your most recent employer.",
  empEndDate:
    "Select the date you left (leave blank if currently employed there).",
  skills:
    "Click the skill tags to select them. Blue = selected. Choose all that apply.",
  salaryExpectation:
    "Enter your expected annual gross salary in pounds, e.g. 45000.",
  availabilityDate:
    "Select the earliest date you could start if offered the position.",
  coverLetter:
    "Write 2–4 paragraphs explaining why you want this role and what you would bring.",
  cvFile:
    "Upload your CV in PDF or Word format (.pdf, .doc, .docx). Maximum 5MB.",
  termsAccepted:
    "Tick the checkbox to confirm you agree to the terms and conditions.",
};

// ─── Notification helper (no Ant Design dependency) ──────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    info: { bg: "#EFF6FF", border: "#93C5FD", text: "#1D4ED8", icon: "🤖" },
    success: { bg: "#ECFDF5", border: "#6EE7B7", text: "#065F46", icon: "✅" },
    warn: { bg: "#FFFBEB", border: "#FCD34D", text: "#92400E", icon: "⚠️" },
  };

  const c = colors[type] || colors.info;

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        background: c.bg,
        border: `1.5px solid ${c.border}`,
        borderRadius: 14,
        padding: "12px 16px",
        maxWidth: 340,
        boxShadow: "0 8px 24px rgba(0,0,0,.12)",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        animation: "slideDown .3s ease",
      }}
    >
      <span style={{ fontSize: 18, flexShrink: 0 }}>{c.icon}</span>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: c.text,
            marginBottom: 2,
          }}
        >
          {message.title}
        </div>
        <div
          style={{ fontSize: 12, color: c.text, opacity: 0.8, lineHeight: 1.5 }}
        >
          {message.body}
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: c.text,
          opacity: 0.5,
          cursor: "pointer",
          fontSize: 14,
          padding: 0,
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Job role selection state
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationStarted, setApplicationStarted] = useState(false);

  // Support state
  const [supportMode, setSupportMode] = useState(null);
  const [supportActive, setSupportActive] = useState(false);
  const [score, setScore] = useState(null);
  const [usedAIModel, setUsedAIModel] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [guidedFieldIdx, setGuidedFieldIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState(null);
  const showToast = useCallback((title, body, type = "info") => {
    setToast({ title, body, type, id: Date.now() });
  }, []);

  // ── Accessibility panel ──────────────────────────────────────────────────
  const [a11yPanelOpen, setA11yPanelOpen] = useState(false);
  const a11y = useAccessibility();

  const currentStepRef = useRef(currentStep);
  const sessionStartRef = useRef(Date.now());

  const tracker = useBehaviourTracker();

  // ── AI support callback ──────────────────────────────────────────────────
  const handleSupportDecision = useCallback(
    ({ type, confidence, reasoning, model }) => {
      if (supportActive) return;

      setSupportMode(type);
      setSupportActive(true);
      setShowBanner(true);
      setScore(confidence);
      setUsedAIModel(model);
      setGuidedFieldIdx(0);

      const sessionSec = Math.round(
        (Date.now() - sessionStartRef.current) / 1000,
      );

      tracker.addEvent(
        `AI triggered support: Type ${type} at ${sessionSec}s (${confidence}% confidence)`,
        "info",
      );
    },
    [supportActive, tracker],
  );

  const { aiState, startPolling, stopPolling, forceCheck } = useAISupport({
    onSupportDecision: handleSupportDecision,
    sessionStartRef,
  });

  const firstTrigger = aiState.supportTriggerLog?.find((e) => e.needSupport);

  // ── Start polling only after application form starts ─────────────────────
  useEffect(() => {
    if (!applicationStarted || submitted) return undefined;

    sessionStartRef.current = Date.now();

    startPolling(tracker.getSnapshot, () => currentStepRef.current);
    tracker.addEvent(
      `Application started — polling every ${POLL_INTERVAL_MS / 1000}s`,
      "info",
    );

    return () => stopPolling();
  }, [applicationStarted, submitted]); // eslint-disable-line

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  // ── Field change handler ─────────────────────────────────────────────────
  const handleChange = useCallback((fieldId, value) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => ({ ...prev, [fieldId]: null }));
  }, []);

  // ── Validation ───────────────────────────────────────────────────────────
  const validateStep = useCallback(
    (step) => {
      const errs = VALIDATORS[step](formValues);
      setErrors(errs);

      const failedFields = Object.values(errs);
      if (failedFields.length) {
        tracker.onValidationFail(step, Object.keys(errs));
      }

      return !failedFields.length;
    },
    [formValues, tracker],
  );

  const submitHandler = async () => {
    try {
      setIsLoading(true);
      const params = {
        ...tracker?.metrics,
        selectedJobRole: selectedJob?.title,
        selectedJobRoleId: selectedJob?.id,
        supportMode,
        usedAIModel,
        score,
        supportTriggered: supportActive,
        triggerTime: firstTrigger?.sessionSeconds,
        completed: true,
      };

      const response = await apiClient.post("/session", params);

      if (response?.data?.status) {
        setSubmitted(true);
        stopPolling();
      }
      setIsLoading(false);
    } catch (error) {
      showToast(
        "Submission failed",
        "Something went wrong while submitting the application. Please try again.",
        "warn",
      );
      setIsLoading(false);
    }
  };

  // ── Navigation ───────────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    if (!validateStep(currentStep)) return;

    setCompletedSteps((d) => [...new Set([...d, currentStep])]);

    if (currentStep === 3) {
      submitHandler();
      tracker.addEvent("Application submitted successfully", "info");
      return;
    }

    tracker.onNavigate(currentStep, currentStep + 1);
    setGuidedFieldIdx(0);
    setCurrentStep((s) => s + 1);
    setErrors({});
  }, [currentStep, validateStep, tracker]);

  const goBack = useCallback(() => {
    if (currentStep === 0) return;

    tracker.onNavigate(currentStep, currentStep - 1);
    setGuidedFieldIdx(0);
    setCurrentStep((s) => s - 1);
    setErrors({});
  }, [currentStep, tracker]);

  const jumpTo = useCallback(
    (step) => {
      if (step === currentStep) return;

      tracker.onNavigate(currentStep, step);
      setGuidedFieldIdx(0);
      setCurrentStep(step);
      setErrors({});
    },
    [currentStep, tracker],
  );

  const advanceGuided = useCallback(() => {
    const fields = GUIDED_FIELDS[currentStep];

    if (guidedFieldIdx < fields.length - 1) {
      setGuidedFieldIdx((i) => i + 1);
    }
  }, [currentStep, guidedFieldIdx]);

  const handleForceCheck = useCallback(() => {
    tracker.addEvent("Manual AI check triggered", "info");
    forceCheck(tracker.getSnapshot, currentStep);
  }, [forceCheck, tracker, currentStep]);

  const handleApplyForRole = useCallback(() => {
    if (!selectedJob) {
      showToast(
        "Select a role first",
        "Please choose one of the three roles before continuing to the application form.",
        "warn",
      );
      return;
    }

    setFormValues((prev) => ({
      ...prev,
      selectedJobRole: selectedJob.title,
      selectedJobRoleId: selectedJob.id,
    }));

    setApplicationStarted(true);
    tracker.addEvent(`Selected job role: ${selectedJob.title}`, "info");
  }, [selectedJob, showToast, tracker]);

  const handleChangeRole = useCallback(() => {
    setApplicationStarted(false);
    setCurrentStep(0);
    setCompletedSteps([]);
    setErrors({});
    stopPolling();
  }, [stopPolling]);

  const handleReset = useCallback(() => window.location.reload(), []);

  // ── Shared step props ────────────────────────────────────────────────────
  const stepProps = {
    values: formValues,
    errors,
    onChange: handleChange,
    tracker,
    supportMode: supportActive ? supportMode : null,
    guidedField:
      supportActive && supportMode === "G"
        ? GUIDED_FIELDS[currentStep]?.[guidedFieldIdx]
        : null,
  };

  const currentGuidedField = GUIDED_FIELDS[currentStep]?.[guidedFieldIdx];
  const guidedInstruction =
    GUIDED_TIPS[currentGuidedField] || "Complete this field to continue.";

  const cfg = supportActive ? getSupportConfig(supportMode) : null;

  return (
    <div className="a11y-page-shell min-h-screen bg-slate-100 font-sans">
      <header className="sticky top-0 z-40">
        <header className="md:flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-blue-600 to-violet-600 text-base text-white">
              💼
            </div>

            <div>
              <div className="font-serif text-[18px] font-semibold leading-tight text-slate-800">
                Job Application Portal
              </div>
              <div className="text-[15px] text-slate-400">
                AI Adaptive Interface · Cognitive Offloading Prototype
              </div>
            </div>
          </div>

          <div className="flex justify-end md:items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
              <div className="h-[7px] w-[7px] rounded-full bg-emerald-400 animate-[livePulse_1.4s_ease-in-out_infinite]" />
              <span className="text-[14px] font-medium text-emerald-800">
                AI monitoring
              </span>
            </div>

            {/* Active support badge */}
            {supportActive && cfg && (
              <div
                className="animate-[bounceIn_.4s_ease] rounded-full border px-3 py-1.5 text-[14px] font-semibold"
                style={{
                  backgroundColor: cfg.badgeBg || "#EDE9FE",
                  borderColor: cfg.border,
                  color: cfg.badgeText || "#4C1D95",
                }}
              >
                Mode {supportMode} active
              </div>
            )}

            {/* Reset */}
            <button
              onClick={handleReset}
              title="Reset session"
              className="rounded-[9px] border border-slate-200 bg-transparent px-2.5 py-1.5 text-sm text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
            >
              ↺
            </button>
          </div>
        </header>
      </header>

      <AccessibilityPanel
        open={a11yPanelOpen}
        onClose={() => setA11yPanelOpen(false)}
        settings={a11y.settings}
        zoomIn={a11y.zoomIn}
        zoomOut={a11y.zoomOut}
        resetZoom={a11y.resetZoom}
        toggleVoice={a11y.toggleVoice}
        toggleDyslexia={a11y.toggleDyslexiaFont}
        toggleMagnifier={a11y.toggleMagnifier}
        resetAll={a11y.resetAll}
      />

      <AccessibilityToolbar
        visible={supportActive}
        panelOpen={a11yPanelOpen}
        onOpenPanel={() => setA11yPanelOpen(true)}
        settings={a11y.settings}
        zoomIn={a11y.zoomIn}
        zoomOut={a11y.zoomOut}
        toggleVoice={a11y.toggleVoice}
        toggleMagnifier={a11y.toggleMagnifier}
      />

      <main className="w-full overflow-x-hidden px-4 py-6">
        <div
          className={`mx-auto flex w-full justify-center overflow-visible ${
            applicationStarted || submitted ? "max-w-3xl" : "max-w-7xl"
          }`}
        >
          <div id="form-zoom-target" className="w-full max-w-5xl origin-top">
            {submitted ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <SuccessScreen />
              </div>
            ) : !applicationStarted ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-8 text-center">
                  <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
                    Choose before applying
                  </span>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                    Select a suitable job role
                  </h1>

                  <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                    From these 3 roles, select the most appropriate position
                    based on your skills, experience, and understanding of the
                    role requirements. After selecting one role, click{" "}
                    <strong className="font-semibold text-slate-800">
                      Continue to Application
                    </strong>{" "}
                    to begin the application form.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  {JOB_ROLES.map((role) => {
                    const isSelected = selectedJob?.id === role.id;

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedJob(role)}
                        className={`group flex h-full flex-col rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-100"
                            : "border-slate-200 bg-white hover:border-blue-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl transition group-hover:bg-blue-100">
                            {role.icon}
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {isSelected ? "Selected" : role.type}
                          </span>
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                          {role.title}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {role.summary}
                        </p>

                        <div className="mt-4 space-y-2 text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span>{role.location}</span>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {role.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 border-t border-slate-100 pt-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Role expectations
                          </p>

                          <ul className="mt-3 space-y-2">
                            {role.expectations.map((item) => (
                              <li
                                key={item}
                                className="flex gap-2 text-sm leading-5 text-slate-600"
                              >
                                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {selectedJob
                        ? `You selected: ${selectedJob.title}`
                        : "No role selected yet"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Please choose one role from the three options before
                      applying.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyForRole}
                    disabled={!selectedJob}
                    className={`w-full rounded-xl px-6 py-3 text-base font-semibold transition md:w-auto ${
                      selectedJob
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                        : "cursor-not-allowed bg-slate-200 text-slate-400"
                    }`}
                  >
                    Continue to Application →
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm transition-all duration-300">
                {selectedJob && (
                  <div className="border-b border-slate-100 px-8 py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Applying for
                        </p>

                        <h2 className="text-lg font-bold text-slate-900">
                          {selectedJob.title}
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={handleChangeRole}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                      >
                        Change role
                      </button>
                    </div>
                  </div>
                )}

                <div className="px-8 pt-7">
                  <ProgressBar
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                  />
                </div>

                <div className="px-8 pb-8">
                  {/* Navigation quick-links (Mode N) */}
                  {supportActive && supportMode === "N" && (
                    <NavigationQuickLinks
                      currentStep={currentStep}
                      totalSteps={4}
                      stepLabels={STEP_LABELS}
                      onNavigate={jumpTo}
                    />
                  )}

                  {/* Support banner */}
                  {supportActive && showBanner && (
                    <SupportBanner
                      type={supportMode}
                      onDismiss={() => setShowBanner(false)}
                    />
                  )}

                  {/* Guided walkthrough banner (Mode G) */}
                  {supportActive &&
                    supportMode === "G" &&
                    currentGuidedField && (
                      <GuidedWalkthroughBanner
                        currentField={currentGuidedField}
                        instruction={guidedInstruction}
                        stepIndex={guidedFieldIdx}
                      />
                    )}

                  {/* Step content */}
                  <div onClick={tracker.onClick}>
                    {currentStep === 0 && <StepPersonal {...stepProps} />}
                    {currentStep === 1 && <StepEducation {...stepProps} />}
                    {currentStep === 2 && <StepSkills {...stepProps} />}
                    {currentStep === 3 && <StepDocuments {...stepProps} />}
                  </div>

                  {/* Error count summary */}
                  {Object.keys(errors).length > 0 && (
                    <div
                      style={{
                        marginTop: 16,
                        padding: "10px 14px",
                        borderRadius: 10,
                        background: "#FEF2F2",
                        border: "1px solid #FECACA",
                        fontSize: 14,
                        color: "#991B1B",
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <span>⚠</span>
                      <span>
                        {Object.keys(errors).length} field
                        {Object.keys(errors).length > 1
                          ? "s need"
                          : " needs"}{" "}
                        attention before you can continue.
                      </span>
                    </div>
                  )}

                  {/* Nav buttons */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 28,
                      paddingTop: 20,
                      borderTop: "1px solid #F1F5F9",
                    }}
                  >
                    <button
                      onClick={goBack}
                      disabled={currentStep === 0}
                      className="px-3 py-2 md:px-7 md:text-lg"
                      style={{
                        borderRadius: 12,
                        border: "1.5px solid #E2E8F0",
                        background: "#fff",
                        color: currentStep === 0 ? "#CBD5E1" : "#475569",
                        fontWeight: 500,
                        cursor: currentStep === 0 ? "not-allowed" : "pointer",
                        opacity: currentStep === 0 ? 0.5 : 1,
                        fontFamily: "inherit",
                        transition: "all .15s",
                      }}
                    >
                      ← Back
                    </button>

                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      {/* Guided: next field button */}
                      {supportActive &&
                        supportMode === "G" &&
                        guidedFieldIdx <
                          GUIDED_FIELDS[currentStep].length - 1 && (
                          <button
                            onClick={advanceGuided}
                            className="px-3 py-2 md:px-7 md:text-lg"
                            style={{
                              borderRadius: 12,
                              border: "1.5px solid #FCD34D",
                              background: "#FFFBEB",
                              color: "#92400E",
                              fontWeight: 500,
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            Next field →
                          </button>
                        )}

                      <button
                        onClick={goNext}
                        disabled={isLoading}
                        className="px-3 py-2 md:px-7 md:text-lg flex items-center gap-2 justify-center"
                        style={{
                          borderRadius: 12,
                          background: isLoading
                            ? "linear-gradient(135deg,#60A5FA,#3B82F6)"
                            : "linear-gradient(135deg,#2563EB,#1D4ED8)",
                          color: "#fff",
                          fontWeight: 600,
                          cursor: isLoading ? "not-allowed" : "pointer",
                          border: "none",
                          fontFamily: "inherit",
                          boxShadow: "0 4px 14px rgba(37,99,235,.35)",
                          transition: "all .15s",
                          opacity: isLoading ? 0.9 : 1,
                        }}
                      >
                        {isLoading ? (
                          <>
                            <span
                              style={{
                                width: 18,
                                height: 18,
                                border: "2px solid rgba(255,255,255,0.4)",
                                borderTop: "2px solid #fff",
                                borderRadius: "50%",
                                display: "inline-block",
                                animation: "spin 0.8s linear infinite",
                              }}
                            />
                            Submitting...
                          </>
                        ) : currentStep === 3 ? (
                          "✓ Submit application"
                        ) : (
                          "Save & continue →"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {toast && (
        <Toast
          key={toast.id}
          message={toast}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
