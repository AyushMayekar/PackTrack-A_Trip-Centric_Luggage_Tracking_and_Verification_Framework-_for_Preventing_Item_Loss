import { BrowserRouter as Router, Route, Routes, useLocation  } from "react-router-dom";
import { useState, useEffect } from "react"; 
import Login from "./components/login";
import Trips from "./components/trips";
import Register from "./components/register";
import Navbar from "./components/navbar";
import TripDetails from "./components/TripDetails";

function AppContent () {
  const [trips, setTrips] = useState([]);
  const location = useLocation();


  const showNavbar = location.pathname.startsWith("/trips") || location.pathname.startsWith("/trip");

  return (
    <div style={{ minHeight: "100vh",
    backgroundColor: "#31572C", // base color
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23ECF39E' fill-opacity='0.1'%3E%3Ccircle cx='2' cy='2' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundRepeat: "repeat", backgroundSize: "30px 40px", }}> {/* universal background */}
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/trips" element={<Trips/>} />
        <Route path="/trip/:id" element={<TripDetails trips={trips} />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
