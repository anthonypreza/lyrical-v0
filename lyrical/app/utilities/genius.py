import os

import requests

GENIUS_BASE_URL = 'https://api.genius.com'
GENIUS_ACCESS_TOKEN = os.environ['GENIUS_ACCESS_TOKEN']

# Genius authentication tasks
# GENIUS_CLIENT_ID = os.environ['GENIUS_CLIENT_ID']
# GENIUS_CLIENT_SECRET = os.environ['GENIUS_CLIENT_SECRET']
# GENIUS_PARAMS = {
#     'client_id': GENIUS_CLIENT_ID,
#     'response_type': 'code',
#     'redirect_uri': GENIUS_REDIRECT_URI,
#     'scope': 'me',
#     'state': 100
# }# GENIUS_QUERYSTRING = urlencode(GENIUS_PARAMS)
# GENIUS_AUTH_URL = GENIUS_AUTH_BASE + '?' + GENIUS_QUERYSTRING


def get_song_info(track):
    q = str(track['name']).lower()
    for artist in track['artists']:
        q += ' ' + str(artist['name']).lower()
    headers = {'Authorization': 'Bearer ' + GENIUS_ACCESS_TOKEN}
    search_url = GENIUS_BASE_URL + '/search'
    data = {'q': q}
    response = requests.get(search_url, params=data, headers=headers)
    r = response.json()
    song_info = None
    for hit in r['response']['hits']:
        if artist['name'].lower(
        ) in hit['result']['primary_artist']['name'].lower():
            song_info = hit
            return song_info
