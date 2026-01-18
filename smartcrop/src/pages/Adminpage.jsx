import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../api/api";

export default function AdminPage() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      const res = await api.get("/api/admin/connections");
      setConnections(res.data.connections || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const acceptBid = async (auctionId) => {
    try {
      const res = await api.post(`/api/auctions/${auctionId}/accept`);
      if (res.data.success) {
        alert("Bid accepted");
        fetchConnections();
      } else {
        alert(res.data.error || "Accept failed");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to accept");
    }
  };

  return (
    <>
      <Navbar />

      <section className="bg-gradient-to-r from-green-700 to-green-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 text-center">
          <h1 className="text-4xl font-extrabold">🛠 Admin Dashboard</h1>
          <p className="mt-3 text-green-100 max-w-2xl mx-auto">Connect sellers and buyers, finalize deals.</p>
        </div>
      </section>

      <section className="-mt-12 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : connections.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 text-center">No completed auctions yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {connections.map((c) => (
                <div key={c.auction_id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-green-800">{c.crop_name}</h3>
                      <p className="text-sm text-gray-600">Auction: {c.auction_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-700">₹ {c.highest_bid}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div className="p-3 border rounded">
                      <h4 className="font-medium">👨‍🌾 Seller</h4>
                      <p className="text-sm">{c.seller_name}</p>
                      <p className="text-sm">{c.seller_contact || "N/A"}</p>
                      {c.seller_whatsapp && (
                        <a href={c.seller_whatsapp} target="_blank" rel="noreferrer" className="text-green-600 underline">WhatsApp Seller</a>
                      )}
                    </div>

                    <div className="p-3 border rounded">
                      <h4 className="font-medium">🧑‍💼 Highest Bidder</h4>
                      <p className="text-sm">{c.highest_bidder}</p>
                      <p className="text-sm">{c.bidder_contact || "N/A"}</p>
                      {c.bidder_whatsapp && (
                        <a href={c.bidder_whatsapp} target="_blank" rel="noreferrer" className="text-green-600 underline">WhatsApp Bidder</a>
                      )}
                    </div>

                    <button onClick={() => acceptBid(c.auction_id)} className="mt-2 py-3 rounded-full bg-black text-white">Accept Highest Bid</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
