# FilmFlix - Movie Recommendation System
Project Overview
FilmFlix is ​​a personalized movie recommendation system that leverages the Alternating Least Squares (ALS) algorithm. Users can rate movies, and based on their ratings, the system provides customized movie recommendations. 


## Architecture

React - used to build a responsive and interactive UI for users to browse movies, submit ratings, and view recommendations.
Back end:

Flask - serves as the API layer, handling client requests, user authentication, and communication with the recommendation system.
Message Queue:

Kafka - used as the messaging queue for sending user rating data from the front end to the recommendation engine.
Streaming & Recommendation Engine:

Spark Streaming - processes the data 

Spark MLlib - generates movie recommendations using the ALS algorithm.
Database:
MongoDB stores user data, movie information, and ratings.


## Technologies Used

- Frontend: React, JavaScript, Material-UI
- Backend: Flask, Python, Flask-CORS, Flask-JWT
- Queue: Kafka
- Data Processing: Apache Spark, Spark Streaming
- Database: MongoDB
- Containerization: Docker

![image](https://github.com/user-attachments/assets/c2db6ceb-377f-4bbf-8176-e5418da14fab)


## Installation
Set up Frontend without docker:
```bash
cd frontend
npm install
npm start
```
Set up Backend without docker:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # For Linux/macOS
venv\Scripts\activate     # For Windows
pip install -r requirements.txt
python app.py
```
Run all in docker:
```bash
docker-compose up
```

## Images

![Capture2](https://github.com/user-attachments/assets/98a45dd9-32f2-455f-a1b2-f2b122ff6f82)
![Capture1](https://github.com/user-attachments/assets/24ff8ecc-ba4d-41e6-87e0-ef74314a5110)
![Capture3](https://github.com/user-attachments/assets/aab03a40-6784-448a-aa5b-35bb2d301ebe)
![Capture4](https://github.com/user-attachments/assets/73305ea1-d428-4e67-8386-d7dd51573dbe)


