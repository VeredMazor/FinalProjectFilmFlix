import pandas as pd

# Load the recommendations data
recommendations_df = pd.read_csv('FilmFlix.recommendations_large.csv')

# Calculate the rating counts for each MovieID
rating_counts = recommendations_df.groupby('MovieID').size().reset_index(name='rating_counts')

# Load the movies data
movies_df = pd.read_csv('FilmFlix.movies.csv')

# Merge the rating counts with the movies data
movies_df = movies_df.merge(rating_counts, left_on='Movie Id', right_on='MovieID', how='left')

# Fill NaN values in rating_counts with 0 (in case there are movies with no ratings)
movies_df['rating_counts'].fillna(0, inplace=True)

# Convert rating_counts to integer (since fillna turns it into float)
movies_df['rating_counts'] = movies_df['rating_counts'].astype(int)

# Drop the MovieID column as it's not needed anymore
movies_df.drop('MovieID', axis=1, inplace=True)

# Save the updated movies data back to the same CSV file
movies_df.to_csv('FilmFlix.movies.csv', index=False)

print("Rating counts added to FilmFlix.movies.csv")
