from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import BaseAuthentication
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView
from rest_framework.response import Response
import jwt
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("Secret_key")

# MongoDB Connection
MONGO_URI = os.getenv("Mongo")
client = MongoClient(MONGO_URI)
db = client["Trip_Luggage_Manager"]
users_collection = db["User_Auth"]
blacklisted_tokens_coll = db["Blacklisted_Tokens"]

# Custom JWT Authentication for MongoDB
class MongoDBJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return None  # No authentication provided

        token = auth_header.split(" ")[1]

        # Check if token is blacklisted
        if blacklisted_tokens_coll.find_one({"token": token}):
            return None  # Token is blacklisted

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            username = payload.get("username")

            if not username:
                return None

            user = users_collection.find_one({"username": username})
            if not user:
                return None

            return (UserObject(user), None)

        except jwt.ExpiredSignatureError:
            return None  # Token expired
        except jwt.InvalidTokenError:
            return None  # Invalid token

# User-like Object
class UserObject:
    def __init__(self, user_data):
        self.username = user_data["username"]
        self.is_authenticated = True

# Registering Users
class RegisterView(APIView):
    def post(self, request):
        data = request.data
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return Response({"error": "Username and Password required"}, status=400)

        # Check if user exists
        if users_collection.find_one({"username": username}):
            return Response({"error": "User already exists"}, status=400)

        # Store hashed password
        user_data = {
            "username": username,
            "password": make_password(password)
        }
        users_collection.insert_one(user_data)

        return Response({"message": "User registered successfully"}, status=201)

# Login Users
class LoginView(APIView):
    def post(self, request):
        data = request.data
        username = data.get("username")
        password = data.get("password")

        user = users_collection.find_one({"username": username})
        if not user or not check_password(password, user["password"]):
            return Response({"error": "Invalid Credentials"}, status=401)

        # Generate JWT tokens
        payload = {"username": username}
        access = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        refresh = jwt.encode({"username": username, "type": "refresh"}, SECRET_KEY, algorithm="HS256")

        response = Response({"message": "Login successful", "access_token": access}, status=200)

        # Store tokens in HttpOnly cookies
        response.set_cookie("access_token", access, httponly=True, secure=False, samesite="None")
        response.set_cookie("refresh_token", refresh, httponly=True, secure=False, samesite="None")

        return response
    
# Logout User
class LogoutView(APIView):
    authentication_classes = [MongoDBJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"error": "Refresh token missing", "refresh_token": refresh_token}, status=400)

        # Store blacklisted refresh token in MongoDB
        blacklisted_tokens_coll.insert_one({"token": refresh_token})

        # Clear cookies
        response = Response({"message": "Logged out successfully"}, status=200)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response

# Protected Route
class ProtectedView(APIView):
    authentication_classes = [MongoDBJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            username = request.user.username  

            user = users_collection.find_one({"username": username}) 
            if not user:
                return Response({"error": "User not found"}, status=404)

            return Response({"message": f"Welcome, {username}!"}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)
