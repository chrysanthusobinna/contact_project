from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class GetUserDetailsViewTest(APITestCase):

    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser', email='testuser@example.com', password='pass123'
        )

        # Authenticate the user
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + str(self.get_tokens_for_user(self.user)['access'])
        )

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def test_get_user_details_success(self):
        """Test retrieving authenticated user's details successfully."""
        url = reverse('get_user_details')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'testuser@example.com')

    def test_get_user_details_unauthenticated(self):
        """Test retrieving user details without authentication (should fail)."""
        self.client.credentials()  # Remove authentication
        url = reverse('get_user_details')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
