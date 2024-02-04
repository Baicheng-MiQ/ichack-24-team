import React, { useState } from "react";
import { QuoteSentimentLocationTime } from "../types";
import axios from "axios";
import { send } from "process";

// Define a type for the request body
type TranscriptionRequestBody = {
  transcript: string;
};

// Function to send a POST request to the '/transcription' endpoint
async function sendTranscription(
  transcript: string
): Promise<string | undefined> {
  console.log("Transcript:", transcript); // Log the transcript to the console

  try {
    const response = await axios.post("http://localhost:8000/getSummary", {
      transcript: transcript,
    });
    console.log("Response:", response);
    return response.data.choices[0].message;
  } catch (error) {
    console.error("Error sending transcription:", error);
  }

  return undefined; // Add a return statement for the case when an error occurs
}

const Card = ({ qslta }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [texts, setTexts] = useState([]); // Initialize as empty, will be filled with API data

  const [isVisible, setIsVisible] = useState(false); // State to control visibility

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + texts.length) % texts.length
    );
  };

  const fetchAndSetSummary = async () => {
    try {
      const summaries = await Promise.all(
        qslta.map(async (item) => {
          const requestData = {
            transcript: `Quote: ${item.quote} | Sentiment: ${
              item.sentiment.label
            } (${item.sentiment.score * 100}%) | Location: ${
              item.location
            } | Time: ${new Date(item.time).toLocaleString()}`,
          };
          const response = await axios.post(
            "http://localhost:8000/getSummary",
            requestData
          );
          console.log("Response:", response);
          return response.data.choices[0].message.content;
        })
      );

      for (let i = 0; i < summaries.length; i++) {
        console.log(summaries[i]);
      }

      setTexts(summaries);
      setIsVisible(true); // Show the card after the summaries are fetched
    } catch (error) {
      console.error("Error fetching summaries:", error);
    }
  };

  const handleShow = () => {
    fetchAndSetSummary();
    setIsVisible(true);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        {isVisible && ( // This will only render the content if isVisible is true
          <div className="flex items-center">
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
              <div className="flex items-center">
                <button
                  className="px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-800 font-bold rounded-full shadow-lg"
                  onClick={handlePrev}
                >
                  &#8592;
                </button>
                <div className="flex flex-col items-center justify-center border-2 border-gray-300 p-8 w-96  bg-white rounded-xl shadow-xl mx-4 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                  <p className="text-lg text-gray-800 font-medium">
                    {texts[currentIndex]}
                  </p>
                  <div className="flex mt-4">
                    <button className="mx-2 px-6 py-2 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 shadow transition duration-150 ease-in-out">
                      ✓
                    </button>
                    <button className="mx-2 px-6 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 shadow transition duration-150 ease-in-out">
                      ✕
                    </button>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-gradient-to-l from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-800 font-bold rounded-full shadow-lg"
                  onClick={handleNext}
                >
                  &#8594;
                </button>
              </div>
            </div>
          </div>
        )}

        {!isVisible && ( // This will render the "Show" button if isVisible is false
          <button
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-full shadow-lg hover:bg-blue-600"
            onClick={handleShow} // Set isVisible to true when button is clicked
          >
            Show
          </button>
        )}
      </div>
    </>
  );
};

export default Card;
