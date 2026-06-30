import { useState } from "react";

import { fetchHealth } from "./lib/api";
import type { HealthResponse } from "./types/health";

type HealthState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: HealthResponse }
  | { status: "error"; message: string };

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

export default function App() {
  const [healthState, setHealthState] = useState<HealthState>({ status: "idle" });

  const handleCheckHealth = async () => {
    setHealthState({ status: "loading" });

    try {
      const data = await fetchHealth();
      setHealthState({ status: "success", data });
    } catch (error) {
      setHealthState({ status: "error", message: getErrorMessage(error) });
    }
  };

  const isLoading = healthState.status === "loading";

  return (
    <main className="app-shell">
      <section className="panel" aria-labelledby="app-title">
        <div className="eyebrow">FastAPI + React</div>
        <h1 id="app-title">Lightweight Template</h1>
        <div className="status-row">
          <span className="status-label">Backend health</span>
          <span className="status-badge">
            {healthState.status === "success" ? healthState.data.status : healthState.status}
          </span>
        </div>
        <button type="button" onClick={handleCheckHealth} disabled={isLoading}>
          {isLoading ? "Checking..." : "Check health"}
        </button>
        {healthState.status === "error" ? (
          <p className="message error" role="alert">
            {healthState.message}
          </p>
        ) : null}
        {healthState.status === "success" ? (
          <p className="message" role="status">
            API status: {healthState.data.status}
          </p>
        ) : null}
      </section>
    </main>
  );
}
