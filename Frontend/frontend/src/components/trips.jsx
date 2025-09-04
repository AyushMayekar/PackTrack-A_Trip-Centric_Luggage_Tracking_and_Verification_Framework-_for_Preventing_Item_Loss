import { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Button, TextField, Typography, Paper, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { fetchTrips, createTrip, deleteTripApi } from "../api";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState("");

  // Fetch existing trips on load
  useEffect(() => {
    fetchTrips()
      .then((response) => {
        console.log("✅ Fetched trips:", response);
        const tripsArray = response.data;

        if (Array.isArray(tripsArray)) {
          setTrips(tripsArray);
        } else {
          console.error("❌ Error: trips data is not an array!", tripsArray);
          setTrips([]);
        }
      })
      .catch((error) => {
        console.error("❌ Fetch error:", error);
        setTrips([]);
      });
  }, []);

  // Add a new trip
  const addTrip = async () => {
    if (!newTrip.trim()) return;

    try {
      const result = await createTrip(newTrip);
      console.log("✅ Trip created:", result);

      // Refresh trips after creating one
      const updatedTrips = await fetchTrips();
      setTrips(updatedTrips.data);

      setNewTrip("");
    } catch (error) {
      alert(error.error || "Failed to create trip");
    }
  };


  const deleteTrip = async (id, name) => {
    try {
      // Call backend API
      await deleteTripApi(name);

      // Update local state
      setTrips(trips.filter(trip => trip.id !== id));
      console.log("✅ Trip deleted:", name);
    } catch (error) {
      alert(error.error || "Failed to delete trip");
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: "400px", margin: "180px auto", bgcolor: "#c3ec9fff" }}>
      <Typography variant="h5" color="#31572C" gutterBottom>My Trips</Typography>

      {/* Add Trip Form */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          label="New Trip Name"
          value={newTrip}
          onChange={(e) => setNewTrip(e.target.value)}
          sx={{
            // Border colors
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#132A13", // default
              },
              "&:hover fieldset": {
                borderColor: "#132A13", // hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "#132A13", // focus
              },
            },
            // Label colors
            "& .MuiInputLabel-root": {
              color: "#31572C", // default label color
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#132A13", // focused label color
            },
            // Input text color
            "& .MuiInputBase-input": {
              color: "#132A13",
            },
          }}
        />
        <Button variant="contained" sx={{
          backgroundColor: "#31572C", color: "#c3ec9fff",
          "&:hover": {
            backgroundColor: "#132A13"
          }
        }} onClick={addTrip}>Add</Button>
      </Box>

      {/* Trips List */}
      {trips.length === 0 ? (
        <Typography variant="body1" color="#31572C">
          No Trips Available. Add Your First Trip!
        </Typography>
      ) : (
        <List>
          {trips.map((trip) => (
            <ListItem
              key={trip.id}
              sx={{
                color: "#31572C",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Link to={`/trip/${trip.id}/${encodeURIComponent(trip.name)}`} style={{ textDecoration: "none", color: "inherit" }}>
                <ListItemText primary={trip.name} secondary={trip.date ? `Date: ${trip.date}` : null} />
              </Link>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#31572C", color: "#c3ec9fff",
                  "&:hover": {
                    backgroundColor: "#132A13"
                  }
                }}
                onClick={() => deleteTrip(trip.id, trip.name)}
              >
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
