from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import (
    register, logout, get_user_details, get_contacts, create_contact,
    get_contact, edit_contact, delete_contact
)

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('logout/', logout, name='logout'),
    path('user-details/', get_user_details, name='get_user_details'),
    path('contacts/', get_contacts, name='get_contacts'),
    path('contacts/create/', create_contact, name='create_contact'),
    path('contacts/<int:pk>/', get_contact, name='get_contact'),
    path('contacts/<int:pk>/edit/', edit_contact, name='edit_contact'),  
    path('contacts/<int:pk>/delete/', delete_contact, name='delete_contact'), 
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

]
