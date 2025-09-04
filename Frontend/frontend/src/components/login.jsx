import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";
import { login } from "../api"; 

export default function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(credentials);
    
    if (data.success) {
      alert("Login Successfull!!")
      navigate("/trips"); 
    } else {
      alert("login Failed!!")
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: "flex", justifyContent: "center", minHeight: "100vh", alignItems: "center" }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, textAlign: "center", bgcolor: "#c3ec9fff" }}>
        <Typography variant="h4" color="#31572C" gutterBottom >LOGIN</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>Login to Manage Your Trips!!</Typography>

        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Username" variant="outlined"
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
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
                color: "#132A13", // default label color
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
          <TextField fullWidth margin="normal" type="password" label="Password" variant="outlined"
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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
                color: "#132A13", // default label color
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
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2, backgroundColor: "#31572C", color: "#c3ec9fff",
            "&:hover": {
              backgroundColor: "#132A13"
            }}}>
            Login
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2, color: "#132A13" }}>
          Don't have an account? <Link to="/" style={{ color: "#132A13", fontWeight: 600, textDecoration: "none" }}>Register</Link>
        </Typography>
      </Paper>
    </Container>
  );
}
