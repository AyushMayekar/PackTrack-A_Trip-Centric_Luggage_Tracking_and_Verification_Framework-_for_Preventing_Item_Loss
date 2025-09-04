import axios from "axios";

// Base URL for the Django backend
const API_URL = "https://packtrack-a-trip-centric-luggage.onrender.com/"

// 1️⃣ Register a new user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}register`, userData, {withCredentials: true,});
  return response.data;
};

// 2️⃣ Login user and get authentication token
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}login`, credentials, {withCredentials: true,});
  return response.data; 
};

// 3️⃣ Fetch user trips (Requires authentication)
export const fetchTrips = async () => {
  return axios.get(`${API_URL}create_trips`, {
    withCredentials: true, 
  });
};

// POST request to create a new trip
export const createTrip = async (tripName) => {
  try {
    const response = await axios.post(
      `${API_URL}create_trips`,
      { trip_name: tripName }, 
      { withCredentials: true }
    );
    return response.data; 
  } catch (error) {
    console.error("❌ Error creating trip:", error.response?.data || error.message);
    throw error.response?.data || { error: "Failed to create trip" };
  }
};

// ✅ Delete Trip
export const deleteTripApi = async (tripName) => {
  try {
    const response = await axios.delete(`${API_URL}/delete_trips`, {
      data: { trip_name: tripName },   
      withCredentials: true,           
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete trip" };
  }
};

// Fetch luggage
export const fetchLuggage = (tripId) => {
  return axios.get(`${API_URL}manage_luggage`, {
    params: { trip_id: tripId },
    withCredentials: true,
  });
};

// Add luggage
export const addLuggageApi = (tripId, luggageName) => {
  return axios.post(
    `${API_URL}manage_luggage`,
    { trip_id: tripId, luggage_name: luggageName },
    { withCredentials: true }
  );
};

// Delete luggage
export const deleteLuggageApi = (tripId, luggageName) => {
  return axios.delete(`${API_URL}delete_luggage`, {
    data: { trip_id: tripId, luggage_name: luggageName },
    withCredentials: true,
  });
};

// Logout User
export const logout = () => {
  return axios.post(`${API_URL}logout`, {}, { withCredentials: true });
};