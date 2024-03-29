from openai import OpenAI
import constants

def get_transcription(dir):
    client = OpenAI(api_key=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)

    audio_file= open(dir, "rb")
    transcript = client.audio.transcriptions.create(
        model="whisper-1", 
        file=audio_file
    )
    return transcript


if __name__ == "__main__":
    dir = "src/audio_classification/tmp/ICHACK_denoised.wav"
    transcript = get_transcription(dir)
