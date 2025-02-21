from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from contacts.models import Contact
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class GetSingleContactViewTest(APITestCase):

    def setUp(self):
        # Create and authenticate a test user
        self.user = User.objects.create_user(
            username='testuser', password='pass123'
        )
        self.other_user = User.objects.create_user(
            username='otheruser', password='pass456'
        )

        self.contact = Contact.objects.create(
            user=self.user,
            name='Obinna Santhus',
            address='123 Main St',
            phone_number='+1234567890'
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

    def test_get_single_contact_success(self):
        """Test retrieving a contact successfully."""
        url = reverse('get_contact', args=[self.contact.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.contact.name)
        self.assertEqual(response.data['address'], self.contact.address)
        self.assertEqual(response.data['phone_number'], self.contact.phone_number)

    def test_get_single_contact_not_found(self):
        """Test retrieving a contact that Santhuss not exist."""
        url = reverse('get_contact', args=[999])  # Non-existent contact ID
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Contact not found')

    def test_get_single_contact_unauthorized_access(self):
        """Test retrieving another user's contact (should fail)."""
        # Create a contact belonging to another user
        other_contact = Contact.objects.create(
            user=self.other_user,
            name='Vitalis Santhus',
            address='23 Bolton , UK',
            phone_number='+0987654321'
        )
        url = reverse('get_contact', args=[other_contact.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Contact not found')

    def test_get_single_contact_unauthenticated(self):
        """Test that unauthenticated users cannot retrieve contacts."""
        self.client.credentials()  # Remove authentication
        url = reverse('get_contact', args=[self.contact.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
