import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  Checkbox,
} from "@mui/material";
import { fetchLuggage, addLuggageApi, deleteLuggageApi } from "../api";

export default function TripDetails({ trips }) {
  const { id } = useParams();
  const tripId = id;
  const [luggage, setLuggage] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [checkedItems, setCheckedItems] = useState({});

  if (!tripId) return <Typography variant="h5">Trip not found</Typography>;

  // Load luggage on mount
  useEffect(() => {
    fetchLuggage(tripId)
      .then((res) => setLuggage(res.data || []))
      .catch(() => setLuggage([]));
  }, [tripId]);

  // ✅ Load checkedItems state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`checkedItems_${tripId}`);
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
  }, [tripId]);

  // ✅ Save checkedItems state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`checkedItems_${tripId}`, JSON.stringify(checkedItems));
  }, [checkedItems, tripId]);

  // Add luggage
  const addLuggage = async () => {
    if (!newItem.trim()) return;
    try {
      await addLuggageApi(tripId, newItem.trim());
      const updated = await fetchLuggage(tripId);
      setLuggage(updated.data || []);
      setNewItem("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add luggage");
    }
  };

  // Delete luggage
  const deleteLuggage = async (luggageName) => {
    try {
      await deleteLuggageApi(tripId, luggageName);
      setLuggage(luggage.filter((item) => item !== luggageName));

      // also remove from checkedItems
      setCheckedItems((prev) => {
        const updated = { ...prev };
        delete updated[luggageName];
        return updated;
      });
    } catch (error) {
      alert(error.response?.data?.error || "Failed to delete luggage");
    }
  };

  // Toggle check luggage
  const toggleCheck = (luggageName) => {
    setCheckedItems((prev) => ({
      ...prev,
      [luggageName]: !prev[luggageName],
    }));
  };

  // Find trip name for heading
  const tripName = trips?.find((t) => trips._id === tripId)?.trip_name || "Trip";

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        maxWidth: "400px",
        margin: "180px auto",
        bgcolor: "#c3ec9fff",
      }}
    >
      <Typography variant="h5">{tripName}</Typography>

      {/* Add Luggage Form */}
      <Box display="flex" gap={2} my={2}>
        <TextField
          fullWidth
          label="Add Luggage Item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
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
        }} onClick={addLuggage}>
          Add
        </Button>
      </Box>

      {/* Luggage List */}
      {luggage.length === 0 ? (
        <Typography variant="body1" color="#31572C">
          No luggage items found. Add your first item!
        </Typography>
      ) : (
        <List>
          {luggage.map((luggageName) => (
            <ListItem
              key={luggageName}
              sx={{
                color: "#31572C",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box display="flex" alignItems="center" gap={0}>
                <Checkbox
                  checked={!!checkedItems[luggageName]}
                  onChange={() => toggleCheck(luggageName)}
                  sx={{
                    color: "#132A13", 
                    "&.Mui-checked": {
                      color: "#4F772D", 
                    },
                    "&:hover": {
                      backgroundColor: "rgba(79, 119, 45, 0.1)", 
                    },
                  }}
                />
                <ListItemText primary={luggageName} />
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#31572C", color: "#c3ec9fff",
                  "&:hover": {
                    backgroundColor: "#132A13"
                  }
                }}
                onClick={() => deleteLuggage(luggageName)}
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
