import React, { useState } from 'react';


const Card = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const texts = [
      "We think, based on your data, you felt happy at Imperial at 2:00.",
      "you felt depressed at Imperial at 2:00",
      "you felt sad at Imperial at 2:00",
      // Add more strings as needed
    ];
  
    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    };
  
    const handlePrev = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + texts.length) % texts.length);
    };
  
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="flex items-center">
          <button
            className="px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-800 font-bold rounded-full shadow-lg"
            onClick={handlePrev}
          >
            &#8592;
          </button>
          <div className="flex flex-col items-center justify-center border-2 border-gray-300 p-8 w-96 h-60 bg-white rounded-xl shadow-xl mx-4 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
            <p className="text-lg text-gray-800 font-medium">{texts[currentIndex]}</p>
            <div className="flex mt-4">
              <button className="mx-2 px-6 py-2 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 shadow transition duration-150 ease-in-out">✓</button>
              <button className="mx-2 px-6 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 shadow transition duration-150 ease-in-out">✕</button>
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
    );
  };
  
  export default Card;