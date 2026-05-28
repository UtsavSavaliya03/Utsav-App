import React from "react";
import { FieldWrap } from "./FieldWrap";

// ─── Base input components ────────────────────────────────────────────────────

function Input({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  onFocus,
  onKeyDown,
  hasError,
  prefix,
}) {
  return (
    <div style={{ position: "relative" }}>
      {prefix && (
        <span
          style={{
            position: "absolute",
            left: 13,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94A3B8",
            fontSize: 14,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          {prefix}
        </span>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        style={{
          width: "100%",
          padding: prefix ? "10px 13px 10px 28px" : "10px 13px",
          border: `1.5px solid ${hasError ? "#EF4444" : "#E2E8F0"}`,
          borderRadius: 10,
          fontSize: 16,
          outline: "none",
          fontFamily: "inherit",
          background: "#fff",
          color: "#1E293B",
          transition: "border-color .2s, box-shadow .2s",
        }}
      />
    </div>
  );
}

function Select({
  id,
  value,
  onChange,
  onFocus,
  options,
  placeholder,
  hasError,
}) {
  // Extract e.target.value so callers always receive a plain string, never a SyntheticEvent
  const handleChange = (e) => onChange(e.target.value);
  return (
    <select
      id={id}
      value={value || ""}
      onChange={handleChange}
      onFocus={onFocus}
      style={{
        width: "100%",
        padding: "10px 36px 10px 13px",
        border: `1.5px solid ${hasError ? "#EF4444" : "#E2E8F0"}`,
        borderRadius: 10,
        fontSize: 13,
        outline: "none",
        fontFamily: "inherit",
        background: "#fff",
        color: value ? "#1E293B" : "#94A3B8",
        cursor: "pointer",
        transition: "border-color .2s",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394A3B8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 13px center",
      }}
    >
      <option value="" disabled>
        {placeholder || "Select…"}
      </option>
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o} value={o}>
            {o}
          </option>
        ) : (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ),
      )}
    </select>
  );
}

function Textarea({
  id,
  placeholder,
  value,
  onChange,
  onFocus,
  onKeyDown,
  rows = 4,
  hasError,
}) {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value || ""}
      rows={rows}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      style={{
        width: "100%",
        padding: "10px 13px",
        border: `1.5px solid ${hasError ? "#EF4444" : "#E2E8F0"}`,
        borderRadius: 10,
        fontSize: 13,
        outline: "none",
        fontFamily: "inherit",
        background: "#fff",
        color: "#1E293B",
        resize: "vertical",
        transition: "border-color .2s, box-shadow .2s",
        lineHeight: 1.6,
      }}
    />
  );
}

