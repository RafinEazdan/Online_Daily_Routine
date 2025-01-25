import React, { useState, useEffect } from "react";

const ScheduleTable = ({ schedule, currentDay }) => {
  const [data, setData] = useState([]);
  const [totalHours, setTotalHours] = useState(0);

  // Load saved schedule and totalHours for the current day
  useEffect(() => {
    const savedSchedule = localStorage.getItem(`schedule-${currentDay}`);
    const savedTotalHours = localStorage.getItem(`totalHours-${currentDay}`);
    if (savedSchedule) {
      setData(JSON.parse(savedSchedule));
    } else {
      setData(schedule); // Default schedule
    }

    if (savedTotalHours) {
      setTotalHours(parseFloat(savedTotalHours)); // Default total hours
    } else {
      setTotalHours(0);
    }
  }, [currentDay, schedule]);

  // Update adjusted hours in data when totalHours changes
  useEffect(() => {
    setData((prevData) =>
      prevData.map((item) => ({
        ...item,
        adjustedHours: (totalHours*60 / 8) * item.hours,
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
            <th>Time Allocation (Hours)</th>
            <th>Adjusted Hours (Minutes)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ id, day, activity, hours, adjustedHours, status }) => (
            <tr key={id}>
              <td>{day}</td>
              <td>{activity}</td>
              <td>{hours}</td>
              <td>{adjustedHours?.toFixed(2) || 0}</td>
              <td>
                <input
                  type="checkbox"
                  checked={status}
                  onChange={() => handleStatusChange(id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave} style={{ marginTop: "20px" }}>
        Save Schedule
      </button>
    </div>
  );
};

export default ScheduleTable;
