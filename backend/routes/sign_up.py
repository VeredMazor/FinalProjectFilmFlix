from flask import Blueprint, request, jsonify


from middleware.hash import hash_password
from database import db, get_next_customers_id, get_top_five

sign_up_bp = Blueprint("sign_up_bp", __name__)


@sign_up_bp.route("/", methods=['POST'])
def sign_up():
    data = request.json  # Access the JSON data from the request body
    user_data = data['userData']  # Extract userData from the received data

    # Check if the email already exists in the users collection
    existing_user = db.users.find_one({"Email": user_data['email']})
    if existing_user:
        return jsonify({"error": "User with this email already exists"}), 409
    
    # Get the next CustomersID
    customers_id = get_next_customers_id()
    hashed_password = hash_password(user_data['password'])

    # Create new user document
    top_5_movie_ids = get_top_five()

    print(top_5_movie_ids)
    new_user = {
        "CustomersID": customers_id,
        "Username": user_data['username'],
        "Email": user_data['email'],
        "Password": hashed_password,
        "Top5MovieIDs": top_5_movie_ids
    }

    try:
        # Insert the new user document into the users collection
        db.users.insert_one(new_user)
        return jsonify({"success": True, "message": "User created successfully"}), 201
    except Exception as e:
        print(f"Error inserting new user: {e}")
        return jsonify({"error": "An error occurred while creating the user"}), 500
