import { useParams } from "react-router-dom";
import { useState } from "react";
import { List, ListItem, ListItemText, Button, TextField, Typography, Paper, Box } from "@mui/material";

export default function TripDetails({ trips }) {
  const { id } = useParams();
  const trip = trips.find(trip => trip.id === Number(id));

  const [luggage, setLuggage] = useState([]);
  const [newItem, setNewItem] = useState("");

  if (!trip) return <Typography variant="h5">Trip not found</Typography>;

  const addLuggage = () => {
    if (newItem.trim()) {
      setLuggage([...luggage, { id: Date.now(), name: newItem }]);
      setNewItem("");
    }
  };

  const deleteLuggage = (id) => {
    setLuggage(luggage.filter(item => item.id !== id));
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: "400px", margin: "20px auto", bgcolor: "#fff" }}>
      <Typography variant="h5">{trip.name}</Typography>
      <Typography variant="body2" color="textSecondary">Date: {trip.date}</Typography>

      {/* Add Luggage Form */}
      <Box display="flex" gap={2} my={2}>
        <TextField 
          fullWidth 
          label="Add Luggage Item" 
          value={newItem} 
          onChange={(e) => setNewItem(e.target.value)} 
        />
        <Button variant="contained" color="primary" onClick={addLuggage}>Add</Button>
      </Box>

      {/* Luggage List */}
      <List>
        {luggage.map((item) => (
          <ListItem key={item.id} sx={{ display: "flex", justifyContent: "space-between" }}>
            <ListItemText primary={item.name} />
            <Button variant="contained" color="secondary" onClick={() => deleteLuggage(item.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
