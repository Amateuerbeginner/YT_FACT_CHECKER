export default function LoadingOverlay({ show, text = "Analyzing video..." }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="card bg-base-100 shadow-xl w-[min(520px,92vw)]">
        <div className="card-body items-center text-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <h2 className="card-title">{text}</h2>
          <p className="opacity-70">Fetching transcript, checking claims, and scoring propaganda.</p>
        </div>
      </div>
    </div>
  );
}

