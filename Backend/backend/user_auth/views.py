from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import BaseAuthentication
from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework import status
import jwt
import datetime
import logging
from pymongo.errors import PyMongoError
from bson import ObjectId
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("JWT_SECRET_KEY")

# Setup logging
logger = logging.getLogger(__name__)

# MongoDB Connection
MONGO_URI = os.getenv("Mongo")
client = MongoClient(MONGO_URI)
db = client["Trip_Luggage_Manager"]
users_collection = db["User_Auth"]
blacklisted_tokens_coll = db["Blacklisted_Tokens"]

# Serializer for registration
class RegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(min_length=4)
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

class UserObject:
    def __init__(self, user_data):
        self.username = user_data["username"]

    @property
    def is_authenticated(self):
        return True

    def get_username(self):
        return self.username

# Response Status Modification
class Unauthorized401(AuthenticationFailed):
    status_code = status.HTTP_401_UNAUTHORIZED

# Authentication Class
class MongoDBJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        logger.debug("Authenticating using JWT...")
        token = request.COOKIES.get('access_token')
        if not token:
            logger.debug("No access_token cookie found.")
            raise Unauthorized401("Access token is missing.")
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            logger.debug(f"Decoded payload: {payload}")
            if payload.get("type") != "access":
                logger.debug("Token type is not access.")
                raise Unauthorized401("Token type is not access.")

            username = payload.get("username")
            if not username:
                logger.debug("No username in payload.")
                raise Unauthorized401("Username not found in token.")

            user = users_collection.find_one({"username": username})
            if not user:
                logger.debug("User not found in database.")
                raise Unauthorized401("User not found in database.")

            return (UserObject(user), None)

        except jwt.ExpiredSignatureError:
            logger.debug("Token expired.")
            raise Unauthorized401("Access token is expired.")
        except jwt.InvalidTokenError:
            logger.debug("Invalid token.")
            raise Unauthorized401("Access token is invalid.")
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            raise Unauthorized401("Authentication failed.")

    # Registration Functionality
class RegisterView(APIView):
    def post(self, request):
        logger.debug("RegisterView: Processing registration.")
        serializer = RegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            logger.debug(f"Invalid registration data: {serializer.errors}")
            return Response({"error": serializer.errors}, status=400)

        username = serializer.validated_data["username"].strip().lower()
        password = serializer.validated_data["password"].strip().lower()
        confirm_password = serializer.validated_data["confirm_password"].strip().lower()
        if password != confirm_password:
            logger.debug("Passwords do not match.")
            return Response({"error": "Passwords do not match"}, status=400)
        # Check if user exists
        if users_collection.find_one({"username": username}):
            logger.debug(f"User already exists, try using different username or email or both: {username}")
            return Response({"error": "User already exists"}, status=400)
        # Store user
        try:
            users_collection.insert_one({
                "username": username,
                "password": make_password(password),
            })
            logger.info(f"User registered: {username}")
            return Response({"success": True, "message": "User registered successfully"}, status=201)
        except PyMongoError as e:
            logger.error(f"MongoDB error during registration: {e}")
            return Response({"error": "Database error"}, status=500)



# Login Functionality
class LoginView(APIView):
    def post(self, request):
        logger.debug("LoginView: Processing login.")
        user_input = request.data.get("username").strip().lower()
        password = request.data.get("password").strip().lower()
        
        if not user_input or not password:
            logger.debug("Missing username or password.")
            return Response({"error": "Username and password are required"}, status=400)
        try:
            user = users_collection.find_one({"username": user_input})

            if not user:
                logger.debug(f"No user found with username: {user_input}")
                return Response({"error": "Invalid Username or Password"}, status=401)

            if not check_password(password, user["password"]):
                logger.debug("Incorrect password.")
                return Response({"error": "Invalid Password"}, status=401)

            username = user["username"]
            now = datetime.datetime.utcnow()
            access_payload = {
                "username": username,
                "exp": now + datetime.timedelta(minutes=15),
                "type": "access"
            }
            refresh_payload = {
                "username": username,
                "exp": now + datetime.timedelta(days=7),
                "type": "refresh"
            }
            access_token = jwt.encode(access_payload, SECRET_KEY, algorithm="HS256")
            refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm="HS256")

            response = Response({"message": "Login successful", "success": True}, status=200)
            response.set_cookie(
                "access_token",
                access_token,
                httponly=True,
                secure=True,  # True for production (use HTTPS)
                samesite="None",
                max_age=15 * 60
            )
            response.set_cookie(
                "refresh_token",
                refresh_token,
                httponly=True,
                secure=True,  # True for production (use HTTPS)
                samesite="None",
                max_age=7 * 24 * 60 * 60
            )

            logger.info(f"User logged in: {username}")
            return response

        except PyMongoError as e:
            logger.error(f"MongoDB error during login: {e}")
            return Response({"error": "Database error"}, status=500)
        except Exception as e:
            logger.error(f"Login error: {e}")
            return Response({"error": "Login failed"}, status=500)

