import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register"; // ✅ Import Register
import VendorDashboard from "./pages/VendorDashboard";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />{" "}
        {/* ✅ Add Register Route */}
        <Route path="/vendor" element={<VendorDashboard />} />
      </Routes>
    </Router>
  );
}
