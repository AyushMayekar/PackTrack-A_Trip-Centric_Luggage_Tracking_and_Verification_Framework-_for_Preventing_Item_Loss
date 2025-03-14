// import axios from "axios";

// const API_URL = "http://127.0.0.1:8000/api/";

// export const login = async (credentials) => {
//   const response = await axios.post(`${API_URL}token/`, credentials);
//   return response.data;
// };


// export const fetchTrips = async (token) => {
//     return axios.get(`${API_URL}trips/`, { headers: { Authorization: `Bearer ${token}` } });
//   };

// Mock Data for testing
export const login = async (credentials) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock Login API called");
      resolve({ access: "mock-token" }); // Simulates a JWT token response
    }, 500);
  });
};

export const fetchTrips = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock Fetch Trips API called");
      resolve({
        data: [
          { id: 1, name: "Ladakh Adventure", date: "2024-07-10"  },
          { id: 2, name: "Goa Beach Trip", date: "2024-07-10" }
        ]
      });
    }, 500);
  });
};

export const fetchLuggageItems = async (tripId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Mock Fetch Luggage for Trip ${tripId} API called`);
      resolve({
        data: [
          { id: 1, name: "White T-shirt", tripId: tripId },
          { id: 2, name: "Blue Jeans", tripId: tripId }
        ]
      });
    }, 500);
  });
};

export const mockFetchUserData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock Fetch User Data API called");
      resolve({
        username: "John Doe",
        email: "john@example.com",
        trips: [
          { id: 1, name: "Ladakh Adventure" },
          { id: 2, name: "Goa Beach Trip" }
        ]
      });
    }, 500);
  });
};


