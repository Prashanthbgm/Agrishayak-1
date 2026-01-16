import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CropRecommender from "./pages/CropRecommender.jsx";
import DiseaseDetection from "./pages/DiseasePage.jsx";
import MandiMarket from "./pages/MandiPage.jsx";
import Auction from "./pages/AuctionPage.jsx";
import Admin from "./pages/Adminpage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/crop" element={<CropRecommender />} />
        <Route path="/disease" element={<DiseaseDetection />} />
        <Route path="/mandi" element={<MandiMarket />} />
        <Route path="/auction" element={<Auction />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
