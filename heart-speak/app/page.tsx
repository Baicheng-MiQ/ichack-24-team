"use client";

import Image from "next/image";
import LeftNavbar from "./components/LeftNavbar";
import JournalEntry from "./components/JournalEntry";
import WeekCalendar from "./components/WeekCalendar";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 md:px-20 py-24 min-h-screen">
        {/* WeekCalendar centered */}
        <div className="flex justify-center w-full mb-12">
        </div>

        {/* JournalEntry centered below WeekCalendar */}
        <div className="flex justify-center w-full">
          <JournalEntry />
        </div>
      </div>
    </>
  );
}
