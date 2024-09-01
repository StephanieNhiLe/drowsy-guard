from flask import Flask, jsonify, request, abort
from flask_cors import CORS

from deepgram import Deepgram
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()

DEEPGRAM_API_KEY = os.getenv('DEEPGRAM_API_KEY')
deepgram = Deepgram(DEEPGRAM_API_KEY)

@app.route('/', methods=['GET'])
def alive():
    return jsonify("Hello World!"), 200

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

@app.route('/transcribe', methods=['POST'])
async def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']

    if audio_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if audio_file:
        try:
            # Read the audio file
            audio_data = audio_file.read()

            # Configure Deepgram request
            source = {'buffer': audio_data, 'mimetype': 'audio/mp3'}
            options = {
                'model': 'nova-2',
                'smart_format': True,
                'summarize': 'v2',
            }

            # Send request to Deepgram
            response = await deepgram.transcription.prerecorded(source, options)

            # Extract transcription from the response
            transcript = response['results']['channels'][0]['alternatives'][0]['transcript']

            return jsonify({'transcription': transcript}), 200
        except Exception as e:
            print(f"Error during transcription: {str(e)}")
            return jsonify({'error': 'An error occurred during transcription'}), 500



if __name__ == '__main__':
    app.run(debug=True)