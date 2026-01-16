import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section
        className="relative min-h-screen bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6')",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 animate-fadeUp">
            Agrishayak Smart CROP Agriculture <br />
            <span className="text-green-700">With SmartCrop AI and ML</span>
          </h1>

          <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto animate-fadeUp">
            AI-powered crop recommendation, Disease detection, Mandi insights
            and live auctions — built for farmers.
          </p>

          <button
            onClick={() => navigate("/crop")}
            className="mt-8 px-8 py-3 rounded-full bg-black text-white hover:bg-green-700 transition animate-fadeUp"
          >
            Get Started →
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat title="5+" desc="AI Models Used" />
          <Stat title="100+" desc="Crop Types" />
          <Stat title="10K+" desc="Farmers Impacted" />
          <Stat title="Live" desc="Market Prices" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gradient-to-b from-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-12">
            Next-Gen Solutions For Farmers
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <GlassCard
              title="Crop Recommendation"
              onClick={() => navigate("/crop")}
            />
            <GlassCard
              title="Disease Detection"
              onClick={() => navigate("/disease")}
            />
            <GlassCard
              title="Mandi Market"
              onClick={() => navigate("/mandi")}
            />
            <GlassCard
              title="Live Auction"
              onClick={() => navigate("/auction")}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506784983877-45594efa4cbe')",
        }}
      >
        <div className="absolute inset-0 bg-green-900/60"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6 animate-fadeUp">
            Join the Agricultural Revolution
          </h2>
          <p className="mb-8 animate-fadeUp">
            Smart decisions. Better yields. Fair pricing.
          </p>
          <button
            onClick={() => navigate("/crop")}
            className="px-8 py-3 rounded-full bg-white text-green-800 font-semibold hover:bg-green-100 transition"
          >
            Start Now →
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ---------- COMPONENTS ---------- */

function Stat({ title, desc }) {
  return (
    <div className="animate-fadeUp">
      <h3 className="text-3xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-1">{desc}</p>
    </div>
  );
}

function GlassCard({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl p-6 bg-white/60 backdrop-blur-lg shadow-xl shadow-green-900/10 hover:scale-105 transition transform animate-fadeUp"
    >
      <div className="h-40 rounded-xl bg-gradient-to-br from-green-200 to-green-100 mb-4"></div>
      <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">
        AI powered agriculture solution
      </p>
    </div>
  );
}
