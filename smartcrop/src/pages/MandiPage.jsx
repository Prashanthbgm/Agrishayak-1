import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../api/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MandiMarket() {
  const [state, setState] = useState("Karnataka");
  const [crop, setCrop] = useState("");
  const [prices, setPrices] = useState([]);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/mandi-prices?state=${state}&crop=${crop}`);
      setPrices(res.data.prices || []);
      setInsight(res.data.ai_insight || "");
    } catch (e) {
      console.error(e);
      alert("Failed to fetch mandi prices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    // eslint-disable-next-line
  }, []);

  const trendData = prices.slice(0, 7).map((p, i) => ({ day: `D${i+1}`, price: p.price || 0 }));

  return (
    <>
      <Navbar />

      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">📈 Mandi Market Prices</h1>
          <p className="mt-3 text-green-100 max-w-2xl mx-auto">Live prices from official sources with simple charts.</p>
        </div>
      </section>

      <section className="-mt-12 pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-8">

          {/* filter card */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow p-6 grid md:grid-cols-3 gap-4">
            <input value={state} onChange={(e)=>setState(e.target.value)} placeholder="State" className="p-3 rounded-xl border focus:ring-2 focus:ring-green-300" />
            <input value={crop} onChange={(e)=>setCrop(e.target.value)} placeholder="Crop (optional)" className="p-3 rounded-xl border focus:ring-2 focus:ring-green-300" />
            <button onClick={fetchPrices} className="rounded-xl bg-black text-white px-6">Search</button>
          </div>

          {/* Price table / cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* table */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Today's Crop Prices</h2>
              {loading ? <p>Loading...</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-green-800">
                        <th className="p-3">Crop</th>
                        <th className="p-3">Market</th>
                        <th className="p-3">District</th>
                        <th className="p-3 text-right">Price (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.map((p, idx) => (
                        <tr key={idx} className="border-b hover:bg-green-50">
                          <td className="p-3">{p.crop}</td>
                          <td className="p-3">{p.market}</td>
                          <td className="p-3">{p.district}</td>
                          <td className="p-3 text-right font-semibold text-green-700">₹ {p.price}</td>
                        </tr>
                      ))}
                      {prices.length === 0 && <tr><td colSpan="4" className="p-4 text-gray-600">No data</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* chart + insight */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Price Trend (Recent)</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {insight && (
                <div className="mt-6 bg-green-50 p-4 rounded">
                  <h3 className="font-semibold text-green-800">AI Insight</h3>
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
