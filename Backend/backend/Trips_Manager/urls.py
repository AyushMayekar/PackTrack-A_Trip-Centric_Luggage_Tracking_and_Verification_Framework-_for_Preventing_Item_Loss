from django.urls import path
from .views import TripListCreateView, TripDetailView, LuggageListCreateView, LuggageDetailView 

urlpatterns = [
    path("create_trips", TripListCreateView.as_view(), name="trip-list-create"),
    path("delete_trips", TripDetailView.as_view(), name="delete-trip"),
    path("manage_luggage", LuggageListCreateView.as_view(), name="add-and-get-luggage"),
    path("delete_luggage", LuggageDetailView.as_view(), name="delete-luggage"),
]
