import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import StepIndicator from "../components/Crop/StepIndicator";
import ResultCard from "../components/Crop/ResultCard";
import api from "../api/api";

export default function CropRecommender() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    Soil_PH: 6.5,
    Soil_N: 50,
    Soil_P: 50,
    Soil_K: 50,
    Avg_Temp: "",
    Avg_Humidity: "",
    Rain_CM: "",
    Canal_Months: "",
    Borewell_Inches: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const getLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const res = await api.get(
        `/api/weather-average?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
      );
      setForm((p) => ({
        ...p,
        Avg_Temp: res.data.temperature,
        Avg_Humidity: res.data.humidity,
      }));
    });
  };

  const calculateWaterAvg = () => {
    const rain = Number(form.Rain_CM || 0);
    const canal = Number(form.Canal_Months || 0);
    const bore = Number(form.Borewell_Inches || 0);
    return (rain * 0.5 + canal * 10 + bore * 2).toFixed(2);
  };

  const submitForm = async () => {
    setLoading(true);
    const res = await api.post("/predict", {
      Soil_PH: +form.Soil_PH,
      Soil_N: +form.Soil_N,
      Soil_P: +form.Soil_P,
      Soil_K: +form.Soil_K,
      Avg_Temp: +form.Avg_Temp,
      Avg_Humidity: +form.Avg_Humidity,
      Rain_CM: +calculateWaterAvg(),
    });
    setResult(res.data);
    setLoading(false);
  };

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section
        className="relative min-h-[70vh] flex items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6')",
        }}
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 animate-fadeSlideUp">
            Smart Crop Recommendation
          </h1>
          <p className="mt-5 text-lg text-gray-700 animate-fadeSlideUp animate-delay-1">
            AI analyzes your soil, climate and water availability to suggest the
            most profitable crops.
          </p>
        </div>
      </section>

      {/* MAIN CARD */}
      <section className="relative -mt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 animate-fadeSlideUp animate-delay-2">

            <StepIndicator step={step} />

            {/* STEP CONTENT */}
            <div className="mt-10">

              {step === 1 && (
                <>
                  <StepHeader
                    title="Soil & Nutrients"
                    desc="Adjust nutrient levels based on your soil condition"
                  />

                  <Input label="Soil pH" name="Soil_PH" value={form.Soil_PH} onChange={handleChange} />
                  <Slider label="Nitrogen (N)" name="Soil_N" value={form.Soil_N} onChange={handleChange} />
                  <Slider label="Phosphorus (P)" name="Soil_P" value={form.Soil_P} onChange={handleChange} />
                  <Slider label="Potassium (K)" name="Soil_K" value={form.Soil_K} onChange={handleChange} />

                  <PrimaryButton onClick={() => setStep(2)} text="Continue →" />
                </>
              )}

              {step === 2 && (
                <>
                  <StepHeader
                    title="Local Weather"
                    desc="We automatically detect climate from your location"
                  />

                  <PrimaryButton onClick={getLocationWeather} text="📍 Detect Weather" />
                  <Input label="Temperature (°C)" value={form.Avg_Temp} disabled />
                  <Input label="Humidity (%)" value={form.Avg_Humidity} disabled />

                  <NavButtons back={() => setStep(1)} next={() => setStep(3)} />
                </>
              )}

              {step === 3 && (
                <>
                  <StepHeader
                    title="Water Availability"
                    desc="Combine all available water sources"
                  />

                  <Input label="Rainfall (cm)" name="Rain_CM" onChange={handleChange} />
                  <Input label="Canal Water (months)" name="Canal_Months" onChange={handleChange} />
                  <Input label="Borewell Water (inches)" name="Borewell_Inches" onChange={handleChange} />

                  <div className="mt-4 p-4 rounded-xl bg-green-50 font-medium">
                    Estimated Water Index: {calculateWaterAvg()}
                  </div>

                  <PrimaryButton
                    onClick={submitForm}
                    text={loading ? "Analyzing..." : "Get Recommendation"}
                  />

                  <ResultCard result={result} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ---------- UI COMPONENTS ---------- */

const StepHeader = ({ title, desc }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
    <p className="text-gray-600 mt-2">{desc}</p>
  </div>
);

const PrimaryButton = ({ onClick, text }) => (
  <button
    onClick={onClick}
    className="mt-8 w-full py-3 rounded-full bg-black text-white hover:bg-green-700 transition"
  >
    {text}
  </button>
);

const NavButtons = ({ back, next }) => (
  <div className="flex justify-between mt-8">
    <button onClick={back} className="px-6 py-2 rounded-full bg-gray-200">
      ← Back
    </button>
    <button onClick={next} className="px-6 py-2 rounded-full bg-green-600 text-white">
      Next →
    </button>
  </div>
);

function Input({ label, name, value, onChange, disabled }) {
  return (
    <div className="mt-5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="mt-2 w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-green-400 disabled:bg-gray-100"
      />
    </div>
  );
}

function Slider({ label, name, value, onChange }) {
  return (
    <div className="mt-5">
      <label className="text-sm font-medium">{label}: <b>{value}</b></label>
      <input
        type="range"
        min="0"
        max="100"
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full accent-green-600"
      />
    </div>
  );
}
