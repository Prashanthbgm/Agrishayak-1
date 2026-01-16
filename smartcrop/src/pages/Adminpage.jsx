import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function Admin() {
  return (
    <>
      <Navbar />
      <div className="p-10 text-xl text-green-700">
        Admin Page
      </div>
      <Footer />
    </>
  );
}
