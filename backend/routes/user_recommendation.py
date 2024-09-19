from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db

user_recommendation_bp = Blueprint("user_recommendation_bp", __name__)



@user_recommendation_bp.route("/", methods=['GET'])
@jwt_required()
def get_top_5_movies():
    try:
        # Get the current user's identity from the JWT token
        current_user = get_jwt_identity()
        if not current_user:
            return jsonify({"error": "User not authenticated"}), 401

        # Fetch the user's document from MongoDB using the CustomersID
        user = db.users.find_one({"CustomersID": current_user})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Get the top 5 movie IDs from the user's document
        top_5_movie_ids = user.get("Top5MovieIDs", [])
        print(f"Top 5 Movie IDs: {top_5_movie_ids}")

        if not top_5_movie_ids:
            return jsonify({"top_5_user_recommendation": []}), 200

        # Fetch movie details for the top 5 movie IDs
        movie_list = []
        for movie_id in top_5_movie_ids:
            movie = db.movies.find_one({"Movie Id": movie_id})  # Construct the filter as a dictionary
            if movie:
                # Convert the ObjectId to a string
                movie['_id'] = str(movie['_id'])
                print(movie)

                movie_list.append(movie)
        return jsonify({"top_5_user_recommendation": movie_list}), 200

    except Exception as e:
        print(f"Error retrieving top 5 movies: {e}")
        return jsonify({"error": "An error occurred while retrieving the top 5 movies"}), 500

