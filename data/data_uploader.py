import csv
import json
from pymongo import MongoClient
from bson import ObjectId
import time
import os

def convert_oid(obj):
    """ Recursively convert $oid fields to ObjectId """
    if isinstance(obj, dict):
        if "$oid" in obj:
            return ObjectId(obj["$oid"])
        return {k: convert_oid(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_oid(i) for i in obj]
    else:
        return obj

def upload_data_to_mongo():
    mongo_host = os.getenv('MONGO_HOST', 'mongodb-container')
    mongo_port = int(os.getenv('MONGO_PORT', 27017))

    print(f"Connecting to MongoDB at {mongo_host}:{mongo_port}")
    client = MongoClient(mongo_host, mongo_port)  # Configure the connection to the database
    db = client['FilmFlix']

    # Load and insert movies
    try:
        with open('FilmFlix.movies.json', mode='r') as f:
            movies_data = json.load(f)
            movies_data = [convert_oid(movie) for movie in movies_data]  # Convert $oid fields
        # Insert the data into the MongoDB collection
        db.movies.insert_many(movies_data)
        print("Movies uploaded successfully")
    except Exception as e:
        print(f"Error uploading movies: {e}")


    # Load and insert recommendations
    try:
        with open('FilmFlix.recommendations.csv', mode='r') as f:
            reader = csv.DictReader(f)
            recommendations = list(reader)
            for recommendation in recommendations:
                recommendation['_id'] = ObjectId(recommendation['_id'])
                recommendation['CustomersID'] = int(recommendation['CustomersID'])
                recommendation['Rating'] = int(recommendation['Rating'])
                recommendation['MovieID'] = int(recommendation['MovieID'])
            print("Original Recommendations Data:", recommendations[:1])  # Print the first recommendation for debugging
            db.recommendations.insert_many(recommendations)
            print("Recommendations uploaded successfully")
    except Exception as e:
        print(f"Error uploading recommendations: {e}")
    # Load and insert counters
    try:
        with open('FilmFlix.counters.csv', mode='r') as f:
            reader = csv.DictReader(f)
            counters = list(reader)
            for counter in counters:
                counter['sequence_value'] = int(counter['sequence_value'])
            print("Original Counters Data:", counters[:1])  # Print the first counter for debugging
            db.counters.insert_many(counters)
            print("Counters uploaded successfully")
    except Exception as e:
        print(f"Error uploading counters: {e}")

    # Load and insert users
    try:
    # Load and insert users from JSON
        with open('FilmFlix.users.json', mode='r') as f:
            users = json.load(f)
            users = [convert_oid(user) for user in users]
            print("Original Users Data:", users[:1])  # Print the first user for debugging
            db.users.insert_many(users)
            print("Users uploaded successfully")
    except Exception as e:
        print(f"Error uploading users: {e}")

if __name__ == '__main__':
    time.sleep(120)  # Increase the wait time for MongoDB to be ready
    upload_data_to_mongo()
