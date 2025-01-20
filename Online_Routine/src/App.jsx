import React, { useState, useEffect } from "react";
import ScheduleTable from "./components/ScheduleTable";
import scheduleData from "./data/scheduleData";
import "./App.css";

const App = () => {
  const [currentDay, setCurrentDay] = useState("");
  const [filteredSchedule, setFilteredSchedule] = useState([]);

  // Function to get the current day as a string
  const getCurrentDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = 6; //new Date().getDay(); // Returns 0-6 (Sunday = 0)
    return days[today];
  };

  // Filter schedule based on the current day
  useEffect(() => {
    const day = getCurrentDay();
    setCurrentDay(day);
    const scheduleForDay = scheduleData.filter((item) => item.day === day);
    setFilteredSchedule(scheduleForDay);
  }, []);

  return (
    <div className="App">
      <h1>Weekly Schedule</h1>
      {filteredSchedule.length > 0 ? (
        <ScheduleTable schedule={filteredSchedule} currentDay={currentDay} />
      ) : (
        <p>No activities scheduled for today!</p>
      )}
    </div>
  );
};

export default App;
