from django.db import models


class User(models.Model):
    email = models.CharField(max_length=30, null=False)
    password = models.CharField(max_length=30, null=False)
    displayName = models.CharField(max_length=25, null=True, blank=True)
    userName = models.CharField(max_length=25, null=True, blank=True)
    spotifyEmail = models.CharField(max_length=30, null=True, blank=True)
    country = models.CharField(max_length=3, null=True, blank=True)
    image = models.URLField(null=True, blank=True)
    spotifyId = models.BigIntegerField(null=True, blank=True)
    spotifyUrl = models.URLField(null=True, blank=True)
    userType = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return str(self.email)
