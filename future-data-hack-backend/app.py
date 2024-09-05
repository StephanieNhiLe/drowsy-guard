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
import google.generativeai as genai

import assemblyai as aai
import random

app = Flask(__name__)
CORS(app)
load_dotenv()

sock = Sock(app)

DEEPGRAM_API_KEY = os.getenv('DEEPGRAM_API_KEY')
ASSEMBLY_AI_API_KEY = os.getenv('ASSEMBLY_AI_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

deepgram = Deepgram(DEEPGRAM_API_KEY)
drowsinessDetector = drowsinessDetector()
drowsinessDetectorCustomModel = DrowsinessModel()

aai.settings.api_key = ASSEMBLY_AI_API_KEY
genai.configure(api_key=GEMINI_API_KEY)

transcriber = aai.Transcriber()

# Initialize an empty conversation history
conversation_history = []

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


@app.route('/activate-llm', methods=['POST'])
def activate_llm():
    try:
        # Initial prompt to start the conversation
        initial_prompt = "You are an engaging AI assistant designed to keep drowsy drivers alert through trivia and conversation. Your goal is to ask interesting questions, share fun facts, and maintain an engaging dialogue. Keep your responses concise and energetic. Start with a fun trivia question."

        # Process with Gemini
        model = genai.GenerativeModel("gemini-1.5-flash")
        llm_response = model.generate_content(initial_prompt)
        response_text = llm_response.text.strip()

        # Add AI response to conversation history
        conversation_history.append(f"AI: {response_text}")

        return jsonify({
            "gemini_response": response_text
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/llm-drive', methods=['POST'])
def llm_drive():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']

    try:
        # Transcribe the audio using AssemblyAI
        transcript = transcriber.transcribe(audio_file)
        user_input = transcript.text

        # Add user input to conversation history
        conversation_history.append(f"Human: {user_input}")

        # Prepare the prompt for Gemini with conversation history and instructions
        prompt = f"""You are an engaging AI assistant designed to keep drowsy drivers alert through trivia and conversation. Your goal is to ask interesting questions, share fun facts, and maintain an engaging dialogue. Keep your responses concise and energetic.

Here's the conversation so far: {' '.join(conversation_history)}

Now, respond to the user's last input and then do one of the following:
1. Ask a follow-up question related to the topic.
2. Share an interesting fact and ask for the user's opinion.
3. Start a new topic with a trivia question.
4. Tell a short joke and ask if they've heard a similar one.

Always end your response with a question or prompt to keep the conversation going. Be varied and unpredictable in your approach.

AI: """

        # Process with Gemini
        model = genai.GenerativeModel("gemini-pro")
        llm_response = model.generate_content(prompt)
        response_text = llm_response.text.strip()

        # If the AI doesn't end with a question, add one
        if not response_text.endswith('?'):
            follow_up_questions = [
                "What do you think about that?",
                "Have you ever experienced something similar?",
                "Did you know that? What's your take on it?",
                "What's your favorite topic to discuss while driving?",
                "If you could instantly learn one new skill, what would it be?",
                "What's the most interesting place you've ever visited?",
                "If you could have dinner with any historical figure, who would it be and why?"
            ]
            response_text += f" {random.choice(follow_up_questions)}"

        # Add AI response to conversation history
        conversation_history.append(f"AI: {response_text}")

        # Keep only the last 10 exchanges to maintain a reasonable context window
        if len(conversation_history) > 20:
            conversation_history.pop(0)
            conversation_history.pop(0)

        return jsonify({
            "transcript": user_input,
            "gemini_response": response_text
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

async def text_to_speech(text):
    try: 
        tts_options = {
            'text': text,
            'voice': 'en-US-Wavenet-D', 
            'model': 'general',  
            'punctuate': True, 
        }
 
        response = await deepgram.tts.synthesize(tts_options)

        return response.content  
    except Exception as e:
        print(f"Error during text-to-speech conversion: {str(e)}")
        return None

if __name__ == '__main__':
    app.run(debug=True)