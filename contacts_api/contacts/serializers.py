from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Contact
import re

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ContactSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True, allow_blank=True)
    address = serializers.CharField(required=True, allow_blank=True)
    phone_number = serializers.CharField(required=True, allow_blank=True)

    class Meta:
        model = Contact
        fields = ['id', 'user', 'name', 'address', 'phone_number']
        read_only_fields = ['user', 'id']  # User set automatically

    # Validate name
    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")
        if len(value) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters.")
        if not re.match(r'^[A-Za-z\s]+$', value):
            raise serializers.ValidationError("Enter a valid name (letters and spaces only).")
        return value

    # Validate address
    def validate_address(self, value):
        if not value.strip():
            raise serializers.ValidationError("Cannot be empty.")
        return value

    # Validate phone number
    def validate_phone_number(self, value):
        if not re.match(r'^\+?[\d\s-]{7,15}$', value):
            raise serializers.ValidationError("Enter a valid phone number.")
        return value
