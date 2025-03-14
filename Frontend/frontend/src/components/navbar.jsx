import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#333" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Navigation Buttons */}
        <Button color="inherit" onClick={() => navigate(-1)}>⬅️ Back</Button>
        <Button color="inherit" onClick={() => navigate("/")}>🏠 Home</Button>

        {/* Logout Button */}
        <Typography variant="h6">The Trip Luggage Manager App 🚀🔥</Typography>
        <Button color="error" variant="contained" onClick={handleLogout}>🔴 Logout</Button>
      </Toolbar>
    </AppBar>
  );
}
