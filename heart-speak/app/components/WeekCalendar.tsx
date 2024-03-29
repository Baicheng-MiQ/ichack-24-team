"use client"
import React, { useState } from "react";
import { format, startOfWeek, addDays, getWeek, isSameDay } from "date-fns";

const WeekCalendar: React.FC<{ onDaySelect: (day: Date) => void }> = ({ onDaySelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onDayClick = (day: Date) => {
    setSelectedDate(day);
    onDaySelect(day);
  };

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    // Adjust startOfWeek to make the week start on Monday
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      days.push(
        <div
          className={`px-4 py-2 cursor-pointer ${
            isSameDay(day, selectedDate)
              ? "bg-blue-500 text-white"
              : "text-gray-700 bg-white"
          } rounded-full`}
          key={i}
          onClick={() => onDayClick(day)}
        >
          {format(day, dateFormat)}
        </div>
      );
    }

    return <div className="flex space-x-1">{days}</div>;
  };

  return (
    <div className="flex flex-col items-center space-x-4 p-4">
      <div className="font-semibold mb-4">Week {getWeek(currentDate, { weekStartsOn: 1 })}</div>
      {renderDays()}
    </div>
  );
};

export default WeekCalendar;