# Logout User
class LogoutView(APIView):
    authentication_classes = [MongoDBJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logger.debug("LogoutView: Processing logout.")
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            logger.debug("No refresh token found.")
            return Response({"error": "Refresh token missing"}, status=400)

        # Blacklist refresh token if it exists and is valid
        try:
            decoded = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
            blacklisted_tokens_coll.insert_one({
                "token": refresh_token,
                "exp": datetime.datetime.fromtimestamp(decoded["exp"]),
                "user_id": ObjectId(request.user.id)
            })
        except jwt.ExpiredSignatureError:
            logger.debug("Refresh token already expired.")
        except jwt.InvalidTokenError:
            logger.debug("Invalid refresh token.")
        except Exception as e:
            logger.error(f"Error blacklisting token: {e}")
            # Continue even if blacklisting fails

        # Clear cookies
        response = Response({"message": "Logged out successfully"}, status=200)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        logger.info(f"User logged out: {request.user.username}")
        return response

# Protected Route
class ProtectedView(APIView):
    authentication_classes = [MongoDBJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logger.debug("ProtectedView: Processing protected request.")
        try:
            username = request.user.username
            user = users_collection.find_one({"username": username})
            if not user:
                logger.debug("User not found in database.")
                return Response({"error": "User not found"}, status=404)
            logger.info(f"Protected route accessed by: {username}")
            return Response({"message": f"Welcome, {username}!"}, status=200)
        except Exception as e:
            logger.error(f"Protected view error: {e}")
            return Response({"error": str(e)}, status=500)

# Refresh Token Functionality
class RefreshTokenView(APIView):
    def post(self, request):
        logger.debug("RefreshTokenView: Processing refresh.")
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            logger.debug("No refresh token found.")
            return Response({"error": "Refresh token missing"}, status=400)

        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=["HS256"])
            if payload.get("type") != "refresh":
                logger.debug("Invalid token type.")
                return Response({"error": "Invalid token type"}, status=401)

            # Check if token is blacklisted
            if blacklisted_tokens_coll.find_one({"token": refresh_token}):
                logger.debug("Refresh token is blacklisted.")
                return Response({"error": "Refresh token blacklisted"}, status=401)

            # Generate new access token
            new_access = jwt.encode({
                "username": payload["username"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
                "type": "access"
            }, SECRET_KEY, algorithm="HS256")

            response = Response({"message": "Token refreshed"}, status=200)
            response.set_cookie(
                "access_token",
                new_access,
                httponly=True,
                secure=True,
                samesite="None",
                max_age=15*60
            )
            logger.info(f"Token refreshed for user: {payload['username']}")
            return response

        except jwt.ExpiredSignatureError:
            logger.debug("Refresh token expired.")
            return Response({"error": "Refresh token expired"}, status=401)
        except jwt.InvalidTokenError:
            logger.debug("Invalid refresh token.")
            return Response({"error": "Invalid refresh token"}, status=401)
        except Exception as e:
            logger.error(f"Refresh token error: {e}")
            return Response({"error": "Refresh failed"}, status=500)

# Check Authentication Initialy
class CheckAuthView(APIView):
    authentication_classes = [MongoDBJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": f"Authenticated as {request.user.get_username()}"}, status=200)