from pydub import AudioSegment
import os
from Denoise.denoise import AudioDeNoise 


def denoise(source_dir, export_dir):
    audioDenoiser = AudioDeNoise(inputFile=source_dir)
    audioDenoiser.deNoise(outputFile=export_dir)

def convert_to_wav(source, converted):
    os.system(f"ffmpeg -y -i {source} -acodec pcm_s16le -ar 16000 -ac 1 {converted} -hide_banner -loglevel error")
    print(f"Converted {source} to {converted}")

if __name__ == "__main__":
    # Convert M4A to WAV for processing (Assuming `ffmpeg` is installed and accessible)
    source = "src/audio_processing/ICHACK.mp3"
    converted = "src/audio_processing/tmp/ICHACK.wav"
    denoised = "src/audio_processing/tmp/ICHACK_denoised.wav"
    convert_to_wav(source, converted)
    denoise(converted, denoised)
