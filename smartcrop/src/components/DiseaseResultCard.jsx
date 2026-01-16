export default function DiseaseResultCard({ result }) {
  if (!result) return null;

  /* ❌ NOT A PLANT */
  if (result.is_plant === false) {
    return (
      <ResultWrapper color="yellow" title="Invalid Image">
        <p>{result.message}</p>
        <p className="text-sm mt-2 text-gray-600">
          Green Ratio: {result.green_ratio} | Texture: {result.texture_variance}
        </p>
      </ResultWrapper>
    );
  }

  /* ⚠️ UNCERTAIN */
  if (result.label === "Uncertain") {
    return (
      <ResultWrapper color="orange" title="Uncertain Result">
        <p>{result.message}</p>
        <p className="mt-2">
          <b>Confidence:</b> {result.confidence}
        </p>
      </ResultWrapper>
    );
  }

  /* ✅ HEALTHY / DISEASE */
  const healthy = result.label === "Healthy";

  return (
    <ResultWrapper
      color={healthy ? "green" : "red"}
      title={healthy ? "Plant is Healthy" : "Disease Detected"}
    >
      <p>
        <b>Status:</b> {result.label}
      </p>
      <p>
        <b>Confidence:</b> {result.confidence}
      </p>

      {!healthy && (
        <p className="mt-2 text-sm text-gray-700">
          Please consult an agriculture officer or apply suitable treatment.
        </p>
      )}
    </ResultWrapper>
  );
}

/* ---------- HELPER ---------- */

function ResultWrapper({ color, title, children }) {
  const colors = {
    green: "bg-green-50 border-green-300 text-green-700",
    red: "bg-red-50 border-red-300 text-red-700",
    yellow: "bg-yellow-50 border-yellow-300 text-yellow-700",
    orange: "bg-orange-50 border-orange-300 text-orange-700",
  };

  return (
    <div
      className={`mt-10 rounded-2xl border p-6 animate-fadeSlideUp ${colors[color]}`}
    >
      <h3 className="text-xl font-semibold mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
