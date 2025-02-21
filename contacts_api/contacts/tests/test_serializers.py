from django.test import TestCase
from django.contrib.auth.models import User
from contacts.models import Contact
from contacts.serializers import (
    UserSerializer,
    RegisterSerializer,
    ContactSerializer
)

class UserSerializerTest(TestCase):

    def test_user_serializer(self):
        user = User.objects.create_user(username='testuser', email='user@test.com', password='pass123')
        serializer = UserSerializer(user)
        data = serializer.data
        self.assertEqual(data['username'], 'testuser')
        self.assertEqual(data['email'], 'user@test.com')


class RegisterSerializerTest(TestCase):

    def test_register_serializer_valid_data(self):
        data = {
            'username': 'newuser',
            'email': 'newuser@test.com',
            'password': 'pass123'
        }
        serializer = RegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.username, 'newuser')
        self.assertTrue(user.check_password('pass123'))

    def test_register_serializer_invalid_data(self):
        data = {'username': '', 'email': 'invalidemail', 'password': ''}
        serializer = RegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)
        self.assertIn('email', serializer.errors)
        self.assertIn('password', serializer.errors)


class ContactSerializerTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='pass123')

    def test_contact_serializer_valid_data(self):
        data = {
            'name': 'Obinna Caleb',
            'address': '123 Main St',
            'phone_number': '+1234567890'
        }
        serializer = ContactSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        contact = serializer.save(user=self.user)
        self.assertEqual(contact.name, 'Obinna Caleb')
        self.assertEqual(contact.address, '123 Main St')

    def test_contact_serializer_empty_name(self):
        data = {'name': '', 'address': '123 Main St', 'phone_number': '+1234567890'}
        serializer = ContactSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)

    def test_contact_serializer_invalid_name(self):
        data = {'name': 'Obinna123', 'address': '123 Main St', 'phone_number': '+1234567890'}
        serializer = ContactSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)

    def test_contact_serializer_invalid_phone_number(self):
        data = {'name': 'Obinna Caleb', 'address': '123 Main St', 'phone_number': 'invalid'}
        serializer = ContactSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('phone_number', serializer.errors)

    def test_contact_serializer_empty_address(self):
        data = {'name': 'Obinna Caleb', 'address': '', 'phone_number': '+1234567890'}
        serializer = ContactSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('address', serializer.errors)
