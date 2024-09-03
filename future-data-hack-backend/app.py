from flask import Flask, jsonify, request, abort
from flask_cors import CORS

from deepgram import Deepgram
import os
from dotenv import load_dotenv

from flask_sock import Sock
import json

import base64
from PIL import Image
from io import BytesIO

from drowsinessDetector import drowsinessDetector
from DrowsinessCustomModel import DrowsinessModel

app = Flask(__name__)
CORS(app)
load_dotenv()

sock = Sock(app)

DEEPGRAM_API_KEY = os.getenv('DEEPGRAM_API_KEY')
deepgram = Deepgram(DEEPGRAM_API_KEY)
drowsinessDetector = drowsinessDetector()
drowsinessDetectorCustomModel = DrowsinessModel()

@app.route('/', methods=['GET'])
def alive():
    return jsonify("Hello World!"), 200

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

@sock.route('/ws')
def echo(ws):
    while True:
        data = ws.receive()
        if not data:
            break
        try:
            message = json.loads(data)
            event = message.get("event")
            if event == "image":
                image_data_base64 = message.get('data')

                if "data:image" in image_data_base64:
                    image_data_base64 = image_data_base64.split(",")[1]
                
                image_bytes = base64.b64decode(image_data_base64)
                image_stream = BytesIO(image_bytes)
                image = Image.open(image_stream).convert("RGB")

                prediction = drowsinessDetectorCustomModel.predict(image)

                ws.send(json.dumps({
                    "event": 'prediction',
                    "data": prediction
                }))
            else:
                ws.send(json.dumps({
                    'event': 'error', 
                    'data': 'Unknown event type'
                }))
        except Exception as e:
            ws.send(json.dumps({
                'event': 'error',
                'data': f'Error processing data: {str(e)}'
            }))
if __name__ == '__main__':
    app.run(debug=True)