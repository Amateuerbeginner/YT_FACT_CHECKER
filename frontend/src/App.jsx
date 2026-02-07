import { useMemo, useState } from "react";
import LoadingOverlay from "./components/LoadingOverlay";

export default function App() {
  const [url, setUrl] = useState("");
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);

  const score = useMemo(() => {
    const s = Number(out?.propaganda_score);
    if (!Number.isFinite(s)) return null;
    return Math.max(0, Math.min(10, s));
  }, [out]);

  const analyze = async (e) => {
    e.preventDefault();
    setOut(null);
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setOut(data);
    } catch (err) {
      setOut({ error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100">
      <LoadingOverlay show={loading} />

      <div className="navbar bg-base-100/70 backdrop-blur border-b border-base-300 sticky top-0 z-40">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">TruthScanner</a>
        </div>
        <div className="navbar-end">
          <span className="badge badge-outline">Vite + Flask</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="text-3xl md:text-4xl font-bold">
              YouTube Summary + Fact Checks + Propaganda Score
            </h1>
            <p className="opacity-80">
              Paste a YouTube link. The app reads captions, finds questionable claims, detects fallacies, and scores propaganda.
            </p>

            <form onSubmit={analyze} className="mt-4 flex flex-col md:flex-row gap-3">
              <input
                className="input input-bordered w-full"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
              <button className="btn btn-primary md:w-40" disabled={loading}>
                {loading ? "Working..." : "Analyze"}
              </button>
            </form>
          </div>
        </div>

        {out?.error && (
          <div className="alert alert-error shadow">
            <span>{out.error}</span>
          </div>
        )}

        {out && !out.error && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl lg:col-span-1">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Propaganda score</h2>

                {score !== null && (
                  <div
                    className="radial-progress text-primary"
                    style={{ "--value": (score / 10) * 100, "--size": "10rem", "--thickness": "12px" }}
                    role="progressbar"
                    aria-valuenow={(score / 10) * 100}
                  >
                    <div className="text-2xl font-bold">{score.toFixed(1)}/10</div>
                  </div>
                )}

                <p className="opacity-80">{out.score_reasoning || "No reasoning returned."}</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl lg:col-span-2">
              <div className="card-body">
                <h2 className="card-title">Summary</h2>
                <p className="opacity-90">{out.summary || "No summary returned."}</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl lg:col-span-2">
              <div className="card-body">
                <h2 className="card-title">Factual errors</h2>

                {(out.factual_errors || []).length === 0 ? (
                  <p className="opacity-70">No factual errors found (or none detected).</p>
                ) : (
                  <div className="space-y-3">
                    {(out.factual_errors || []).map((x, i) => (
                      <div key={i} className="collapse collapse-arrow bg-base-200">
                        <input type="checkbox" />
                        <div className="collapse-title font-semibold">{x.statement}</div>
                        <div className="collapse-content space-y-2">
                          <div className="alert alert-warning">
                            <span><b>Correction:</b> {x.correction}</span>
                          </div>
                          <p className="opacity-80"><b>Why wrong:</b> {x.why_wrong}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl lg:col-span-1">
              <div className="card-body">
                <h2 className="card-title">Logical fallacies</h2>

                {(out.logical_errors || []).length === 0 ? (
                  <p className="opacity-70">None detected.</p>
                ) : (
                  <ul className="menu bg-base-200 rounded-box">
                    {(out.logical_errors || []).map((x, i) => (
                      <li key={i}>
                        <details>
                          <summary>{x.fallacy}</summary>
                          <div className="p-2 text-sm opacity-80">
                            <div><b>Quote:</b> {x.quote}</div>
                            <div><b>Why:</b> {x.explanation}</div>
                          </div>
                        </details>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

