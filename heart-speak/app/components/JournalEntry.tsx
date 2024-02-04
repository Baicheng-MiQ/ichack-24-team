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

const customScrollStyles = {
  scrollbarWidth: "thin",
  scrollbarColor: "#4299e1 #e2e8f0", // Use your blue shade for the thumb and track color respectively
};

const customScrollStylesWebkit = {
  "&::-webkit-scrollbar": {
    width: "8px", // Adjust scrollbar width
    height: "8px", // Adjust scrollbar height for horizontal scroll
  },
  "&::-webkit-scrollbar-track": {
    background: "#e2e8f0", // Background of the track
    borderRadius: "100px", // Rounded corners of the track
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#4299e1", // Your blue color
    borderRadius: "100px", // Rounded corners of the thumb
    border: "3px solid #e2e8f0", // Creates padding around the scrollable content
  },
};

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

  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true); // Start loading

    const transcript = notifs.map((notif) => notif.message).join(" ");
    try {
      const response = await axios.post(
        "http://localhost:8000/getJournalDirections",
        {
          transcript: transcript,
        }
      );

      const guidance = response.data; // Adjust based on the actual response structure
      const further = guidance.choices[0].message.content; // Adjust based on the actual response structure
      setCurrentEntry(
        (currentEntry) => `${currentEntry}\n\nGuidance:\n${further}`
      );

      handleSave();
    } catch (error) {
      console.error("Error fetching guidance:", error);
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <div className="flex w-full max-w-4xl">
      <div className="flex-grow flex flex-col items-center">
        {/* input area for journaling */}
        <WeekCalendar onDaySelect={handleDaySelect} />

        <style>
          {`
        textarea::-webkit-scrollbar {
          width: 12px;
        }

        textarea::-webkit-scrollbar-track {
          background: #f0f1f5;
          border-radius: 100px;
        }

        textarea::-webkit-scrollbar-thumb {
          background-color: #4299e1; /* Scroll thumb color */
          border-radius: 100px;
          border: 3px solid #f0f1f5; /* Creates padding around the scroll thumb */
        }

        /* For Firefox */
        textarea {
          scrollbar-width: thin;
          scrollbar-color: #4299e1 #f0f1f5;
        }
      `}
        </style>

        <textarea
          className="w-full h-96 p-4 rounded-md shadow-sm resize-none custom-scroll textarea textarea-info text-white"
          placeholder="Type something..."
          value={currentEntry}
          onChange={handleTextChange}
        ></textarea>
        <button
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          onClick={handleGetNotifsForThisDay}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? "Loading..." : "Get More Guidance"}
        </button>
      </div>

      {/* Notifications side section */}
      <aside
        className="w-64 h-96 overflow-y-auto p-4"
        style={customScrollStyles}
      >
        <style>
          {`
            aside::-webkit-scrollbar {${customScrollStylesWebkit["&::-webkit-scrollbar"].width};}
            aside::-webkit-scrollbar-track {background: ${customScrollStylesWebkit["&::-webkit-scrollbar-track"].background}; border-radius: ${customScrollStylesWebkit["&::-webkit-scrollbar-track"].borderRadius};}
            aside::-webkit-scrollbar-thumb {background: ${customScrollStylesWebkit["&::-webkit-scrollbar-thumb"].backgroundColor}; border-radius: ${customScrollStylesWebkit["&::-webkit-scrollbar-thumb"].borderRadius}; border: ${customScrollStylesWebkit["&::-webkit-scrollbar-thumb"].border};}
          `}
        </style>
        {notifs.map((notification) => (
          <button
            key={notification.id}
            className="p-4 mb-4 bg-gray-100 rounded-lg shadow"
            onClick={() => setCurrentEntry((currentEntry) => `${currentEntry}\n\n${notification.message}`)}
          >
            <p className="text-black">{notification.message}</p>
          </button>
        ))}
      </aside>
    </div>
  );
};

export default JournalEntry;
