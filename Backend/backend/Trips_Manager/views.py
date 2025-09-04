from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson import ObjectId
from user_auth.views import MongoDBJWTAuthentication

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("Mongo")

# MongoDB Connection
client = MongoClient(MONGO_URI)
db = client["Trip_Luggage_Manager"]
trips_collection = db["Trips"]
users_collection = db["User_Auth"]

# 🚀 Create & List Trips
class TripListCreateView(APIView):
    authentication_classes = [MongoDBJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """ List all trips for the authenticated user """
        trips = list(trips_collection.find({"owner": request.user.username}, {"_id": 1, "trip_name": 1}))
        trip_list = [
        {
            "id": str(trip["_id"]),
            "name": trip["trip_name"]
        }
        for trip in trips
    ]

        return Response(trip_list, status=200)

    def post(self, request):
        """ Create a new trip with a unique name """
        trip_name = request.data.get("trip_name")
        
        if not trip_name:
            return Response({"error": "Trip name is required"}, status=400)
        
        existing_trip = trips_collection.find_one({"owner": request.user.username, "trip_name": trip_name})
        if existing_trip:
            return Response({"error": "Trip name must be unique"}, status=400)
        
        trip_data = {
            "trip_name": trip_name,
            "owner": request.user.username,
            "luggage": []
        }
        trips_collection.insert_one(trip_data)
        return Response({"message": "Trip created successfully"}, status=201)

# Delete a Trip
class TripDetailView(APIView):
    authentication_classes = [MongoDBJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        """ Delete trip """
        trip_name = request.data.get("trip_name")
        result = trips_collection.delete_one({"owner": request.user.username, "trip_name": trip_name})
        if result.deleted_count == 0:
            return Response({"error": "Trip not found"}, status=404)
        return Response({"message": "Trip deleted successfully"}, status=200)

# 🎒 Luggage Management
class LuggageListCreateView(APIView):
    authentication_classes = [MongoDBJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """ List all luggage items for a trip """
        trip_id = request.query_params.get("trip_id")
        trip = trips_collection.find_one({"owner": request.user.username, "_id": ObjectId(trip_id)})
        if not trip:
            return Response({"error": "Trip not found"}, status=404)
        luggage_names = [item["luggage_name"] for item in trip.get("luggage", [])]
        return Response(luggage_names, status=200)

    def post(self, request):
        """ Add luggage to a trip (unique luggage name required) """
        luggage_name = request.data.get("luggage_name")
        trip_id = request.data.get("trip_id")
        if not luggage_name:
            return Response({"error": "Luggage name is required"}, status=400)
        
        trip = trips_collection.find_one({"owner": request.user.username, "_id": ObjectId(trip_id)})
        if not trip:
            return Response({"error": "Trip not found"}, status=404)
        
        existing_luggage = next((item for item in trip["luggage"] if item["luggage_name"] == luggage_name), None)
        if existing_luggage:
            return Response({"error": "Luggage name must be unique"}, status=400)
        
        trips_collection.update_one({"owner": request.user.username, "_id": ObjectId(trip_id)}, {"$push": {"luggage": {"luggage_name": luggage_name}}})
        return Response({"message": "Luggage added successfully"}, status=201)

# 🎒 Luggage Item Detail
class LuggageDetailView(APIView):
    authentication_classes = [MongoDBJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        """ Delete a specific luggage item """
        luggage_name = request.data.get("luggage_name")
        trip_id = request.data.get("trip_id")
        result = trips_collection.update_one(
            {"owner": request.user.username, "_id": ObjectId(trip_id)},
            {"$pull": {"luggage": {"luggage_name": luggage_name}}}
        )
        if result.matched_count == 0:
            return Response({"error": "Luggage not found"}, status=404)
        return Response({"message": "Luggage deleted successfully"}, status=200)
