import base64
import json
import os
from urllib.parse import parse_qs, urlencode, urlsplit

import requests
from bs4 import BeautifulSoup
from django.shortcuts import redirect, render
from rest_framework import viewsets

from .models import User
from .serializers import UserSerializer
# from .utilities import get_most_common, get_song_info, tokenized_lyrics

# ALL_USERS = User.objects.all()
# USER_IDs = [user.id for user in ALL_USERS]

# Spotify URLs
AUTH_BASE = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
BASE_URL = 'https://api.spotify.com/v1'

# Genius URLs
GENIUS_AUTH_BASE = 'https://api.genius.com/oauth/authorize'
GENIUS_TOKEN_URL = 'https://api.genius.com/oauth/token'

# Spotify client configuration
CLIENT_ID = os.environ['MUSIC_APP_CLIENT_ID']
CLIENT_SECRET = os.environ['MUSIC_APP_CLIENT_SECRET']

# Redirect URI for authentication
REDIRECT_URI = 'http://localhost:8000/callback'

# Spotify authentication scopes
SCOPES = 'user-top-read user-read-private user-read-email'

# Spotify authentication parameters
PARAMS = {
    'client_id': CLIENT_ID,
    'response_type': 'code',
    'redirect_uri': REDIRECT_URI,
    'scope': SCOPES
}

QUERYSTRING = urlencode(PARAMS)
AUTH_URL = AUTH_BASE + '?' + QUERYSTRING
ACCESS_TOKEN = None
REFRESH_TOKEN = None


class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


def index(request):
    try:
        user = request.session['user']
        genius_access_token = request.session['GENIUS_ACCESS_TOKEN']
        if user and genius_access_token:
            return redirect('/home')
        else:
            raise Exception
    except (KeyError, Exception):
        return render(request,
                      'app/index.html',
                      context={'AUTH_URL': AUTH_URL})


def callback(request):
    path = request.get_full_path()
    query_vars = parse_qs(urlsplit(path).query)
    code = query_vars['code'][0]
    body = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI
    }
    auth_headers = {
        'Authorization':
        b'Basic ' +
        base64.b64encode(bytes(f'{CLIENT_ID}:{CLIENT_SECRET}', 'utf-8'))
    }
    response = requests.post(TOKEN_URL, data=body, headers=auth_headers)

    try:
        if response.ok:
            r = response.json()
            request.session['ACCESS_TOKEN'] = ACCESS_TOKEN = r['access_token']
            request.session['REFRESH_TOKEN'] = REFRESH_TOKEN = r[
                'refresh_token']
            request.session['access_headers'] = access_headers = {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
            USER_URL = BASE_URL + '/me'
            user_request = requests.get(USER_URL, headers=access_headers)
            if user_request.ok:
                user_object = user_request.json()
            else:
                print("Couldn't retrieve user info...")
                return redirect('/')
        else:
            print(f'Error: {response.text}\nSupplying refresh token')
            raise Exception

    except Exception:
        refresh_body = {
            'grant_type': 'refresh_token',
            'refresh_token': REFRESH_TOKEN
        }
        refresh = requests.post(TOKEN_URL,
                                data=refresh_body,
                                headers=auth_headers)
        if refresh.ok:
            r = refresh.json()
            request.session['ACCESS_TOKEN'] = ACCESS_TOKEN = r['access_token']
            request.session['access_headers'] = access_headers = {
                'Authorization': 'Bearer ' + ACCESS_TOKEN,
                'accept': 'application/json'
            }
            USER_URL = BASE_URL + '/me'
            user_request = requests.get(USER_URL, headers=access_headers)
            if user_request.ok:
                user_object = user_request.json()
            else:
                print("Couldn't retrieve user info...")
                return redirect('/')
        else:
            print(f'Error: {refresh.text}')
            return redirect('http://localhost:3000')

    # if int(user_object['id']) not in USER_IDs:
    #     user = User(country=user_object['country'],
    #                 display_name=user_object['display_name'],
    #                 email=user_object['email'],
    #                 spotify_url=user_object['external_urls']['spotify'],
    #                 spotify_id=int(user_object['id']),
    #                 image=user_object['images'][0]['url'],
    #                 user_type=user_object['product'])
    #     user.save()

    # else:
    #     user = User.objects.get(spotify_id=user_object['id'])

    # request.session['display_name'] = user.display_name
    # request.session['spotify_id'] = user.spotify_id
    # request.session['country'] = user.country
    # request.session['spotify_url'] = user.spotify_url
    # request.session['email'] = user.email
    # request.session['image'] = user.image
    # request.session['user_type'] = user.user_type

    return redirect('http://localhost:3000')


# def home(request):
#     try:
#         spotify_id = request.session['spotify_id']

#     except KeyError:
#         return redirect('/')

#     first_name = request.session['display_name'].split(' ')[0]

#     return render(request,
#                   'app/home.html',
#                   context={
#                       'first_name': first_name,
#                   })

# def logout(request):
#     request.session.clear()
#     return redirect('/')

# def report(request):
#     try:
#         access_headers = request.session['access_headers']
#         top_tracks = requests.get(BASE_URL + '/me/top/tracks',
#                                   params={'limit': 50},
#                                   headers=access_headers)
#         if top_tracks.ok:
#             top_tracks = top_tracks.json()
#         request.session['top_tracks'] = top_tracks
#         tracks = top_tracks['items']

#     except KeyError:
#         return redirect('/')

#     hit_list = []

#     for track in tracks:
#         hit_list.append(get_song_info(track))

#     lyric_list = []

#     for hit in hit_list:
#         if hit:
#             lyric_list.extend(tokenized_lyrics(hit))
#         else:
#             continue

#     most_common = get_most_common(lyric_list)

#     return render(request,
#                   'app/report.html',
#                   context={'most_common': most_common})
