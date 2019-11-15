import string
from collections import Counter

import nltk
import requests
from bs4 import BeautifulSoup

nltk.download('stopwords')
nltk.download('punkt')
useless_words = nltk.corpus.stopwords.words(
    "english") + list(string.punctuation)


def build_bag_of_words_features_filtered(words):
    return {
        word: 1 for word in words
        if not word in useless_words}


def filtered_tokenize(words):
    tokenized = nltk.word_tokenize(words)
    word_list = [word.upper()
                 for word in tokenized if word.lower() not in useless_words and len(word) > 3]
    return word_list


def get_most_common(word_list):
    word_counter = Counter(word_list)
    most_common = word_counter.most_common()
    return [{'word': x[0], 'count': x[1]} for x in most_common][:5]


def tokenized_lyrics(hit):
    song_url = hit['result']['url']
    artist_name = hit['result']['primary_artist']['name']
    name = hit['result']['title']
    page = requests.get(song_url)
    html = BeautifulSoup(page.text, 'html.parser')
    lyrics = html.find('div', class_='lyrics').get_text()
    lyrics = lyrics.replace('/n', ' ')
    lyrics = lyrics.replace('Verse', '')
    lyrics = lyrics.replace('Chorus', '')
    tokenized_lyrics = filtered_tokenize(lyrics)
    return tokenized_lyrics
