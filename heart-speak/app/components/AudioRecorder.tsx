import React, { useState, useRef } from "react";
import axios from "axios";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const audioBlobUrl = useRef<string | null>(null);
  const [transcription, setTranscription] = useState<string>("");

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.onstart = () => {
          setIsRecording(true);
          console.log("Recording started");
        };
        recorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop()); // Stop the stream tracks to turn off the microphone
          console.log("Recording stopped");
        };
        recorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            audioBlobUrl.current = URL.createObjectURL(event.data);
            await sendAudioToServer(event.data);
          }
        };
        recorder.start();
        setMediaRecorder(recorder);
      })
      .catch(console.error);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("recording", audioBlob, "audio.ogg");

    try {
      const response = await axios.post(
        "http://localhost:8000/upload2",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Transcription:", response.data);
      setTranscription(response.data.text.text);
    } catch (error) {
      console.error("Error sending audio to server:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-5">
      <button
        onClick={startRecording}
        disabled={isRecording}
        className={`px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 ${
          isRecording && "cursor-not-allowed opacity-50"
        }`}
      >
        Start Recording
      </button>
      <button
        onClick={stopRecording}
        disabled={!isRecording}
        className={`px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 ${
          !isRecording && "cursor-not-allowed opacity-50"
        }`}
      >
        Stop Recording
      </button>
      {audioBlobUrl.current && (
        <audio src={audioBlobUrl.current} controls className="mt-4" />
      )}
      {transcription && (
        <div className="mt-4 p-4 max-w-prose text-left bg-gray-100 rounded-lg shadow text-black">
          Transcription: {transcription}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
