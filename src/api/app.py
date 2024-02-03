from flask import Flask, request, jsonify
from datetime import datetime
from werkzeug.utils import secure_filename

import os

app = Flask(__name__)

ALLOWED_EXTENSIONS = {'wav', 'mp3', 'ogg', 'flac'}
UPLOAD_FOLDER = './'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/key_points', methods=['POST'])
def key_points():
    # POST request
    # Array of AudiuRecordings
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
    app.run(debug=True)