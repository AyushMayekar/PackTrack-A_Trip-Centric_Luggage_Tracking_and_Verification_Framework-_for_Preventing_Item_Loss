import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Trips from "./components/trips";
import { useState, useEffect } from "react"; 
import Navbar from "./components/navbar";
import TripDetails from "./components/TripDetails";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [trips, setTrips] = useState([]);


  return (
    <Router>
    {token && <Navbar setToken={setToken} />} 
      <Routes>
        <Route path="/" element={token ? <Trips trips={trips} setTrips={setTrips} /> : <Login setToken={setToken} />} />
        <Route path="/trip/:id" element={<TripDetails trips={trips} />} />
      </Routes>
    </Router>
  );
}
