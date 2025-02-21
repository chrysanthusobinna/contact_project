from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from contacts.models import Contact
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class GetContactsViewTest(APITestCase):

    def setUp(self):
        # Create and authenticate a test user
        self.user = User.objects.create_user(
            username='testuser', password='pass123'
        )
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + str(self.get_tokens_for_user(self.user)['access'])
        )

        # Create contacts for the test user
        Contact.objects.create(user=self.user, name='Alice', address='123 Maple St', phone_number='+123456789')
        Contact.objects.create(user=self.user, name='Bob', address='456 Oak St', phone_number='+987654321')

        # Create a contact for another user
        other_user = User.objects.create_user(username='otheruser', password='pass123')
        Contact.objects.create(user=other_user, name='Eve', address='789 Pine St', phone_number='+111222333')

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def test_get_all_contacts_authenticated_user(self):
        """Test that authenticated user retrieves only their contacts."""
        url = reverse('get_contacts')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Only contacts for testuser
        self.assertEqual(response.data[0]['name'], 'Alice')
        self.assertEqual(response.data[1]['name'], 'Bob')

    def test_get_all_contacts_unauthenticated_user(self):
        """Test that unauthenticated user cannot retrieve contacts."""
        self.client.credentials()  # remove authentication

        url = reverse('get_contacts')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
