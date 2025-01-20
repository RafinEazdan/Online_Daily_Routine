import React, { useState, useEffect } from "react";

const ScheduleTable = ({ schedule, currentDay }) => {
  const [data, setData] = useState([]);

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

  return (
    <div>
      <h2>Schedule for {currentDay}</h2>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Activity</th>
            <th>Time Allocation (Hours)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ id, day, activity, hours, status }) => (
            <tr key={id}>
              <td>{day}</td>
              <td>{activity}</td>
              <td>{hours}</td>
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
