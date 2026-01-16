export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-green-700 mb-4">
        🌾 Crop Recommendation
      </h3>

      <p><b>Main Crop:</b> {result.Recommended_Crop}</p>
      <p><b>Alternative Crop:</b> {result.Suggested_Crop}</p>
      <p><b>High Value Crop:</b> {result.High_Value_Alt}</p>
    </div>
  );
}
