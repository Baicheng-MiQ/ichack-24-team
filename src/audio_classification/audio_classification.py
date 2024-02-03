# import constants.py for api_key and other constants
import constants
import requests
from pydub import AudioSegment

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

'''
Load audio file given file name and call Wav2Vec2-Large-960h-Lv60 for audio transcription
Pass the transcribed text to distilbert-base-multilingual-cased-sentiments-student for sentiment classif
'''
def audio_sentiment_classification(audio_file):  
    transcribed_text_json = query(audio_file, "facebook/wav2vec2-base-960h")
    print(transcribed_text_json)
    assert "error" not in transcribed_text_json, "Transcription failed: " + str(transcribed_text_json.get("error"))

    sentiment_json = query(transcribed_text_json.get("text"), "lxyuan/distilbert-base-multilingual-cased-sentiments-student")
    assert "error" not in sentiment_json, "Sentiment Analysis failed: " + sentiment_json.get("error")
    return sentiment_json

if __name__ == "__main__":
    # flac_audio = AudioSegment.from_file("sample.flac", "flac")
    # flac_audio.export("sampleMp3.mp3", format="mp3")

    with open("test_audio.mp3", "rb") as file:
        file_bytes = file.read()
    print(audio_sentiment_classification(file_bytes))


