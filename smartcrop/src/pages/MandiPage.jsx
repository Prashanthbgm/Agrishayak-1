import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MandiMarket() {
  const [state, setState] = useState("Karnataka");
  const [crop, setCrop] = useState("");
  const [prices, setPrices] = useState([]);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/mandi-prices?state=${state}&crop=${crop}`
      );
      setPrices(res.data.prices || []);
      setInsight(res.data.ai_insight || "");
    } catch {
      alert("Failed to fetch mandi prices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  // Fake trend chart from prices (UI purpose)
  const trendData = prices.slice(0, 7).map((p, i) => ({
    day: `Day ${i + 1}`,
    price: p.price,
  }));

  return (
    <>
      <Navbar />

      {/* HEADER */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold animate-fadeSlideUp">
            📈 Mandi Market Prices
          </h1>
          <p className="mt-4 text-green-100 animate-fadeSlideUp animate-delay-1">
            Live mandi prices from government sources with AI insights
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="relative -mt-24 pb-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* FILTER CARD */}
          <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-6 mb-10 grid md:grid-cols-3 gap-4 animate-fadeSlideUp">
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State (e.g. Karnataka)"
              className="p-3 rounded-xl border focus:ring-2 focus:ring-green-400"
            />

            <input
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder="Crop (optional)"
              className="p-3 rounded-xl border focus:ring-2 focus:ring-green-400"
            />

            <button
              onClick={fetchPrices}
              className="rounded-xl bg-black text-white hover:bg-green-700 transition"
            >
              Search
            </button>
          </div>

          {/* PRICE CARDS */}
          {loading ? (
            <p className="text-center text-gray-600">Loading prices...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {prices.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <h3 className="text-2xl font-semibold text-gray-900">
                    🌾 {item.crop}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.market}, {item.district}
                  </p>

                  <div className="mt-4 text-3xl font-bold text-green-600">
                    ₹ {item.price}
                    <span className="text-sm text-gray-500"> / quintal</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TREND CHART */}
          {trendData.length > 0 && (
            <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-6 mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Price Trend (Recent)
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#16a34a"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* AI INSIGHT */}
          {insight && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-10 animate-fadeSlideUp">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                🤖 AI Market Insight
              </h3>
              <p className="text-gray-700">{insight}</p>
            </div>
          )}

          {/* INFO CARDS */}
          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard
              emoji="💡"
              title="Best Time to Sell"
              text="Use price trends and AI insights to decide the right selling time."
            />
            <InfoCard
              emoji="📊"
              title="Compare Mandis"
              text="Check prices across markets to get better profit."
            />
            <InfoCard
              emoji="🤝"
              title="Direct Selling"
              text="Use Live Auction to sell directly to buyers."
            />
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <button className="px-10 py-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-lg">
              Start Live Auction →
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ---------- INFO CARD ---------- */

function InfoCard({ emoji, title, text }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}
