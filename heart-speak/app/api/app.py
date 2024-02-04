from flask import Flask, request, jsonify, render_template, redirect
from datetime import datetime
from werkzeug.utils import secure_filename
import constants
import os
import requests
from pydub import AudioSegment
import openai
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all routes and origins
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

ALLOWED_EXTENSIONS = {'wav', 'mp3', 'ogg', 'flac'}
UPLOAD_FOLDER = './'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def get_api_url(model_name):
    return f"https://api-inference.huggingface.co/models/{model_name}"

api_key = constants.hugging_face_api_key
headers = {"Authorization": f"Bearer {api_key}"}

def query(payload, model_name):
    try:
        response = requests.post(get_api_url(model_name), headers=headers, data=payload)
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)
    
    return response.json()

def audio_sentiment_classification(audio_file):  
    transcribed_text_json = query(audio_file, "facebook/wav2vec2-base-960h")
    print(transcribed_text_json)
    assert "error" not in transcribed_text_json, "Transcription failed: " + str(transcribed_text_json.get("error"))

    sentiment_json = query(transcribed_text_json.get("text"), "lxyuan/distilbert-base-multilingual-cased-sentiments-student")
    assert "error" not in sentiment_json, "Sentiment Analysis failed: " + sentiment_json.get("error")
    return [transcribed_text_json, sentiment_json]

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_transcription(dir):
    client = openai.OpenAI(api_key=constants.openai_api_key)

    audio_file= open(dir, "rb")
    transcript = client.audio.transcriptions.create(
        model="whisper-1", 
        file=audio_file
    )
    return transcript


def get_sentiment(dir):
    with open(dir, "rb") as file:
        file_bytes = file.read()
    return audio_sentiment_classification(file_bytes)


@app.route('/')
def index():
    return render_template("index.html", transcription="Original")
    
@app.route('/upload2', methods=['GET', 'POST'])
def upload2():
    if 'recording' not in request.files:
        return 'No file part', 400
    file = request.files["recording"]
    if file.filename == '':
        return 'No selected file', 400
    if file:
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        return redirect('/upload3')

@app.route('/upload3', methods=['GET', 'POST'])
def upload3():
    with open("./audio.ogg", "rb") as file:
        file_bytes = file.read()
    #transcription = audio_sentiment_classification(file_bytes)[0]['text']
    transcription = get_transcription("./audio.ogg")
    sentiment_json = query(transcription.text, "lxyuan/distilbert-base-multilingual-cased-sentiments-student")

    return jsonify({'text': transcription.text, 'sentiment': sentiment_json})


@app.route('/key_points', methods=['POST'])
def key_points():
    # POST request
    # Array of AudioRecordings
    # in each AudioRecording, has
    # timestamp, geolocation, and audio
    timestamp = request.form.get('timestamp', None)
    geolocation = request.form.get('geolocation', None)
    

    # Convert timestamp string to datetime object if needed
    if timestamp:
        timestamp = datetime.fromisoformat(timestamp)

    # Handling the file upload
    audio_file = request.files['audio']
    if audio_file and allowed_file(audio_file.filename):
        filename = secure_filename(audio_file.filename)
        print(audio_file.filename)
        audio_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))


    # Dummy keypoints, replace with actual analysis of the audio file
    keypoints = ["keypoint1", "keypoint2", "keypoint3"]

    # Return the keypoints as JSON
    return jsonify({"keypoints": keypoints})


if __name__ == "__main__":
    app.run(port=8000, debug=True)
#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