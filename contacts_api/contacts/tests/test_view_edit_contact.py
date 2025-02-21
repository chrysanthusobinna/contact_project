from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from contacts.models import Contact
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class EditContactViewTest(APITestCase):

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

    def test_edit_contact_success(self):
        """Test updating a contact successfully."""
        url = reverse('edit_contact', args=[self.contact.id])
        data = {
            'name': 'Obinna Vitalis',
            'address': '456 New St',
            'phone_number': '+1122334455'
        }
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Obinna Vitalis')
        self.assertEqual(response.data['address'], '456 New St')
        self.assertEqual(response.data['phone_number'], '+1122334455')

    def test_edit_contact_partial_update(self):
        """Test partially updating a contact's details."""
        url = reverse('edit_contact', args=[self.contact.id])
        data = {
            'address': '789 Partial St'
        }
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['address'], '789 Partial St')
        self.assertEqual(response.data['name'], 'Obinna Santhus')  # Unchanged
        self.assertEqual(response.data['phone_number'], '+1234567890')  # Unchanged

    def test_edit_contact_invalid_data(self):
        """Test updating a contact with invalid data."""
        url = reverse('edit_contact', args=[self.contact.id])
        data = {
            'phone_number': 'invalid_number'
        }
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone_number', response.data)

    def test_edit_contact_not_found(self):
        """Test updating a non-existent contact."""
        url = reverse('edit_contact', args=[999])
        data = {
            'name': 'Ghost User'
        }
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Contact not found')

    def test_edit_contact_unauthorized_access(self):
        """Test updating another user's contact (should fail)."""
        other_contact = Contact.objects.create(
            user=self.other_user,
            name='Obinna Santhus',
            address='23 Bolton , UK',
            phone_number='+0987654321'
        )
        url = reverse('edit_contact', args=[other_contact.id])
        data = {
            'name': 'Hacked Name'
        }
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Contact not found')

    def test_edit_contact_unauthenticated(self):
        """Test unauthenticated users cannot update contacts."""
        self.client.credentials()  # Remove authentication
        url = reverse('edit_contact', args=[self.contact.id])
        data = {
            'name': 'Unauthorized Edit'
        }
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
