from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import create_access_token
from datetime import timedelta

from middleware.hash import hash_password
from database import db

sign_in_bp = Blueprint("sign_in_bp", __name__)


@sign_in_bp.route('/', methods=['POST'])
def sign_in():
    data = request.json
    user_data = data.get('userData')
    if not user_data:
        return jsonify({"error": "Invalid input"}), 400

    email = user_data.get('email')
    password = user_data.get('password')
    existing_user = db.users.find_one({"Email": email})

    if existing_user and hash_password(password) == existing_user['Password']:
        print(existing_user['CustomersID'])
        access_token = create_access_token(identity=existing_user['CustomersID'])
        response = make_response(jsonify({"message": "Sign-in successful", "customersId": existing_user['CustomersID'], "username": existing_user.get("Username"),"isvalied": "true", "token": access_token}), 200)
        response.set_cookie('access_token_cookie', access_token, max_age=timedelta(minutes=30), httponly=True)
        return response
    else:
        return jsonify({"error": "Invalid email or password"}), 401
