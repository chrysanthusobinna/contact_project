from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth.models import User
from .models import Contact
from .serializers import ContactSerializer, RegisterSerializer, UserSerializer


# User Registration
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "You have registered successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# User Logout
@api_view(['POST'])
def logout(request):
    refresh_token = request.data.get("refresh")
    if not refresh_token:
        return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "You have been logged out successfully!"}, status=status.HTTP_205_RESET_CONTENT)
    except (TokenError, InvalidToken):
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        

# Show All Contacts
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_contacts(request):
    contacts = Contact.objects.filter(user=request.user)
    serializer = ContactSerializer(contacts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Create Contact
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_contact(request):
    serializer = ContactSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Get Single Contact
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_contact(request, pk):
    try:
        contact = Contact.objects.get(pk=pk, user=request.user)
        serializer = ContactSerializer(contact)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Contact.DoesNotExist:
        return Response({"error": "Contact not found"}, status=status.HTTP_404_NOT_FOUND)

# Update Contact
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_contact(request, pk):
    try:
        contact = Contact.objects.get(pk=pk, user=request.user)
    except Contact.DoesNotExist:
        return Response({"error": "Contact not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ContactSerializer(contact, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete Contact
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_contact(request, pk):
    try:
        contact = Contact.objects.get(pk=pk, user=request.user)
        contact.delete()
        return Response({"message": "Contact deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Contact.DoesNotExist:
        return Response({"error": "Contact not found"}, status=status.HTTP_404_NOT_FOUND)


# get authenticated user details
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
    })
