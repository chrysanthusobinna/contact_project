from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from contacts.models import Contact
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class CreateContactViewTest(APITestCase):

    def setUp(self):
        # Create and authenticate a test user
        self.user = User.objects.create_user(
            username='testuser', password='pass123'
        )
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + str(self.get_tokens_for_user(self.user)['access'])
        )

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def test_create_contact_valid_data(self):
        """Test creating a contact with valid data."""
        url = reverse('create_contact')
        data = {
            'name': 'Vitalis Chiagwah',
            'address': '123 Main St',
            'phone_number': '+1234567890'
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], data['name'])
        self.assertEqual(response.data['address'], data['address'])
        self.assertEqual(response.data['phone_number'], data['phone_number'])
        self.assertEqual(Contact.objects.count(), 1)

    def test_create_contact_invalid_data(self):
        """Test creating a contact with invalid data (empty name)."""
        url = reverse('create_contact')
        data = {
            'name': '',
            'address': '123 Main St',
            'phone_number': '+1234567890'
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)
        self.assertEqual(Contact.objects.count(), 0)

    def test_create_contact_unauthenticated_user(self):
        """Test that unauthenticated users cannot create contacts."""
        self.client.credentials()  # Remove authentication
        url = reverse('create_contact')
        data = {
            'name': 'Obinna Chiagwah',
            'address': '23 Bolton , UK',
            'phone_number': '+0987654321'
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Contact.objects.count(), 0)
