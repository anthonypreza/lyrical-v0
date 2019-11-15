from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'userName', 'password', 'displayName',
                  'spotifyEmail', 'country', 'image', 'spotifyId',
                  'spotifyUrl', 'userType')
