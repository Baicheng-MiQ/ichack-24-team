import React, { useState } from "react";
import WeekCalendar from "./WeekCalendar";
import { EntryPromptsPair, Notification } from "../types";

const MainPage: React.FC = () => {
  const [entriesAndNotifications, setEntriesAndNotifications] = useState<
    EntryPromptsPair[]
  >([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentEntry, setCurrentEntry] = useState<string>("");

  const handleDaySelect = (day: Date) => {
    setSelectedDate(day);
    const entry = entriesAndNotifications.find(
      (entryPair) => entryPair.entry.date.toDateString() === day.toDateString()
    );
    setCurrentEntry(entry ? entry.entry.content : "");
    setNotifs(entry ? entry.prompts : []);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentEntry(e.target.value);
    handleSave();
  };

  const handleSave = () => {
    const entryIndex = entriesAndNotifications.findIndex(
      (entry) => entry.entry.date.toDateString() === selectedDate.toDateString()
    );
    if (entryIndex >= 0) {
      // Update existing entry
      const updatedEntries = [...entriesAndNotifications];
      updatedEntries[entryIndex] = {
        ...updatedEntries[entryIndex],
        entry: {
          ...updatedEntries[entryIndex].entry,
          content: currentEntry,
        },
        prompts: notifs,
      };
      setEntriesAndNotifications(updatedEntries);
    } else {
      // Add new entry
      const newEntry: EntryPromptsPair = {
        id: entriesAndNotifications.length + 1,
        entry: {
          id: entriesAndNotifications.length + 1,
          date: selectedDate,
          content: currentEntry,
        },
        prompts: notifs,
      };
      setEntriesAndNotifications([...entriesAndNotifications, newEntry]);
    }
  };

  return (
    <div className="flex w-full max-w-4xl">
      <div className="flex-grow flex flex-col items-center">
        {/* input area for journaling */}
        {/* <WeekCalendar onDaySelect={handleDaySelect} /> */}
        <p
          style={{
            fontSize: "35x",
            fontWeight: "bold",
            color: "#333",
            alignItems: "flex-end",
          }}
        >
          Today's Journal
        </p>

        <textarea
          className="w-full h-96 p-4 border border-gray-300 rounded-md shadow-sm resize-none"
          placeholder="Type something..."
          value={currentEntry}
          onChange={handleTextChange}
        ></textarea>
      </div>

      {/* Box for displaying journal entries */}

      <div className="w-64 h-96 p-4 border-gray-200 ">
        {/* Add your content here */}
      </div>
    </div>
  );
};

export default MainPage;
