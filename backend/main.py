from flask import Flask, request, jsonify, abort
import numpy as np
import pandas as pd

app = Flask(__name__)

cosine_distances = np.lib.format.open_memmap("cosine_distances.npy", mode="r")
euclidean_distances = np.lib.format.open_memmap("euclidean_distances.npy", mode="r")
manhattan_distances = np.lib.format.open_memmap("manhattan_distances.npy", mode="r")
songs = pd.read_csv("songs_extended.csv")

songs_ids = pd.Series(range(songs["track_id"].size), index=songs["track_id"])


def song_recommender(song_id, db=cosine_distances):
    idx = songs_ids[song_id]
    scores = list(enumerate(db[idx]))
    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=False)[0:11]
    rec_songs_idxs = [i[0] for i in sorted_scores]
    print("\nTop 10 similar songs to: ", song_id, "\n")
    return songs.iloc[rec_songs_idxs]


def get_song_id(song_name, artist_name=""):
    if artist_name == "":
        ids = songs[songs["track_name"] == song_name]["track_id"]
        return ids
    else:
        ids = songs[songs["track_name"] == song_name]
        ids = ids[ids["artist_name"] == artist_name]["track_id"]
        return ids


def song_recommender_name(song_name, artist_name=""):
    ids = get_song_id(song_name, artist_name=artist_name)
    if ids.size == 0:
        return "No Song Found"
    return song_recommender(ids.iloc[0])


def song_recommender_id(song_id, db=cosine_distances):
    ids = songs[songs["track_id"] == song_id]["track_id"]
    if ids.size == 0:
        return "No Song Found"
    return song_recommender(ids.iloc[0], db=db)


@app.route("/")
def get_song_recommendations():
    song_name = request.args.get("song")
    artist = request.args.get("artist")

    if song_name is None:
        abort(404)

    if artist is None:
        recs = song_recommender_name(song_name)
    else:
        recs = song_recommender_name(song_name, artist_name=artist)

    if isinstance(recs, str) and recs == "No Song Found":
        abort(406)

    return recs.to_json(orient="split")


@app.route("/id")
def get_song_recommendation_using_id():
    song_id = request.args.get("song")
    db = request.args.get("db")

    if song_id is None:
        abort(404)
    else:
        song_id = song_id.strip()

    if db == "euclidean":
        recs = song_recommender_id(song_id, db=euclidean_distances)
    elif db == "manhattan":
        recs = song_recommender_id(song_id, db=manhattan_distances)
    else:
        recs = song_recommender_id(song_id)

    if isinstance(recs, str) and recs == "No Song Found":
        abort(406)

    return recs.to_json(orient="split")


@app.errorhandler(406)
def not_found_error(error):
    return (
        jsonify(
            {"error": "Not Found", "Song": "The requested resource was not found."}
        ),
        406,
    )


if __name__ == "__main__":
    app.run()
