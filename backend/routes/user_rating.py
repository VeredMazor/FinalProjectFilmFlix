from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from middleware.kafka_producer import producer

from database import update_movie_rating

user_rating_bp = Blueprint("user_rating_bp", __name__)


@user_rating_bp.route("/", methods=['POST'])
@jwt_required()  # Protect this route with JWT authentication
def user_rating():
    current_user = None
    try:
        current_user = get_jwt_identity()
        print(f"Current user: {current_user}")  # Print user information from JWT
    except Exception as e:
        print(f"Error retrieving JWT identity: {e}")
    if current_user:
        new_rating = request.json
        update_movie_rating(new_rating.get('userRating'),new_rating.get('movieId'))
        producer.send('test', new_rating)
        return jsonify({"msg": "Success"}), 201