function MultiSelect({ id, value = [], options, onChange, onFocus, hasError }) {
  const toggle = (opt) => {
    const next = value.includes(opt)
      ? value.filter((v) => v !== opt)
      : [...value, opt];
    onChange(next);
  };
  return (
    <div
      id={id}
      tabIndex={-1}
      onFocus={onFocus}
      style={{
        border: `1.5px solid ${hasError ? "#EF4444" : "#E2E8F0"}`,
        borderRadius: 10,
        padding: "10px",
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map((opt) => {
          const active = value.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              style={{
                padding: "5px 12px",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                border: `1.5px solid ${active ? "#3B82F6" : "#E2E8F0"}`,
                background: active ? "#EFF6FF" : "#F8FAFC",
                color: active ? "#1D4ED8" : "#64748B",
                transition: "all .15s",
              }}
            >
              {active ? "✓ " : ""}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FileUpload({ id, label, accept, value, onChange, onFocus }) {
  const inputRef = React.useRef();
  return (
    <div
      onFocus={onFocus}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${value ? "#86EFAC" : "#CBD5E1"}`,
        borderRadius: 12,
        padding: "22px 16px",
        cursor: "pointer",
        textAlign: "center",
        background: value ? "#F0FDF4" : "#F8FAFC",
        transition: "all .2s",
      }}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files[0]) onChange(e.target.files[0]);
        }}
      />
      {value ? (
        <>
          <div style={{ fontSize: 24, marginBottom: 4 }}>✅</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#065F46" }}>
            {value.name}
          </div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
            {(value.size / 1024).toFixed(1)} KB · Click to replace
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 28, marginBottom: 6 }}>📎</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
            {label}
          </div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>
            Click to browse · {accept}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

function StepHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2
        style={{
          fontFamily: "Fraunces,Georgia,serif",
          fontSize: 24,
          fontWeight: 600,
          color: "#1E293B",
          marginBottom: 4,
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.5, margin: 0 }}>
        {sub}
      </p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        margin: "20px 0 14px",
        paddingBottom: 10,
        borderBottom: "1px solid #afc8ff",
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#2563eb",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {children}
      </span>
    </div>
  );
}

// ─── Step 1: Personal information ────────────────────────────────────────────

export function StepPersonal({
  values,
  errors,
  onChange,
  tracker,
  supportMode,
  guidedField,
}) {
  const sm = supportMode;
  const gf = guidedField;

  return (
    <div style={{ animation: "fadeIn .3s ease" }}>
      <StepHeader
        title="Personal information"
        sub="Enter your details exactly as they appear on official identification."
      />

      <div className="grid md:grid-cols-2 gap-y-3 gap-x-5">
        <FieldWrap
          label="Full name"
          required
          tooltip="Your legal full name as on your passport or driving licence."
          hint={sm === "S" ? "Legal name only — include middle name if on your passport. No nicknames." : null}
          error={errors.fullName}
          supportMode={sm}
          isGuidedActive={gf === "fullName"}
        >
          <Input
            id="fullName"
            placeholder="e.g. Jane Marie Smith"
            value={values.fullName}
            hasError={!!errors.fullName}
            onFocus={() => tracker.onFieldFocus("fullName")}
            onKeyDown={(e) => tracker.onKeyDown(e, "fullName")}
            onChange={(e) => {
              tracker.onInputChange("fullName");
              onChange("fullName", e.target.value);
            }}
          />
        </FieldWrap>

        <FieldWrap
          label="Date of birth"
          required
          tooltip="Enter your date of birth. You must be 16 or over to apply."
          hint={sm === "S" ? "Must match your ID exactly. You must be at least 16 to apply." : null}
          error={errors.dateOfBirth}
          supportMode={sm}
          isGuidedActive={gf === "dateOfBirth"}
        >
          <Input
            id="dateOfBirth"
            type="date"
            value={values.dateOfBirth}
            hasError={!!errors.dateOfBirth}
            onFocus={() => tracker.onFieldFocus("dateOfBirth")}
            onKeyDown={(e) => tracker.onKeyDown(e, "dateOfBirth")}
            onChange={(e) => {
              tracker.onInputChange("dateOfBirth");
              onChange("dateOfBirth", e.target.value);
            }}
          />
        </FieldWrap>

        <FieldWrap
          label="Email address"
          required
          tooltip="We will use this email for all correspondence about your application."
          hint={sm === "S" ? "Used for all correspondence. Check it regularly and use a professional address." : null}
          error={errors.email}
          supportMode={sm}
          isGuidedActive={gf === "email"}
        >
          <Input
            id="email"
            type="email"
            placeholder="jane.smith@email.com"
            value={values.email}
            hasError={!!errors.email}
            onFocus={() => tracker.onFieldFocus("email")}
            onKeyDown={(e) => tracker.onKeyDown(e, "email")}
            onChange={(e) => {
              tracker.onInputChange("email");
              onChange("email", e.target.value);
            }}
          />
        </FieldWrap>

        <FieldWrap
          label="Mobile number"
          required
          tooltip="UK mobile preferred. Format: 07700 900123 or +44 7700 900123."
          hint={sm === "S" ? "UK mobile preferred. We may call to arrange your interview." : null}
          error={errors.phone}
          supportMode={sm}
          isGuidedActive={gf === "phone"}
        >
          <Input
            id="phone"
            type="tel"
            placeholder="07700 900123"
            value={values.phone}
            hasError={!!errors.phone}
            onFocus={() => tracker.onFieldFocus("phone")}
            onKeyDown={(e) => tracker.onKeyDown(e, "phone")}
            onChange={(e) => {
              tracker.onInputChange("phone");
              onChange("phone", e.target.value);
            }}
          />
        </FieldWrap>

        <div className="md:col-span-2">
          <FieldWrap
            label="Home address"
            required
            tooltip="Your full residential address including street, city, and postcode."
            hint={
              sm === "S" ? "Full address including house number, street, town and county. No PO Boxes." : null
            }
            error={errors.address}
            supportMode={sm}
            isGuidedActive={gf === "address"}
          >
            <Textarea
              id="address"
              placeholder={"Street address\nCity\nCounty"}
              value={values.address}
              rows={3}
              hasError={!!errors.address}
              onFocus={() => tracker.onFieldFocus("address")}
              onKeyDown={(e) => tracker.onKeyDown(e, "address")}
              onChange={(e) => {
                tracker.onInputChange("address");
                onChange("address", e.target.value);
              }}
            />
          </FieldWrap>
        </div>

        <FieldWrap
          label="Postcode"
          required
          tooltip="Your current UK postcode."
          hint={sm === "S" ? "Must match your address above. Format: SW1A 1AA or M1 1AA." : null}
          error={errors.postcode}
          supportMode={sm}
          isGuidedActive={gf === "postcode"}
        >
          <Input
            id="postcode"
            placeholder="SW1A 1AA"
            value={values.postcode}
            hasError={!!errors.postcode}
            onFocus={() => tracker.onFieldFocus("postcode")}
            onKeyDown={(e) => tracker.onKeyDown(e, "postcode")}
            onChange={(e) => {
              tracker.onInputChange("postcode");
              onChange("postcode", e.target.value);
            }}
          />
        </FieldWrap>

        <FieldWrap
          label="Nationality"
          required
          tooltip="Select your nationality. Required for right-to-work verification."
          error={errors.nationality}
          hint={sm === "S" ? "Required by law for right-to-work checks. Does not affect your application." : null}
          supportMode={sm}
          isGuidedActive={gf === "nationality"}
        >
          <Select
            id="nationality"
            value={values.nationality}
            placeholder="Select nationality…"
            hasError={!!errors.nationality}
            onFocus={() => tracker.onFieldFocus("nationality")}
            onChange={(v) => {
              tracker.onInputChange("nationality");
              onChange("nationality", v);
            }}
            options={[
              "British",
              "Irish",
              "EU / EEA national",
              "Australian",
              "Canadian",
              "Indian",
              "Pakistani",
              "Bangladeshi",
              "Nigerian",
              "Zimbabwean",
              "Other (Requires visa sponsorship)",
            ]}
          />
        </FieldWrap>
      </div>
    </div>
  );
}

// ─── Step 2: Education & employment ──────────────────────────────────────────

export function StepEducation({
  values,
  errors,
  onChange,
  tracker,
  supportMode,
  guidedField,
}) {
  const sm = supportMode;
  const gf = guidedField;

  return (
    <div style={{ animation: "fadeIn .3s ease" }}>
      <StepHeader
        title="Education & employment"
        sub="Tell us about your qualifications and work experience."
      />

      <SectionLabel>Education</SectionLabel>
      <div className="grid md:grid-cols-2 gap-y-3 gap-x-5">
        <FieldWrap
          label="Highest qualification"
          required
          tooltip="Your highest completed academic or professional qualification."
          error={errors.qualification}
          supportMode={sm}
          hint={sm === "S" ? "Select the highest qualification you have fully completed, not one in progress." : null}
          isGuidedActive={gf === "qualification"}
        >
          <Select
            id="qualification"
            value={values.qualification}
            placeholder="Select qualification…"
            hasError={!!errors.qualification}
            onFocus={() => tracker.onFieldFocus("qualification")}
            onChange={(v) => {
              tracker.onInputChange("qualification");
              onChange("qualification", v);
            }}
            options={[
              "GCSE / O-Level",
              "A-Level / AS-Level",
              "BTEC / NVQ Level 3",
              "HNC / HND",
              "Foundation Degree",
              "Bachelor's Degree (BA/BSc)",
              "Postgraduate Certificate / Diploma",
              "Master's Degree (MA/MSc/MBA)",
              "Doctorate (PhD/DPhil)",
              "Professional Qualification (e.g. ACCA, CIPD)",
              "Other",
            ]}
          />
        </FieldWrap>

        <FieldWrap
          label="University / institution name"
          tooltip="Name of the college or university where you completed your highest qualification."
          hint={sm === "S" ? "Full official name of the college or university. Leave blank if not applicable." : null}
          error={errors.university}
          supportMode={sm}
          isGuidedActive={gf === "university"}
        >
          <Input
            id="university"
            placeholder="e.g. University of Manchester"
            value={values.university}
            hasError={!!errors.university}
            onFocus={() => tracker.onFieldFocus("university")}
            onKeyDown={(e) => tracker.onKeyDown(e, "university")}
            onChange={(e) => {
              tracker.onInputChange("university");
              onChange("university", e.target.value);
            }}
          />
        </FieldWrap>
      </div>

      <SectionLabel>Work experience</SectionLabel>
      <div className="grid md:grid-cols-2 gap-y-3 gap-x-5">
        <FieldWrap
          label="Years of relevant experience"
          required
          tooltip="Total years of professional experience relevant to the role."
          hint={sm === "S" ? "Paid work only. Count internships. Enter 0 if you are a recent graduate." : null}
          error={errors.yearsExperience}
          supportMode={sm}
          isGuidedActive={gf === "yearsExperience"}
        >
          <Input
            id="yearsExperience"
            type="number"
            placeholder="e.g. 3"
            value={values.yearsExperience}
            hasError={!!errors.yearsExperience}
            onFocus={() => tracker.onFieldFocus("yearsExperience")}
            onKeyDown={(e) => tracker.onKeyDown(e, "yearsExperience")}
            onChange={(e) => {
              tracker.onInputChange("yearsExperience");
              onChange("yearsExperience", e.target.value);
            }}
          />
        </FieldWrap>

        <FieldWrap
          label="Current employment status"
          required
          tooltip="Your current working situation."
          error={errors.employmentStatus}
          supportMode={sm}
          hint={sm === "S" ? "Helps us understand your availability and likely notice period." : null}
          isGuidedActive={gf === "employmentStatus"}
        >
          <Select
            id="employmentStatus"
            value={values.employmentStatus}
            placeholder="Select status…"
            hasError={!!errors.employmentStatus}
            onFocus={() => tracker.onFieldFocus("employmentStatus")}
            onChange={(v) => {
              tracker.onInputChange("employmentStatus");
              onChange("employmentStatus", v);
            }}
            options={[
              "Employed full-time",
              "Employed part-time",
              "Self-employed / Freelance",
              "Contract / Temporary",
              "Apprenticeship",
              "Unemployed — seeking work",
              "Student",
              "Career break / Sabbatical",
              "Retired",
            ]}
          />
        </FieldWrap>

        <FieldWrap
          label="Previous employer"
          tooltip="The name of your most recent employer."
          hint={sm === "S" ? "Full company name. If self-employed, enter your trading name." : null}
          error={errors.prevEmployer}
          supportMode={sm}
          isGuidedActive={gf === "prevEmployer"}
        >
          <Input
            id="prevEmployer"
            placeholder="e.g. Acme Ltd"
            value={values.prevEmployer}
            hasError={!!errors.prevEmployer}
            onFocus={() => tracker.onFieldFocus("prevEmployer")}
            onKeyDown={(e) => tracker.onKeyDown(e, "prevEmployer")}
            onChange={(e) => {
              tracker.onInputChange("prevEmployer");
              onChange("prevEmployer", e.target.value);
            }}
          />
        </FieldWrap>

        <FieldWrap
          label="Most recent job title"
          tooltip="Your job title at your most recent role."
          hint={sm === "S" ? "Exact title from your contract — not a shortened version." : null}
          error={errors.jobTitle}
          supportMode={sm}
          isGuidedActive={gf === "jobTitle"}
        >
          <Input
            id="jobTitle"
            placeholder="e.g. Senior Software Engineer"
            value={values.jobTitle}
            hasError={!!errors.jobTitle}
            onFocus={() => tracker.onFieldFocus("jobTitle")}
            onKeyDown={(e) => tracker.onKeyDown(e, "jobTitle")}
            onChange={(e) => {
              tracker.onInputChange("jobTitle");
              onChange("jobTitle", e.target.value);
            }}
          />
        </FieldWrap>

        <FieldWrap
          label="Employment start date"
          tooltip="When you started at your most recent employer."
          hint={sm === "S" ? "If unsure of exact date, use the 1st of that month." : null}
          error={errors.empStartDate}
          supportMode={sm}
          isGuidedActive={gf === "empStartDate"}
        >
          <Input
            id="empStartDate"
            type="date"
            value={values.empStartDate}
            hasError={!!errors.empStartDate}
            onFocus={() => tracker.onFieldFocus("empStartDate")}
            onKeyDown={(e) => tracker.onKeyDown(e, "empStartDate")}
            onChange={(e) => {
              tracker.onInputChange("empStartDate");
              onChange("empStartDate", e.target.value);
            }}
          />
        </FieldWrap>

        <FieldWrap
          label="Employment end date"
          tooltip="When you left — leave blank if currently employed there."
          hint={sm === "S" ? "Leave blank if you still work there." : null}
          error={errors.empEndDate}
          supportMode={sm}
          isGuidedActive={gf === "empEndDate"}
        >
          <Input
            id="empEndDate"
            type="date"
            value={values.empEndDate}
            hasError={!!errors.empEndDate}
            onFocus={() => tracker.onFieldFocus("empEndDate")}
            onKeyDown={(e) => tracker.onKeyDown(e, "empEndDate")}
            onChange={(e) => {
              tracker.onInputChange("empEndDate");
              onChange("empEndDate", e.target.value);
            }}
          />
        </FieldWrap>
      </div>
    </div>
  );
}

// ─── Step 3: Skills & supporting information ──────────────────────────────────

const SKILL_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Vue",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "C#",
  ".NET",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "Git",
  "Figma",
  "Project Management",
  "Agile / Scrum",
  "Data Analysis",
  "Machine Learning",
  "Communication",
  "Leadership",
  "Problem Solving",
  "Customer Service",
];

const ROLE_OPTIONS = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full-Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Data Analyst",
  "UX / UI Designer",
  "Product Manager",
  "Project Manager",
  "Business Analyst",
  "QA Engineer",
  "Cybersecurity Analyst",
  "Cloud Architect",
  "HR Manager",
  "Marketing Manager",
  "Sales Executive",
  "Financial Analyst",
  "Operations Manager",
  "Other",
];

export function StepSkills({
  values,
  errors,
  onChange,
  tracker,
  supportMode,
  guidedField,
}) {
  const sm = supportMode;
  const gf = guidedField;

  return (
    <div style={{ animation: "fadeIn .3s ease" }}>
      <StepHeader
        title="Skills & supporting information"
        sub="Help us understand your expertise and what you are looking for."
      />

      {/* Multi-select skills */}
      <FieldWrap
        label="Technical & professional skills"
        required
        tooltip="Select all skills relevant to your application. Choose as many as apply."
        hint={
          sm === "S" ? "Select all relevant technical and professional skills. At least one selection is required to continue." : null
        }
        error={errors.skills}
        supportMode={sm}
        isGuidedActive={gf === "skills"}
      >
        <MultiSelect
          id="skills"
          value={values.skills || []}
          options={SKILL_OPTIONS}
          hasError={!!errors.skills}
          onFocus={() => tracker.onFieldFocus("skills")}
          onChange={(v) => {
            tracker.onInputChange("skills");
            onChange("skills", v);
          }}
        />
      </FieldWrap>

      {/* Preferred role + salary */}
      <div className="grid md:grid-cols-2 gap-y-3 gap-x-5">

        <FieldWrap
          label="Salary expectation (£ / year)"
          required
          tooltip="Your expected annual gross salary in GBP. Numbers only."
          hint={sm === "S" ? "Annual gross in £. Research typical salaries on Glassdoor before entering." : "Annual gross in GBP"}
          error={errors.salaryExpectation}
          supportMode={sm}
          isGuidedActive={gf === "salaryExpectation"}
        >
          <Input
            id="salaryExpectation"
            type="number"
            placeholder="e.g. 45000"
            value={values.salaryExpectation}
            prefix="£"
            hasError={!!errors.salaryExpectation}
            onFocus={() => tracker.onFieldFocus("salaryExpectation")}
            onKeyDown={(e) => tracker.onKeyDown(e, "salaryExpectation")}
            onChange={(e) => {
              tracker.onInputChange("salaryExpectation");
              onChange("salaryExpectation", e.target.value);
            }}
          />
        </FieldWrap>

        <FieldWrap
          label="Available to start from"
          required
          tooltip="The earliest date you could start if offered the role."
          hint={sm === "S" ? "Include your notice period. Select today if immediately available." : null}
          error={errors.availabilityDate}
          supportMode={sm}
          isGuidedActive={gf === "availabilityDate"}
        >
          <Input
            id="availabilityDate"
            type="date"
            value={values.availabilityDate}
            hasError={!!errors.availabilityDate}
            onFocus={() => tracker.onFieldFocus("availabilityDate")}
            onKeyDown={(e) => tracker.onKeyDown(e, "availabilityDate")}
            onChange={(e) => {
              tracker.onInputChange("availabilityDate");
              onChange("availabilityDate", e.target.value);
            }}
          />
        </FieldWrap>

        <FieldWrap
          label="Preferred work arrangement"
          tooltip="Your preference for remote, office, or hybrid working."
          hint={sm === "S" ? "Hybrid = 2–3 days office per week. This is a preference, not guaranteed." : null}
          error={errors.workArrangement}
          supportMode={sm}
          isGuidedActive={gf === "workArrangement"}
        >
          <Select
            id="workArrangement"
            value={values.workArrangement}
            placeholder="Select preference…"
            hasError={!!errors.workArrangement}
            options={[
              "On-site (office only)",
              "Hybrid (2–3 days office)",
              "Fully remote",
              "Flexible / No preference",
            ]}
            onFocus={() => tracker.onFieldFocus("workArrangement")}
            onChange={(v) => {
              tracker.onInputChange("workArrangement");
              onChange("workArrangement", v);
            }}
          />
        </FieldWrap>

        <div className="md:col-span-2">
          <FieldWrap
            label="Cover letter / personal statement"
            required
            tooltip="Explain why you are applying and what you would bring to the team. Aim for 2–4 paragraphs."
            hint={
              sm === "S"
                ? "Why this role, your key achievements, and what you can contribute. 2–4 paragraphs."
                : "Minimum 20 characters"
            }
            error={errors.coverLetter}
            supportMode={sm}
            isGuidedActive={gf === "coverLetter"}
          >
            <Textarea
              id="coverLetter"
              placeholder={
                "Dear Hiring Manager,\n\nI am writing to express my interest in…"
              }
              value={values.coverLetter}
              rows={8}
              hasError={!!errors.coverLetter}
              onFocus={() => tracker.onFieldFocus("coverLetter")}
              onKeyDown={(e) => tracker.onKeyDown(e, "coverLetter")}
              onChange={(e) => {
                tracker.onInputChange("coverLetter");
                onChange("coverLetter", e.target.value);
              }}
            />
          </FieldWrap>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Documents & final review ────────────────────────────────────────

// Guard: if a value is somehow a non-primitive (e.g. an event object), show a fallback
function safeDisplay(value) {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return "—"; // never render a raw object into React
  return String(value);
}

function ReviewRow({ label, value, missing }) {
  const display = safeDisplay(value);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "8px 0",
        borderBottom: "1px solid #F1F5F9",
      }}
    >
      <span
        style={{ fontSize: 14, color: "#64748B", minWidth: 160, flexShrink: 0 }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          textAlign: "right",
          color: missing ? "#EF4444" : "#1E293B",
          fontWeight: missing ? 500 : 400,
        }}
      >
        {missing ? "⚠ Not provided" : display || "—"}
      </span>
    </div>
  );
}

export function StepDocuments({
  values,
  errors,
  onChange,
  tracker,
  supportMode,
  guidedField,
}) {
  const sm = supportMode;
  const gf = guidedField;

  const coverPreview = values.coverLetter
    ? values.coverLetter.substring(0, 80) +
      (values.coverLetter.length > 80 ? "…" : "")
    : null;

  const salaryDisplay = values.salaryExpectation
    ? `£${Number(values.salaryExpectation).toLocaleString()}`
    : null;

  const skillsDisplay =
    Array.isArray(values.skills) && values.skills.length > 0
      ? values.skills
      : null;

  const reviewSections = [
    {
      section: "Personal",
      fields: [
        ["Full name", values.fullName],
        ["Email", values.email],
        ["Phone", values.phone],
        ["Date of birth", values.dateOfBirth],
        ["Nationality", values.nationality],
        ["Postcode", values.postcode],
      ],
    },
    {
      section: "Education & Employment",
      fields: [
        ["Highest qualification", values.qualification],
        ["University", values.university],
        [
          "Years of experience",
          values.yearsExperience !== undefined &&
          values.yearsExperience !== null &&
          typeof values.yearsExperience !== "object"
            ? String(values.yearsExperience)
            : null,
        ],
        ["Employment status", values.employmentStatus],
        ["Previous employer", values.prevEmployer],
        ["Most recent job title", values.jobTitle],
      ],
    },
    {
      section: "Skills & Information",
      fields: [
        ["Skills selected", skillsDisplay],
        ["Salary expectation", salaryDisplay],
        ["Availability date", values.availabilityDate],
        ["Work arrangement", values.workArrangement],
        ["Cover letter", coverPreview],
      ],
    },
  ];

  return (
    <div style={{ animation: "fadeIn .3s ease" }}>
      <StepHeader
        title="Documents & final review"
        sub="Upload your documents, review your application, and submit."
      />

      {/* File uploads — two side-by-side boxes */}
      <div className='grid md:grid-cols-2 gap-y-3 gap-x-5'>
        <FieldWrap
          label="Upload your CV"
          required
          tooltip="Upload your CV in PDF or Word format. Max 5 MB."
          hint={
            sm === "S" ? "PDF or Word only, max 5 MB. No photo or date of birth on your CV." : null
          }
          error={errors.cvFile}
          supportMode={sm}
          isGuidedActive={gf === "cvFile"}
        >
          <FileUpload
            id="cvFile"
            label="Upload CV (PDF or Word)"
            accept=".pdf,.doc,.docx"
            value={values.cvFile}
            onFocus={() => tracker.onFieldFocus("cvFile")}
            onChange={(file) => {
              tracker.onInputChange("cvFile");
              onChange("cvFile", file);
            }}
          />
        </FieldWrap>

        <FieldWrap
          label="Upload cover letter (optional)"
          tooltip="Optional: upload a formatted cover letter. Not needed if you typed one in Step 3."
          error={errors.clFile}
          hint={sm === "S" ? "Optional: Upload a formatted cover letter. Not needed if you typed one in Step 3." : null}
          supportMode={sm}
          isGuidedActive={gf === "clFile"}
        >
          <FileUpload
            id="clFile"
            label="Upload Cover Letter (optional)"
            accept=".pdf,.doc,.docx"
            value={values.clFile}
            onFocus={() => tracker.onFieldFocus("clFile")}
            onChange={(file) => {
              tracker.onInputChange("clFile");
              onChange("clFile", file);
            }}
          />
        </FieldWrap>
      </div>

      {/* Review summary */}
      <div style={{ marginTop: 24 }}>
        <SectionLabel>Review your application</SectionLabel>
        {reviewSections.map(({ section, fields }) => (
          <div key={section} style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#3B82F6",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 6,
              }}
            >
              {section}
            </div>
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: 10,
                padding: "2px 14px",
                border: "1px solid #F1F5F9",
              }}
            >
              {fields.map(([label, val]) => (
                <ReviewRow
                  key={label}
                  label={label}
                  value={val}
                  missing={!val || (Array.isArray(val) && val.length === 0)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Terms & conditions */}
      <div
        style={{
          marginTop: 20,
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "#475569",
            lineHeight: 1.7,
            marginBottom: 14,
          }}
        >
          By submitting this application I confirm that all information provided
          is accurate and complete to the best of my knowledge. I consent to
          this data being processed in accordance with the organisation's
          privacy policy and applicable data protection legislation (UK GDPR). I
          understand that providing false information may result in
          disqualification or dismissal.
        </p>
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={!!values.termsAccepted}
            onChange={(e) => {
              tracker.onInputChange("termsAccepted");
              onChange("termsAccepted", e.target.checked);
            }}
            style={{
              marginTop: 2,
              accentColor: "#2563EB",
              width: 15,
              height: 15,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 13,
              color: "#334155",
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            I have read and agree to the terms and conditions, and confirm all
            information is truthful and accurate. *
          </span>
        </label>
        {errors.termsAccepted && (
          <p
            style={{
              fontSize: 11,
              color: "#EF4444",
              marginTop: 8,
              display: "flex",
              gap: 4,
              marginBottom: 0,
            }}
          >
            ⚠ You must accept the terms to submit
          </p>
        )}
      </div>
    </div>
  );
}
