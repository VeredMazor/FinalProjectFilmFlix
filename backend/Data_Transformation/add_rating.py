import pandas as pd
import os

# Print the current working directory
print("Current Working Directory:", os.getcwd())

# Create 'data' directory if it doesn't exist
if not os.path.exists('data'):
    os.makedirs('data')

# Load the movies and ratings data
movies_df = pd.read_csv('FilmFlix.movies.csv')
ratings_df = pd.read_csv('FilmFlix.recommendations_large.csv')

# Group by MovieID and calculate the average rating
average_ratings_df = ratings_df.groupby('MovieID')['Rating'].mean().reset_index()
average_ratings_df.rename(columns={'Rating': 'Average Rating'}, inplace=True)

# Merge the average ratings with the movies DataFrame
merged_df = pd.merge(movies_df, average_ratings_df, left_on='Movie Id', right_on='MovieID', how='left')

# Replace NaN values in 'AverageRating' with 0
merged_df['Average Rating'] = merged_df['Average Rating'].fillna(0)

# Drop the extra MovieID column from the merged DataFrame
merged_df.drop(columns=['MovieID'], inplace=True)

# Save the updated movies DataFrame with the average ratings
merged_df.to_csv('FilmFlix.movies_updated.csv', index=False)
