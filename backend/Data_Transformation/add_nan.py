import pandas as pd
import numpy as np

try:
    # Read the CSV file
    df = pd.read_csv('FilmFlix.movies.csv', on_bad_lines='skip')
    print("DataFrame loaded successfully:")
    print(df.head(40))

    # Ensure the "Image URL" column exists
    if 'Image URL' in df.columns:
        # Add NaN values to the "Image URL" column from row 107 to 17771
        df.loc[76:17771, 'Image URL'] = "NaN"

        # Print the DataFrame with NaN values to verify the changes
        print("\nDataFrame with NaN values in 'Image URL' column:")
        print(df.loc[100:110])  # Print a subset to verify changes

        # Write the DataFrame to a new CSV file
        df.to_csv('output.csv', index=False)
        print("DataFrame written to output.csv")
    else:
        print("The 'Image URL' column was not found in the DataFrame.")

except pd.errors.ParserError as e:
    print("ParserError:", e)
except Exception as e:
    print("An error occurred:", e)
