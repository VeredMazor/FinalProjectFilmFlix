import os
from pymongo import MongoClient, ReturnDocument
import pandas as pd
from math import ceil


mongo_host = os.getenv('MONGO_HOST', 'mongodb-container')
mongo_port = int(os.getenv('MONGO_PORT', 27017))
client = MongoClient(mongo_host, mongo_port)    #Configure the connection to the database

#client = MongoClient('localhost:27017')    #Configure the connection to the database

db = client['FilmFlix']
movies_collection = db['movies']
ratings_collection = db['recommendations']


# Initialize counter if not present (only run this once)
if db.counters.find_one({'_id': 'CustomersID'}) is None:
    db.counters.insert_one({'_id': 'CustomersID', 'sequence_value': 2649430})




def get_movies_with_pagination(page, page_size):
    
    # Calculate the offset
    skip = (page - 1) * page_size

    # Retrieve movie data for the current page
    movies_cursor = movies_collection.find(
        {}, 
        {"_id": 0, "Movie Id": 1, "Movie Name": 1, "Release Date": 1, "Image URL": 1, "Average Rating": 1, "Rating Counts": 1,}
    ).skip(skip).limit(page_size)
    
    # Convert the cursor to a DataFrame
    movies_df = pd.DataFrame(list(movies_cursor))
    print(movies_df.columns)
    if not movies_df.empty:
        # Convert 'Movie Id' to string for consistency
        movies_df['Movie Id'] = movies_df['Movie Id'].astype(str)

        # Check if 'average_rating' exists in the DataFrame
        if 'Average Rating' not in movies_df.columns:
            movies_df['Average Rating'] = None  # Assign a default value if missing

        # Select relevant columns
        relevant_columns = ["Movie Id", "Movie Name", "Release Date", "Image URL", "Average Rating", "Rating Counts"]
        movies_df = movies_df[relevant_columns]

    # Retrieve the total number of movies
    total_movies = movies_collection.count_documents({})
    total_pages = ceil(total_movies / page_size)

    # Convert DataFrame to list of dictionaries
    movies_list = movies_df.to_dict('records') if not movies_df.empty else []
    # print(movies_list)
    return movies_list, total_pages





def update_movie_rating(userRating, movieId):
    # Retrieve the current data for the movie
    movie = movies_collection.find_one({"Movie Id": movieId})
    if not movie:
        print(f"No movie found with Movie Id {movieId}")
        return
    
    current_avg = float(movie.get("Average Rating"))
    current_count = int(movie.get("Rating Counts"))  # Ensure it's treated as an integer
    
    # Calculate new average
    new_count = current_count + 1
    new_avg = ((current_avg * current_count) + float(userRating)) / new_count
    
    # Update the movie document
    movies_collection.update_one(
        {"Movie Id": movieId},
        {
            "$set": {"Average Rating": new_avg},
            "$inc": {"Rating Counts": 1}  # Increment Rating Counts
        }
    )
    print(f"Updated movie {movieId}: New Average Rating = {new_avg}, Rating Counts = {new_count}")




# Function to get the next CustomersID
def get_next_customers_id():
    counter = db.counters.find_one_and_update(
        {'_id': 'CustomersID'},
        {'$inc': {'sequence_value': 1}},
        return_document=ReturnDocument.AFTER,
        upsert=True
    )
    return counter['sequence_value']


def get_top_five():
    # Find all movies and sort them by "Average Rating" in descending order
    movies_cursor = movies_collection.find(
        {}, 
        {"_id": 0, "Movie Id": 1}  # Only include the "Movie Id" field
    ).sort("Average Rating", -1).limit(5)  # Sort by "Average Rating" in descending order and limit to 5

    top_5_movie_ids = [movie["Movie Id"] for movie in movies_cursor]

    return top_5_movie_ids
