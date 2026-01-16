export default function FilterBar({ state, crop, setState, setCrop, onSearch }) {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-4 animate-fadeSlideUp">

      <input
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder="State (e.g. Karnataka)"
        className="flex-1 p-3 rounded-xl border focus:ring-2 focus:ring-green-400"
      />

      <input
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
        placeholder="Crop (optional)"
        className="flex-1 p-3 rounded-xl border focus:ring-2 focus:ring-green-400"
      />

      <button
        onClick={onSearch}
        className="px-8 py-3 rounded-full bg-black text-white hover:bg-green-700 transition"
      >
        Search
      </button>
    </div>
  );
}
