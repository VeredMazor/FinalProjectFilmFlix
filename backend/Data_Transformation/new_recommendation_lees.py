import pandas as pd
import csv

# Load the original CSV file
original_file = 'FilmFlix.recommendations.csv'
df = pd.read_csv(original_file)

# Get the number of rows needed
rows_needed = 12154630

# Calculate how many times to repeat the original data
repeat_times = rows_needed // len(df)
remainder = rows_needed % len(df)

# Repeat the dataframe and add the remainder
new_df = pd.concat([df] * repeat_times + [df.iloc[:remainder]])

# Save the new dataframe to a new CSV file
new_file = 'FilmFlix.recommendations_large.csv'
new_df.to_csv(new_file, index=False, quoting=csv.QUOTE_NONNUMERIC)

print(f"New CSV file with {rows_needed} rows has been created: {new_file}")
