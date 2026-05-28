import { useRef, useState, useCallback, useEffect } from "react";
import apiClient from "../../services/apiClient.js";

/**
 * AI Support Decision Hook
 *
 * Polls your API every POLL_INTERVAL_MS milliseconds with collected behaviour metrics.
 * Records EXACTLY when (session elapsed seconds) support was triggered.
 *
 * Expected API response: { needSupport: boolean, type: "S"|"N"|"H"|"G", confidence: number }
 *   S = Simplification mode
 *   N = Navigation guidance
 *   H = Inline hints / contextual tooltips
 *   G = Guided walkthrough
 *
 * ─── SUPPORT TRIGGER TIMESTAMPS ───────────────────────────────────────────────
 * aiState.supportTriggerLog  is an array of objects, one per poll:
 *   {
 *     pollNumber:     number,   // poll #1, #2, #3…
 *     sessionSeconds: number,   // seconds since session start at poll time
 *     wallTime:       string,   // "HH:MM:SS"
 *     needSupport:    boolean,
 *     type:           string|null,
 *     confidence:     number,
 *   }
 *
 * The FIRST entry where needSupport===true is when support triggered.
 * All polls are also printed to the browser console:
 *   [AI] Poll #3 at 25s (14:02:11) → ✅ needSupport=true, type="S", confidence=67%
 *   [AI] Poll #5 at 41s (14:02:27) → ⬜ needSupport=false, confidence=18%
 */

// ── CONFIG ───────────────────────────────────────────────────────────────────
export const POLL_INTERVAL_MS = 30000; // milliseconds between polls
// ─────────────────────────────────────────────────────────────────────────────

// ── Mock API (replace with real fetch) ───────────────────────────────────────
async function callSupportAPI(metrics) {
  const response = await apiClient.post("/analyse/high-support", metrics);
  return response?.data?.data;
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useAISupport({ onSupportDecision, sessionStartRef }) {
  const [state, setState] = useState({
    status: "idle", // idle | analyzing | triggered | active
    probability: 0,
    type: null,
    pollCount: 0,
    lastChecked: null,
    supportTriggerLog: [], // full poll history with timestamps
  });

  const timerRef = useRef(null);
  const activeRef = useRef(false);

  const poll = useCallback(
    async (getMetrics, currentStep) => {
      if (activeRef.current) return;

      
      try {
        const metrics = getMetrics();
        if (metrics?.totalKeystrokes < 15 || metrics?.backspaceCount < 5) return;
        setState((s) => ({ ...s, status: "analyzing" }));
        const result = await callSupportAPI(metrics, currentStep);

        const now = Date.now();
        const sessionSeconds = sessionStartRef?.current
          ? Math.round((now - sessionStartRef.current) / 1000)
          : null;
        const wallTime = new Date().toLocaleTimeString("en-GB", {
          hour12: false,
        });

        setState((s) => {
          const pollNumber = s.pollCount + 1;
          const logEntry = {
            pollNumber,
            sessionSeconds,
            wallTime,
            needSupport: result?.needSupport,
            type: result?.type,
          };

          return {
            ...s,
            status: result?.needSupport ? "triggered" : "idle",
            type: result?.type,
            pollCount: pollNumber,
            lastChecked: wallTime,
            confidence: result?.score,
            supportTriggerLog: [...s.supportTriggerLog, logEntry],
          };
        });

        if (result?.needSupport && !activeRef.current) {
          activeRef.current = true;
          clearInterval(timerRef.current);
          setState((s) => ({ ...s, status: "active" }));
          onSupportDecision({
            needSupport: true,
            type: result?.type,
            confidence: result?.score,
            model: result?.modelUsed
          });
        }
      } catch (err) {
        setState((s) => ({ ...s, status: "idle" }));
      }
    },
    [onSupportDecision, sessionStartRef],
  );

  const startPolling = useCallback(
    (getMetrics, getCurrentStep) => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(
        () => poll(getMetrics, getCurrentStep()),
        POLL_INTERVAL_MS,
      );
    },
    [poll],
  );

  const stopPolling = useCallback(() => clearInterval(timerRef.current), []);
  const forceCheck = useCallback(
    (getMetrics, currentStep) => poll(getMetrics, currentStep),
    [poll],
  );

  const resetSupport = useCallback(() => {
    activeRef.current = false;
    setState({
      status: "idle",
      probability: 0,
      type: null,
      pollCount: 0,
      lastChecked: null,
      supportTriggerLog: [],
    });
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  return {
    aiState: state,
    startPolling,
    stopPolling,
    forceCheck,
    resetSupport,
  };
}
