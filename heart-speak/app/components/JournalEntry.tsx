import React, { useState } from "react";
import WeekCalendar from "./WeekCalendar";
import { EntryPromptsPair, JournalEntryType, Notification } from "../types";
import Card from "./Card";
import axios from "axios";

const notifications: Notification[] = [
  { id: 1, message: "Start by detailing what made you happy the morning" },
  {
    id: 2,
    message:
      "Consider the factors that contributed to this positive start to your day. Then move on to the stress you experienced around noon.",
  },
  {
    id: 3,
    message:
      "Try to understand what might have triggered it and how you could manage such situations more effectively",
  },
];

type JournalEntryProps = {
  notifs: Notification[];
  setNotifs: (notifs: Notification[]) => void;
};

const JournalEntry: React.FC<JournalEntryProps> = ({ notifs, setNotifs }) => {
  const [entriesAndNotifications, setEntriesAndNotifications] = useState<
    EntryPromptsPair[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentEntry, setCurrentEntry] = useState<string>("");

  const getNotifs = () => {
    if (!(notifs.length === 0)) {
      setNotifs(notifications);
    }
  };

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

  const handleGetNotifsForThisDay = async () => {
    // Concatenate all notification messages
    const transcript = notifs.map(notif => notif.message).join(' ');

    try {
      // Send the concatenated messages to the Flask endpoint
      const response = await axios.post('http://localhost:8000/getJournalDirections', {
        transcript: transcript
      });

      // Assuming the API returns a summary or guidance in the response
      const guidance = response.data; // Adjust based on the actual response structure
      console.log(guidance); // Do something with the guidance, e.g., display it in the UI

      // Optionally, update the current entry with the guidance received
    //   setCurrentEntry(currentEntry => `${currentEntry}\n\nGuidance:\n${guidance}`);
    } catch (error) {
      console.error("Error fetching guidance:", error);
    }
  };


  return (
    <div className="flex w-full max-w-4xl">
      <div className="flex-grow flex flex-col items-center">
        {/* input area for journaling */}
        <WeekCalendar onDaySelect={handleDaySelect} />

        <textarea
          className="w-full h-96 p-4 border border-gray-300 rounded-md shadow-sm resize-none"
          placeholder="Type something..."
          value={currentEntry} // Bind the textarea to the currentEntry state
          onChange={handleTextChange} // Update currentEntry state when typing
        ></textarea>
        <button
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleGetNotifsForThisDay}
        >
          Get More Guidance
        </button>
      </div>

      {/* Notifications side section */}
      <aside className="w-64 overflow-y-auto p-4 border-gray-200">
        {notifs.map((notification) => (
          <div
            key={notification.id}
            className="p-4 mb-4 bg-gray-100 rounded-lg shadow"
          >
            {notification.message}
          </div>
        ))}
      </aside>

      <div>

      </div>
    </div>
  );
};

export default JournalEntry;
