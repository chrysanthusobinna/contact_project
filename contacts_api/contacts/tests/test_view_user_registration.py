from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status

class UserRegistrationViewTest(APITestCase):

    def test_user_registration_successful(self):
        """Test successful user registration with valid data."""
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'testuser@santhus.com',
            'password': 'strongpassword123'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], "You have registered successfully!")
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_user_registration_with_existing_username(self):
        """Test user registration fails if username already exists."""
        User.objects.create_user(username='testuser', password='pass123')
        
        url = reverse('register')
        data = {
            'username': 'testuser',  # existing username
            'email': 'another@santhus.com',
            'password': 'anotherpass'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_user_registration_with_invalid_data(self):
        """Test user registration fails with invalid data."""
        url = reverse('register')
        data = {
            'username': '',  # empty username
            'email': 'invalidemail',  # invalid email format
            'password': ''
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertIn('email', response.data)
        self.assertIn('password', response.data)
