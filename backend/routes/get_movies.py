from flask import Blueprint, request, jsonify

from database import get_movies_with_pagination


get_movies_bp = Blueprint("get_movies_bp", __name__)


@get_movies_bp.route("", methods=['GET'])
def get_movies():
    try:
        # Get the page and page_size from the query parameters
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 18))
        movies_list, total_pages = get_movies_with_pagination(page,page_size)

        return jsonify({
            'movies': movies_list,
            'total_pages': total_pages
        }), 200

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    
