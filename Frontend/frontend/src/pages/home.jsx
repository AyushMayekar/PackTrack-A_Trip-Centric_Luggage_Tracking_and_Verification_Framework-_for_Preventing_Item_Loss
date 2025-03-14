import { useEffect, useState } from "react";
import { mockFetchUserData } from "../api"; // Use mock API
import { Container, Typography, Paper } from "@mui/material";
import Trips from "../components/trips";

export default function Home() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function getUserData() {
      const response = await mockFetchUserData(); // Fetch mock user data
      setUserData(response);
    }
    getUserData();
  }, []);

  if (!userData) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm">
        <Paper elevation={3} style={{ padding: "24px", borderRadius: "12px" }}>
        <Typography variant="h5">Welcome, {userData.username}!</Typography>
        <Typography variant="body1">Email: {userData.email}</Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Your Trips:</Typography>
        <Trips trips={userData.trips} /> {/* Show trips */}
      </Paper>
    </Container>
  );
}
