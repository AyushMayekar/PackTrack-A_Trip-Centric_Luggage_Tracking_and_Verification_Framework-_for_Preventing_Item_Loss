import { useState, useEffect } from "react";
import {  List, ListItem, ListItemText, Button, TextField, Typography, Paper, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { fetchTrips } from "../api";

export default function Trips({  trips = [], setTrips }) {
  const [newTrip, setNewTrip] = useState("");

 // Fetch existing trips on load
 useEffect(() => {
  console.log("📡 Fetching trips from backend...");
  
  fetchTrips()
    .then((response) => {
      console.log("✅ Fetched trips:", response);

      if (Array.isArray(response.data)) {
        setTrips(response.data); // ✅ Corrected: Extracting the array from response
      } else {
        console.error("❌ Error: trips data is not an array!", response);
        setTrips([]); // Prevent crash
      }
    })
    .catch((error) => {
      console.error("❌ Fetch error:", error);
      setTrips([]); // Handle failure gracefully
    });
}, []);

  const addTrip = () => {
    if (newTrip.trim()) {
      setTrips([...trips, { id: Date.now(), name: newTrip, date: new Date().toISOString().split("T")[0] }]);
      setNewTrip("");
    }
  };

  const deleteTrip = (id) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: "400px", margin: "20px auto", bgcolor: "#fff" }}>
      <Typography variant="h5" gutterBottom>My Trips</Typography>

      {/* Add Trip Form */}
      <Box display="flex" gap={2} mb={2}>
        <TextField 
          fullWidth 
          label="New Trip Name" 
          value={newTrip} 
          onChange={(e) => setNewTrip(e.target.value)} 
        />
        <Button variant="contained" color="primary" onClick={addTrip}>Add</Button>
      </Box>

      {/* Trips List */}
      <List>
        {trips.map((trip) => (
          <ListItem 
            key={trip.id} 
            sx={{ borderBottom: "1px solid #ddd", bgcolor: "#fafafa", display: "flex", justifyContent: "space-between" }}
          >
            <Link to={`/trip/${trip.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <ListItemText primary={trip.name} secondary={`Date: ${trip.date}`} />
            </Link>
            <Button variant="contained" color="secondary" onClick={() => deleteTrip(trip.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
