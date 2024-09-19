import csv
import os

# Function to convert text data to CSV format
def txt_to_csv(input_file, output_file):
    try:
        with open(input_file, 'r') as txt_file:
            lines = txt_file.readlines()
    except FileNotFoundError:
        print(f"Error: The file {input_file} was not found.")
        return
    except Exception as e:
        print(f"Error: {e}")
        return

    # Open the CSV file for writing
    with open(output_file, 'w', newline='') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(['movie_id', 'user_id', 'rating', 'date'])

        current_movie_id = None
        for line in lines:
            line = line.strip()
            if line.endswith(':'):
                # This line is a movie ID
                current_movie_id = line[:-1]
            else:
                # This line is user data
                user_id, rating, date = line.split(',')
                writer.writerow([current_movie_id, user_id, rating, date])

# File paths
input_file = '/Users/veredmazor/Finel Project Netflix App/backend/combined_data_1.txt'
output_file = './output.csv'

# Check if the input file exists
if not os.path.isfile(input_file):
    print(f"Error: The file {input_file} does not exist.")
else:
    # Convert the text file to a CSV file
    txt_to_csv(input_file, output_file)
    print(f"Data has been successfully converted to {output_file}")
