from django.contrib import admin

# Register your models here.

from .models import User, Profile, Posts

class PostAdmin(admin.ModelAdmin):
    filter_horizontal =("megusta",)

admin.site.register(User)
admin.site.register(Profile)
admin.site.register(Posts, PostAdmin)

