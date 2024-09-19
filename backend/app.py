from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
import time

from routes.sign_in import sign_in_bp
from routes.sign_up import sign_up_bp
from routes.get_movies import get_movies_bp
from routes.user_recommendation import user_recommendation_bp
from routes.user_rating import user_rating_bp


time.sleep(850)


app = Flask(__name__)
CORS(app, origins=os.getenv("CORS_ORIGINS"), supports_credentials=True)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

jwt = JWTManager(app)



# Register the blueprints with a URL prefix
app.register_blueprint(sign_in_bp, url_prefix='/sign_in')
app.register_blueprint(sign_up_bp, url_prefix='/sign_up')
app.register_blueprint(get_movies_bp, url_prefix='/')
app.register_blueprint(user_recommendation_bp, url_prefix='/user_recommendation')
app.register_blueprint(user_rating_bp, url_prefix='/user_rating')



if __name__ == "__main__":
    app.run(debug=True)
