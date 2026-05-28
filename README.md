# Job Application — AI Adaptive Interface
## Cognitive Offloading Dissertation Prototype

A 4-step job application form with real-time AI behaviour monitoring that
dynamically activates one of four support modes when cognitive overload is detected.

---

## Quick start

```bash
npm install
npm run dev
```

Requires Node 18+. Visit http://localhost:5173

---

## Project structure

```
src/
  App.jsx                     ← Main app, navigation, validation, AI wiring
  hooks/
    useAISupport.js           ← AI polling hook + trigger timestamp log
    useBehaviourTracker.js    ← Keystroke, idle, nav-loop, click tracking
  components/
    FormSteps.jsx             ← All 4 form steps (Personal/Education/Skills/Documents)
    ProgressBar.jsx           ← Step progress indicator
    MetricsSidebar.jsx        ← Live metrics panel + trigger log
    SupportBanner.jsx         ← Mode banners, nav quicklinks, guided banner
    FieldWrap.jsx             ← Label, hint, error, mode-aware field wrapper
    SuccessScreen.jsx         ← Submission confirmation + session summary
```

---

## Form steps

| Step | Content                                      | Key validations                         |
|------|----------------------------------------------|-----------------------------------------|
| 1    | Full name, email, phone, DOB, address, postcode, nationality | Email format, UK phone, UK postcode |
| 2    | Qualification, university, experience, employer, employment dates, status | Date order, numeric experience |
| 3    | Skills (multi-select), role, salary, cover letter, availability | Min skills, min cover letter 100 chars |
| 4    | CV upload, cover letter upload, review summary, T&Cs checkbox | CV required, terms required |

---

## Support types

| Type | Mode                | Triggered when                              |
|------|---------------------|---------------------------------------------|
| S    | Simplification      | High validation failures                    |
| N    | Navigation guidance | Navigation loops detected                   |
| H    | Contextual hints    | Idle time / cursor hesitation               |
| G    | Guided walkthrough  | Multiple loops + multiple validation fails  |

---

## Trigger timestamp log

Every API poll is logged in `aiState.supportTriggerLog`:

```js
[
  { pollNumber: 1, sessionSeconds: 8,  wallTime: "14:02:03", needSupport: false, type: null,  confidence: 12 },
  { pollNumber: 2, sessionSeconds: 16, wallTime: "14:02:11", needSupport: false, type: null,  confidence: 28 },
  { pollNumber: 3, sessionSeconds: 25, wallTime: "14:02:20", needSupport: true,  type: "S",   confidence: 67 },
]
```

All polls also print to the browser console:
  [AI] Poll #3 at 25s (14:02:20) → ✅ needSupport=true, type="S", confidence=67%

---

## Connect your real API

Edit `src/hooks/useAISupport.js` — replace `callSupportAPI()`:

```js
const response = await fetch('/api/support-decision', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ metrics, currentStep }),
})
return await response.json()
// Must return: { needSupport: boolean, type: "S"|"N"|"H"|"G", confidence: number }
```

Change polling interval at the top of the same file:
```js
export const POLL_INTERVAL_MS = 20000   // 20 seconds default
```
