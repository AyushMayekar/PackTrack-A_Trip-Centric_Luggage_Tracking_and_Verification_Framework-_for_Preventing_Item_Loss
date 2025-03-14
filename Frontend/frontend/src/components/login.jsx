import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";
import { login } from "../api"; 

export default function Login({ setToken }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate(); // ✅ This allows navigation after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(credentials);
    
    if (data.access) {
      localStorage.setItem("token", data.access);
      setToken(data.access);
      navigate("/"); // ✅ Redirects to the home page
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: "flex", justifyContent: "center", minHeight: "100vh", alignItems: "center" }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, textAlign: "center", bgcolor: "#ffffff" }}>
        <Typography variant="h4" color="primary" gutterBottom>Welcome !!</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>Login to manage your trips</Typography>

        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Username" variant="outlined"
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <TextField fullWidth margin="normal" type="password" label="Password" variant="outlined"
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
