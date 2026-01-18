export default function DiseaseResultCard({ result }) {
  if (!result) return null;

  /* ---------- ERROR CASE ---------- */
  if (result.error) {
    return (
      <ResultWrapper color="red" title="Detection Error">
        <p className="text-sm text-gray-700">
          {result.error}
        </p>
        {result.details && (
          <p className="mt-2 text-xs text-gray-500">
            {result.details}
          </p>
        )}
      </ResultWrapper>
    );
  }

  /* ---------- NOT A PLANT ---------- */
  if (result.is_plant === false) {
    return (
      <ResultWrapper color="yellow" title="Invalid Image">
        <p className="text-sm text-gray-700">
          This image does not appear to be a crop leaf.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Please upload a clear photo of a single leaf.
        </p>
      </ResultWrapper>
    );
  }

  /* ---------- UNCERTAIN ---------- */
  if (result.label === "Uncertain") {
    return (
      <ResultWrapper color="orange" title="Uncertain Result">
        <p className="text-sm text-gray-700">
          The AI is not confident about this image.
        </p>

        {result.confidence !== null && (
          <p className="mt-2 text-sm">
            <b>Confidence:</b> {result.confidence}%
          </p>
        )}

        <p className="mt-2 text-sm text-gray-600">
          Please retake the image with good lighting and the leaf clearly visible.
        </p>
      </ResultWrapper>
    );
  }

  /* ---------- HEALTHY / DISEASED ---------- */
  const isHealthy = result.label === "Healthy";

  return (
    <ResultWrapper
      color={isHealthy ? "green" : "red"}
      title={isHealthy ? "🌿 Plant is Healthy" : "🦠 Disease Detected"}
    >
      <p className="text-sm">
        <b>Status:</b> {result.label}
      </p>

      {result.confidence !== null && (
        <p className="text-sm mt-1">
          <b>Confidence:</b> {result.confidence}%
        </p>
      )}

      {!isHealthy && (
        <>
          {result.disease_name && (
            <p className="mt-2 text-sm">
              <b>Disease:</b> {result.disease_name}
            </p>
          )}

          {result.remedy && (
            <div className="mt-3 text-sm bg-white/70 border rounded-lg p-3">
              <b>Recommended Action:</b>
              <p className="mt-1 text-gray-700">{result.remedy}</p>
            </div>
          )}
        </>
      )}

      {isHealthy && (
        <p className="mt-2 text-sm text-gray-600">
          No disease symptoms detected. Continue regular crop care.
        </p>
      )}
    </ResultWrapper>
  );
}

/* ---------- WRAPPER COMPONENT ---------- */

function ResultWrapper({ color, title, children }) {
  const styles = {
    green: "bg-green-50 border-green-300 text-green-800",
    red: "bg-red-50 border-red-300 text-red-800",
    yellow: "bg-yellow-50 border-yellow-300 text-yellow-800",
    orange: "bg-orange-50 border-orange-300 text-orange-800",
  };

  return (
    <div
      className={`mt-10 rounded-2xl border p-6 shadow-md animate-fadeSlideUp ${styles[color]}`}
    >
      <h3 className="text-xl font-semibold mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
