import React, { useState, useEffect } from "react";

const ScheduleTable = ({ schedule, currentDay }) => {
  const [data, setData] = useState([]);
  const [totalHours, setTotalHours] = useState(0); // To hold the user-entered total hours

  // Load saved schedule for the current day from localStorage on component mount or day change
  useEffect(() => {
    const savedSchedule = localStorage.getItem(`schedule-${currentDay}`);
    if (savedSchedule) {
      setData(JSON.parse(savedSchedule));
    } else {
      setData(schedule); // If no saved schedule, use the default
    }
  }, [currentDay, schedule]);

  // Save the current day's schedule to localStorage
  const handleSave = () => {
    localStorage.setItem(`schedule-${currentDay}`, JSON.stringify(data));
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

  // Handle change in total hours input
  const handleTotalHoursChange = (e) => {
    const value = parseFloat(e.target.value);
    setTotalHours(isNaN(value) ? 0 : value);
  };

  // Calculate adjusted hours based on total hours (x)
  const adjustedData = data.map((item) => ({
    ...item,
    adjustedHours: (totalHours*60 / 8) * item.hours,
  }));

  return (
    <div>
      <h2>Schedule for {currentDay}</h2>

      {/* Input for total hours */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Total Intended Working Hours:
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
            <th>Time Allocation(in hr)</th>
            <th>Adjusted Hours (in min)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {adjustedData.map(({ id, day, activity, hours, adjustedHours, status }) => (
            <tr key={id}>
              <td>{day}</td>
              <td>{activity}</td>
              <td>{hours}</td>
              <td>{adjustedHours.toFixed(2)}</td>
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
