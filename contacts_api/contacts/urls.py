from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    register, logout, get_contacts, create_contact,
    get_contact, edit_contact, delete_contact
)

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('logout/', logout, name='logout'),
    path('contacts/', get_contacts, name='get_contacts'),
    path('contacts/create/', create_contact, name='create_contact'),
    path('contacts/<int:pk>/', get_contact, name='get_contact'),  # Get single contact
    path('contacts/<int:pk>/edit/', edit_contact, name='edit_contact'),  # Edit contact
    path('contacts/<int:pk>/delete/', delete_contact, name='delete_contact'),  # Delete contact
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
