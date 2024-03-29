import React, { useState, useRef } from "react";
import axios from "axios";
import { QuoteSentimentLocationTime } from "../types";

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve(`Lat: ${latitude}, Long: ${longitude}`);
      },
      (error) => {
        reject("Unable to retrieve your location");
      }
    );
  });
};

// Function to get the current position
function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

// Function to use the obtained coordinates to make an Axios request
async function fetchGeolocationData() {
  try {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;

    const mapResponse = await axios.get(`http://localhost:8000/geolocation`, {
      params: {
        lat: latitude,
        lng: longitude,
      },
    });
    const data = mapResponse.data; // The response from the Flask server
    return data.results[5].formatted_address; // Return the formatted address
    console.log(data); // Do something with the data
  } catch (error) {
    console.error("Error:", error);
  }
}

const AudioRecorder: React.FC<{
  highlights: string[];
  setHighlights: React.Dispatch<React.SetStateAction<string[]>>;
  qlst: QuoteSentimentLocationTime[];
  sqslt: React.Dispatch<React.SetStateAction<QuoteSentimentLocationTime[]>>;
}> = ({ highlights, setHighlights, qlst, sqslt }) => {
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
      //   console.log("Transcription:", response.data);
      setTranscription(response.data.text);
      const newTranscription = response.data.text;
      // Update the highlights array with the new transcription
      setHighlights((prevHighlights) => [...prevHighlights, newTranscription]);

      // Get the current location and time
      fetchGeolocationData().then((location: unknown) => {
        const currentTime: string = new Date().toISOString(); // ISO string format of current time

        if (response.data.sentiment[0] == undefined) {
          sqslt((prev) => [
            ...prev,
            {
              quote: newTranscription,
              sentiment: {
                label: "neutral",
                score: 0.5,
              }, // Default sentiment
              location: location as string, // Now location is a string like "Lat: xx.xx, Long: yy.yy"
              time: currentTime, // Current time in ISO string format
            },
          ]);
        } else {
          sqslt((prev) => [
            ...prev,
            {
              quote: newTranscription,
              sentiment: response.data.sentiment[0][0] || {
                label: "neutral",
                score: 0.5,
              }, // Default sentiment
              location: location as string, // Now location is a string like "Lat: xx.xx, Long: yy.yy"
              time: currentTime, // Current time in ISO string format
            },
          ]);
        }
      });

      console.log(response.data);
    } catch (error) {
      console.error("Error sending audio to server:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-5 pt-24 pb-2">
      <button
        onClick={startRecording}
        disabled={isRecording}
        className={`px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 ${
          isRecording && "cursor-not-allowed opacity-50"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path d="M480-280q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm0 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </svg>
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
        <div className="p-4 max-w-prose text-left bg-blue-900 rounded-lg shadow text-white text-lg">
          {transcription}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
