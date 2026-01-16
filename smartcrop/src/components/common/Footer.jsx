export default function Footer() {
  return (
    <footer className="mt-20 bg-gradient-to-b from-white to-green-50 border-t border-green-100">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h3 className="text-xl font-bold text-green-800 flex items-center gap-2">
            🌾 SmartCrop
          </h3>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            A smart agriculture platform helping farmers make better crop
            decisions using AI, real-time market insights, and direct selling.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h4 className="font-semibold text-green-700 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Home</li>
            <li>Crop Recommender</li>
            <li>Disease Detection</li>
            <li>Mandi Market</li>
            <li>Live Auction</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="font-semibold text-green-700 mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Help Center</li>
            <li>FAQs</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="font-semibold text-green-700 mb-3">Contact</h4>
          <p className="text-sm text-gray-700">📍 India</p>
          <p className="text-sm text-gray-700">📞 +91 6360849260</p>
          <p className="text-sm text-gray-700">✉️ support@Agrishayaksmartcrop.ai</p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-green-900 text-green-100 text-center text-sm py-4">
        © {new Date().getFullYear()} SmartCrop. All rights reserved.
      </div>
    </footer>
  );
}
