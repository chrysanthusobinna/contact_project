from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from contacts.models import Contact
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class DeleteContactViewTest(APITestCase):

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
            name='Santhus Chiagwah',
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

    def test_delete_contact_success(self):
        """Test deleting a contact successfully."""
        url = reverse('delete_contact', args=[self.contact.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Contact.objects.filter(id=self.contact.id).exists())

    def test_delete_contact_not_found(self):
        """Test deleting a non-existent contact."""
        url = reverse('delete_contact', args=[999])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Contact not found')

    def test_delete_contact_unauthorized_access(self):
        """Test deleting another user's contact (should fail)."""
        other_contact = Contact.objects.create(
            user=self.other_user,
            name='Vitalis Chiagwah',
            address='23 Bolton , UK',
            phone_number='+0987654321'
        )
        url = reverse('delete_contact', args=[other_contact.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Contact not found')

    def test_delete_contact_unauthenticated(self):
        """Test unauthenticated users cannot delete contacts."""
        self.client.credentials()  # Remove authentication
        url = reverse('delete_contact', args=[self.contact.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
