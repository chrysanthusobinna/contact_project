from django.test import SimpleTestCase
from django.urls import reverse, resolve
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from contacts.views import (
    register, logout, get_user_details, get_contacts, create_contact,
    get_contact, edit_contact, delete_contact
)

class TestUrls(SimpleTestCase):

    def test_register_url_resolves(self):
        url = reverse('register')
        self.assertEqual(resolve(url).func, register)

    def test_login_url_resolves(self):
        url = reverse('login')
        self.assertEqual(resolve(url).func.view_class, TokenObtainPairView)

    def test_logout_url_resolves(self):
        url = reverse('logout')
        self.assertEqual(resolve(url).func, logout)

    def test_user_details_url_resolves(self):
        url = reverse('get_user_details')
        self.assertEqual(resolve(url).func, get_user_details)

    def test_get_contacts_url_resolves(self):
        url = reverse('get_contacts')
        self.assertEqual(resolve(url).func, get_contacts)

    def test_create_contact_url_resolves(self):
        url = reverse('create_contact')
        self.assertEqual(resolve(url).func, create_contact)

    def test_get_single_contact_url_resolves(self):
        url = reverse('get_contact', args=[1])
        self.assertEqual(resolve(url).func, get_contact)

    def test_edit_contact_url_resolves(self):
        url = reverse('edit_contact', args=[1])
        self.assertEqual(resolve(url).func, edit_contact)

    def test_delete_contact_url_resolves(self):
        url = reverse('delete_contact', args=[1])
        self.assertEqual(resolve(url).func, delete_contact)

    def test_token_refresh_url_resolves(self):
        url = reverse('token_refresh')
        self.assertEqual(resolve(url).func.view_class, TokenRefreshView)

    def test_token_verify_url_resolves(self):
        url = reverse('token_verify')
        self.assertEqual(resolve(url).func.view_class, TokenVerifyView)
