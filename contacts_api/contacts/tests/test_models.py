from django.test import TestCase
from django.contrib.auth.models import User
from contacts.models import Contact

class ContactModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='12345'
        )
        self.contact = Contact.objects.create(
            user=self.user,
            name='Chrys Santhus',
            address='123 Main St',
            phone_number='+1234567890'
        )

    def test_contact_creation(self):
        """Test that a contact is created correctly."""
        contact = Contact.objects.get(name='Chrys Santhus')
        self.assertEqual(contact.name, 'Chrys Santhus')
        self.assertEqual(contact.address, '123 Main St')
        self.assertEqual(contact.phone_number, '+1234567890')
        self.assertEqual(contact.user.username, 'testuser')

    def test_contact_str_representation(self):
        """Test the string representation of the Contact model."""
        self.assertEqual(str(self.contact), 'Chrys Santhus')

    def test_contact_update(self):
        """Test updating a contact's details."""
        self.contact.name = 'Vitalis Santhus'
        self.contact.address = '23 Bolton , UK'
        self.contact.phone_number = '+0987654321'
        self.contact.save()

        updated_contact = Contact.objects.get(id=self.contact.id)
        self.assertEqual(updated_contact.name, 'Vitalis Santhus')
        self.assertEqual(updated_contact.address, '23 Bolton , UK')
        self.assertEqual(updated_contact.phone_number, '+0987654321')

    def test_contact_deletion(self):
        """Test deleting a contact."""
        contact_id = self.contact.id
        self.contact.delete()

        with self.assertRaises(Contact.DoesNotExist):
            Contact.objects.get(id=contact_id)

    def test_multiple_contacts_for_same_user(self):
        """Test creating multiple contacts for the same user."""
        Contact.objects.create(
            user=self.user,
            name='Alice Smith',
            address='789 Oak St',
            phone_number='+1122334455'
        )
        Contact.objects.create(
            user=self.user,
            name='Bob Chrysson',
            address='101 Pine St',
            phone_number='+5566778899'
        )

        contacts = Contact.objects.filter(user=self.user)
        self.assertEqual(contacts.count(), 3)
