import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import DiseaseResultCard from "../components/DiseaseResultCard";
import api from "../api/api";

export default function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const submitImage = async () => {
    if (!image) return alert("Please upload a leaf image");

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await api.post("/predict-disease", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch {
      alert("Disease detection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section
        className="relative min-h-[65vh] flex items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1582515073490-dc84d42f1d3f')",
        }}
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 animate-fadeSlideUp">
            Crop Disease Detection
          </h1>
          <p className="mt-4 text-lg text-gray-700 animate-fadeSlideUp animate-delay-1">
            Upload a crop leaf image and let AI identify diseases early to protect
            your yield.
          </p>
        </div>
      </section>

      {/* MAIN CARD */}
      <section className="relative -mt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 animate-fadeSlideUp animate-delay-2">

            {/* Upload Area */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Upload Leaf Image
              </h2>
              <p className="text-gray-600 mb-6">
                Make sure the leaf is clearly visible and well lit
              </p>

              <label
                htmlFor="upload"
                className="block border-2 border-dashed border-green-300 rounded-2xl p-10 cursor-pointer hover:bg-green-50 transition"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="upload"
                  className="hidden"
                />

                {!preview ? (
                  <div className="text-green-700 font-medium">
                    📷 Click to upload leaf image
                  </div>
                ) : (
                  <img
                    src={preview}
                    alt="Leaf preview"
                    className="mx-auto h-60 rounded-xl shadow-lg"
                  />
                )}
              </label>

              {/* Button */}
              <button
                onClick={submitImage}
                className="mt-8 w-full py-3 rounded-full bg-black text-white hover:bg-green-700 transition"
              >
                {loading ? "Analyzing Image..." : "Detect Disease"}
              </button>
            </div>

            {/* Result */}
            <DiseaseResultCard result={result} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
