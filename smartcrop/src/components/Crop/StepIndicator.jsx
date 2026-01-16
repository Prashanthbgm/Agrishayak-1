export default function StepIndicator({ step }) {
  return (
    <div className="flex justify-center gap-6 mb-8">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
          ${step === n ? "bg-green-600 text-white" : "bg-green-100 text-green-700"}`}
        >
          {n}
        </div>
      ))}
    </div>
  );
}
