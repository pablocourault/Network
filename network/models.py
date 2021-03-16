from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime

class User(AbstractUser):
    pass


class Profile(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    avatar = models.CharField(max_length=12, blank=False)
    cantidad_seguidores = models.IntegerField(default=0)
    cantidad_seguidos = models.IntegerField(default=0)
    siguiendo = models.ManyToManyField(User, blank=True, related_name="following")
    seguidores = models.ManyToManyField(User, blank=True, related_name="followers")


    def __str__(self):
        return f"{self.usuario} - Seguidores: {self.cantidad_seguidores} - Siguiendo: {self.cantidad_seguidos}"


class Posts(models.Model): # publicación
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    avatar = models.CharField(max_length=12, blank=False)
    contents = models.TextField(max_length=640, blank=False)
    post_date = models.DateTimeField(blank=False, auto_now_add=True)
    cantidad_megusta = models.IntegerField(default=0)
    megusta = models.ManyToManyField(User, blank=True, related_name="likesto")

    def __str__(self):
        return f"{self.usuario} - Contenido: {self.contents} - Date: {self.post_date}"
    
