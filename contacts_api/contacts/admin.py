from django.contrib import admin
from .models import Contact

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'address', 'user')
    search_fields = ('name', 'phone_number', 'user__username')
    list_filter = ('user',)

