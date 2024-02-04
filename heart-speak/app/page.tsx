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
import { QuoteSentimentLocationTime, Notification } from "./types";
import HeartRate from "./components/HeartRate";

export default function Home() {
  const [highlights, setHighlights] = useState<string[]>([]);

  const [quoteSentimentLocationTimeArray, setQuoteSentimentLocationTimeArray] =
    useState<QuoteSentimentLocationTime[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);

  return (
    <>
      {/* <TopNavbar /> */}
      <div className="flex min-h-screen">
        {/* Left side for AudioRecorder, quotes, and Card */}
        <HeartRate/>
        <div className="w-full md:w-1/2 flex flex-col items-center">

          <AudioRecorder
            highlights={highlights}
            setHighlights={setHighlights}
            qlst={quoteSentimentLocationTimeArray}
            sqslt={setQuoteSentimentLocationTimeArray}
          />
          <div className="mt-4 space-y-2">
            {quoteSentimentLocationTimeArray.length === 0 ? (
              <span className="loading-dots">Loading...</span>
            ) : (
              quoteSentimentLocationTimeArray.map((qslt, index) => (
                <div
                  key={index}
                  className="p-4 max-w-prose text-center bg-blue-100 rounded-lg shadow text-black"
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
              ))
            )}
          </div>
          <Card
            qslta={quoteSentimentLocationTimeArray}
            setJournalPrompts={setNotifs}
          />
        </div>

        {/* Right side for JournalEntry */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-start px-6 md:px-20 py-24">
          <JournalEntry notifs={notifs} setNotifs={setNotifs} />
        </div>
      </div>
    </>
  );
}
