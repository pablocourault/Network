
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
# API Routes
    path("post", views.publish, name="posteo"),
    path("<int:postid>", views.likescounter, name="likescounter"),
    path("profile/<str:nombre>", views.profile, name="profile")]
