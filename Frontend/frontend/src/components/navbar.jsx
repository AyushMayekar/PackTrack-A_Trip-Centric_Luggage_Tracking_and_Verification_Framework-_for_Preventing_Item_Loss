import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../api";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#c3ec9fff" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Button sx={{ color: "#132A13", fontWeight: 600 }} onClick={() => navigate(-1)}>Back</Button>
          <Button sx={{ color: "#132A13", fontWeight: 600 }} onClick={() => navigate("/trips")}>Home</Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src="https://res.cloudinary.com/dpuqctqfl/image/upload/v1756964347/Remove_background_project_jd0gjt.png"
            alt="PackTrack Logo"
            style={{ height: "40px", width: "40px" }}
          />
          <Typography
            variant="h6"
            sx={{ color: "#132A13", fontWeight: 600 }}
          >
            PACKTRACK
          </Typography>
        </Box>      
         {/* Logout Button */}
        <Box>
          <Button sx={{
            backgroundColor: "#132A13", color: "#ECF39E",
            "&:hover": {
              backgroundColor: "#31572C"
            }
          }} variant="contained" onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
