from flask import Flask, jsonify, request, abort
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Create a new item
@app.route('/item', methods=['POST'])
def create_item():
    data = request.get_json() or {}
    return jsonify(data), 201

# Read all items
@app.route('/item', methods=['GET'])
def get_items():
    return jsonify([]), 200

# Read a single item by ID
@app.route('/item/<int:item_id>', methods=['GET'])
def get_item(item_id):
    return jsonify(item_id), 200

# Update an existing item
@app.route('/item/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.get_json() or {}
    return jsonify(data), 200

# Delete an item
@app.route('/item/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    return jsonify(item_id), 204

if __name__ == '__main__':
    app.run(debug=True)