import argparse
import logging
import sys
import json

from genius import get_song_info, get_lyrics, get_lyrics_free_tier
from flask import Flask, Response, jsonify, request
from flask_cors import CORS

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(name)s - %(message)s')
logging.getLogger('urllib3.connectionpool').setLevel(logging.CRITICAL)


class App(Flask):
    """
    Main application class.
    """

    def __init__(self, name):
        super(App, self).__init__(name)


APP = App(__name__)
APP.config.from_envvar('FLASK_CONFIG')
API_ROOT = '/api/v0/'

cors = CORS(APP, resources={r"/*": {"origins": "*"}},
            supports_credentials=True)


@APP.route("/", methods=["GET"])
def root():
    return "Web root for Lyrical API"


@APP.route(API_ROOT + 'get_lyrics', methods=["GET", "POST"])
def lyrics():
    if request.method == 'POST' and request.data:
        data = json.loads(request.data)
        track_name = data['track_name']
        artists = data['artists']
        song_info = get_song_info(track_name, artists)
        try:
            lyrics = get_lyrics(song_info)
            res = jsonify(lyrics)
        except:
            res = get_lyrics_free_tier(song_info)
        return res
    else:
        return "Did you mean to make a POST request to this endpoint?"


@APP.errorhandler(401)
def page_not_found():
    return Response('Not found')


def parse_args(args):
    argparser = argparse.ArgumentParser(description="Development server")
    argparser.add_argument('-p', '--port', type=int, default=8000,
                           help='Port for HTTP server (default=%d).' % 8000)
    argparser.add_argument(
        '-d', '--debug', action='store_true', default=False, help='Debug mode.')
    return argparser.parse_args(args)


def main():
    logger = logging.getLogger(__name__)
    args = parse_args(sys.argv[1:])
    logger.info('Starting server on port %s with debug=%s',
                args.port, args.debug)
    APP.secret_key = 'R0Rl1C0ByYZM9IX3t2EQ1FgigOAx9Wo4'
    APP.run(host='0.0.0.0', port=args.port, debug=args.debug)


if __name__ == '__main__':
    main()
