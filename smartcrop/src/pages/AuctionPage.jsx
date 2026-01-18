import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../api/api";

export default function AuctionPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    crop_name: "Rice",
    quantity: "",
    base_price: "",
    seller_name: "",
    seller_contact: "",
    district: "Mysore",
    market: "APMC",
  });

  const [bidInputs, setBidInputs] = useState({});

  const crops = ["Rice", "Wheat", "Maize", "Cotton", "Tomato", "Onion"];
  const districts = ["Mysore", "Bangalore", "Kolar", "Mandya"];
  const markets = ["APMC", "Local Market", "Private Yard"];

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/auctions");
      setAuctions(res.data.auctions || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load auctions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const createAuction = async () => {
    try {
      const res = await api.post("/api/upload-crop", form);
      if (res.data.success) {
        alert("Auction Created");
        setForm({ ...form, quantity: "", base_price: "" });
        fetchAuctions();
      } else {
        alert(res.data.error || "Create failed");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to create auction");
    }
  };

  const placeBid = async (id) => {
    try {
      const payload = bidInputs[id] || {};
      const res = await api.post(`/api/auctions/${id}/bid`, payload);
      if (res.data.success) {
        alert("Bid Placed");
        fetchAuctions();
      } else {
        alert(res.data.error || "Bid failed");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to place bid");
    }
  };

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">🔨 Live Crop Auction</h1>
          <p className="mt-3 text-green-100 max-w-2xl mx-auto">
            Sell your produce directly to buyers. Simple, fast and farmer-friendly.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="-mt-12 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-10">

          {/* SELLER FORM (glass card) */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">🌾 Sell Your Crop</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={form.crop_name}
                onChange={(e) => setForm({ ...form, crop_name: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-300"
              >
                {crops.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="Quantity (kg)"
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-300"
              />

              <input
                value={form.base_price}
                onChange={(e) => setForm({ ...form, base_price: e.target.value })}
                placeholder="Base Price ₹"
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-300"
              />

              <input
                value={form.seller_name}
                onChange={(e) => setForm({ ...form, seller_name: e.target.value })}
                placeholder="Farmer Name"
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-300"
              />

              <input
                value={form.seller_contact}
                onChange={(e) => setForm({ ...form, seller_contact: e.target.value })}
                placeholder="Mobile Number"
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-300"
              />

              <select
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-300"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <button
                onClick={createAuction}
                className="inline-block px-8 py-3 rounded-full bg-black text-white shadow"
              >
                Start Auction
              </button>
            </div>
          </div>

          {/* LIVE AUCTIONS LIST */}
          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-6">🔔 Live Auctions</h2>

            {loading ? (
              <p className="text-gray-600">Loading auctions...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {auctions.map((a) => (
                  <div
                    key={a.auction_id}
                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow p-6 flex flex-col justify-between min-h-[220px]"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-green-800">{a.crop_name}</h3>
                      <p className="text-sm text-gray-600">{a.market}, {a.district}</p>

                      <p className="mt-3 text-sm">
                        Quantity: <b>{a.quantity} kg</b>
                      </p>

                      <p className="mt-2 text-lg font-bold text-green-700">Highest Bid: ₹ {a.highest_bid}</p>
                      <p className="text-sm text-gray-500">Bids: {a.bid_count ?? 0}</p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <input
                        placeholder="Your Name"
                        className="w-full p-2 border rounded"
                        onChange={(e) =>
                          setBidInputs({
                            ...bidInputs,
                            [a.auction_id]: {
                              ...bidInputs[a.auction_id],
                              bidder_name: e.target.value,
                            },
                          })
                        }
                      />

                      <input
                        placeholder="Mobile Number"
                        className="w-full p-2 border rounded"
                        onChange={(e) =>
                          setBidInputs({
                            ...bidInputs,
                            [a.auction_id]: {
                              ...bidInputs[a.auction_id],
                              bidder_contact: e.target.value,
                            },
                          })
                        }
                      />

                      <div className="flex gap-3">
                        <input
                          type="number"
                          placeholder="Bid Amount ₹"
                          className="flex-1 p-2 border rounded"
                          onChange={(e) =>
                            setBidInputs({
                              ...bidInputs,
                              [a.auction_id]: {
                                ...bidInputs[a.auction_id],
                                bid_amount: e.target.value,
                              },
                            })
                          }
                        />
                        <button
                          onClick={() => placeBid(a.auction_id)}
                          className="px-4 py-2 rounded bg-green-600 text-white"
                        >
                          Place
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
