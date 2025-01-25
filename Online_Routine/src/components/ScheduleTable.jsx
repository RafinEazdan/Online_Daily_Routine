import React, { useState, useEffect } from "react";

const ScheduleTable = ({ schedule, currentDay }) => {
  const [data, setData] = useState([]);
  const [totalHours, setTotalHours] = useState(8);
  const bellSound = new Audio("/bell.mp3"); // Reference to the bell sound

  // Load saved schedule and totalHours for the current day
  useEffect(() => {
    const savedSchedule = localStorage.getItem(`schedule-${currentDay}`);
    const savedTotalHours = localStorage.getItem(`totalHours-${currentDay}`);
    if (savedSchedule) {
      setData(JSON.parse(savedSchedule));
    } else {
      setData(
        schedule.map((task) => ({
          ...task,
          remainingTime: task.adjustedHours ? task.adjustedHours * 60 : 0, // Initialize remainingTime in minutes
          isRunning: false, // Timer state
        }))
      );
    }

    if (savedTotalHours) {
      setTotalHours(parseFloat(savedTotalHours));
    } else {
      setTotalHours(8);
    }
  }, [currentDay, schedule]);

  // Update adjusted hours in data when totalHours changes
  useEffect(() => {
    setData((prevData) =>
      prevData.map((item) => ({
        ...item,
        adjustedHours: (totalHours / 8) * item.hours * 60,
        remainingTime: (totalHours / 8) * item.hours * 60 * 60, // Adjust remainingTime in minutes
      }))
    );
  }, [totalHours]);

  // Save schedule and totalHours to localStorage
  const handleSave = () => {
    localStorage.setItem(`schedule-${currentDay}`, JSON.stringify(data));
    localStorage.setItem(`totalHours-${currentDay}`, totalHours.toString());
    alert(`Schedule for ${currentDay} saved successfully!`);
  };

  // Handle checkbox toggle
  const handleStatusChange = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  // Handle total hours input change
  const handleTotalHoursChange = (e) => {
    const value = parseFloat(e.target.value);
    setTotalHours(isNaN(value) ? 0 : value);
  };

  // Timer logic
  const handleStart = (id) => {
    setData((prevData) =>
      prevData.map((task) =>
        task.id === id
          ? {
              ...task,
              isRunning: true,
            }
          : task
      )
    );
  };

  const handlePause = (id) => {
    setData((prevData) =>
      prevData.map((task) =>
        task.id === id
          ? {
              ...task,
              isRunning: false,
            }
          : task
      )
    );
  };

  // Countdown logic (runs every second for active timers)
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((task) => {
          if (task.isRunning && task.remainingTime > 0) {
            return {
              ...task,
              remainingTime: task.remainingTime - 1, // Decrement by 1 second
            };
          } else if (task.isRunning && task.remainingTime <= 0) {
            bellSound.play(); // Play the bell sound when the task is completed
            return {
              ...task,
              isRunning: false, // Stop timer if it reaches 0
            };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [bellSound]);

  return (
    <div>
      <h2>Schedule for {currentDay}</h2>

      {/* Input for total hours */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Total Hours (x):
          <input
            type="number"
            value={totalHours}
            onChange={handleTotalHoursChange}
            style={{ marginLeft: "10px", width: "100px" }}
          />
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Activity</th>
            <th>Time Allocation (hr)</th>
            <th>Adjusted Hours (min)</th>
            <th>Remaining Time (mm:ss)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(
            ({
              id,
              day,
              activity,
              hours,
              adjustedHours,
              remainingTime,
              status,
              isRunning,
            }) => (
              <tr key={id}>
                <td>{day}</td>
                <td>{activity}</td>
                <td>{hours}</td>
                <td>{adjustedHours?.toFixed(2) || 0}</td>
                <td>
                  {Math.floor(remainingTime / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(remainingTime % 60).toString().padStart(2, "0")}
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={status}
                    onChange={() => handleStatusChange(id)}
                  />
                </td>
                <td>
                  {!isRunning && remainingTime > 0 ? (
                    <button onClick={() => handleStart(id)}>Start</button>
                  ) : isRunning ? (
                    <button onClick={() => handlePause(id)}>Pause</button>
                  ) : (
                    <button disabled>Completed</button>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <button onClick={handleSave} style={{ marginTop: "20px" }}>
        Save Schedule
      </button>
    </div>
  );
};

export default ScheduleTable;
