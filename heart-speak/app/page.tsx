"use client";

import Image from "next/image";
import LeftNavbar from "./components/LeftNavbar";
import JournalEntry from "./components/JournalEntry";
import WeekCalendar from "./components/WeekCalendar";
import { Main } from "next/document";
import MainPage from "./components/MainPage";
import TopNavbar from "./components/TopNavbar";
import Card from "./components/Card";
import AudioRecorder from "./components/AudioRecorder";
import { useState } from "react";
import { QuoteSentimentLocationTime } from "./types";

export default function Home() {
  const [highlights, setHighlights] = useState<string[]>([]);

  const [quoteSentimentLocationTimeArray, setQuoteSentimentLocationTimeArray] =
    useState<QuoteSentimentLocationTime[]>([]);

  return (
    <>
      {/* <TopNavbar /> */}
      <AudioRecorder
        highlights={highlights}
        setHighlights={setHighlights}
        qlst={quoteSentimentLocationTimeArray}
        sqslt={setQuoteSentimentLocationTimeArray}
      />
      <div className="flex flex-col items-center justify-center space-y-2 mt-4 w-full">
        {quoteSentimentLocationTimeArray.map((qslt, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 max-w-prose text-center bg-blue-100 rounded-lg shadow text-black"
          >
            {qslt.quote}
            <br />
            Sentiment: {qslt.sentiment.label}{" "}
            {(qslt.sentiment.score * 100).toFixed(2)}%
            <br />
            Location: {qslt.location}
            <br />
            Time: {new Date(qslt.time).toLocaleString()}
          </div>
        ))}
      </div>

      <Card />
      <div className="flex flex-col items-center justify-center px-6 md:px-20 py-24 min-h-screen">
        {/* WeekCalendar centered */}
        <div className="flex justify-center w-full mb-12"></div>

        {/* JournalEntry centered below WeekCalendar */}
        <div className="flex justify-center w-full">
          <JournalEntry />
          {/* <MainPage /> */}
        </div>
      </div>
    </>
  );
}
