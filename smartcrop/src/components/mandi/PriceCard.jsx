export default function PriceCard({ item }) {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 animate-fadeSlideUp">
      <h3 className="text-xl font-semibold text-green-800">
        🌾 {item.crop}
      </h3>

      <p className="text-gray-600 mt-1">
        {item.market}, {item.district}
      </p>

      <div className="mt-4 text-3xl font-bold text-gray-900">
        ₹ {item.price}
        <span className="text-sm text-gray-500 ml-1">/ quintal</span>
      </div>
    </div>
  );
}
