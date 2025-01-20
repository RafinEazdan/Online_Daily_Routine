import React, { useState, useEffect } from "react";

const ScheduleTable = ({ schedule, currentDay }) => {
  const [data, setData] = useState([]);

  // Fetch the global JSON file
  const fetchGlobalSchedule = async () => {
    const response = await fetch("https://raw.githubusercontent.com/<your-username>/<repo-name>/main/globalStatus.json");
    const globalData = await response.json();
    const filteredData = globalData.filter((item) => item.day === currentDay);
    setData(filteredData);
  };

  // Save updated schedule back to GitHub
  const saveGlobalSchedule = async () => {
    const updatedSchedule = schedule.map((item) => {
      const matched = data.find((d) => d.id === item.id);
      return matched || item;
    });

    const response = await fetch("/api/save-schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSchedule),
    });

    if (response.ok) {
      alert("Schedule saved globally!");
    }
  };

  useEffect(() => {
    fetchGlobalSchedule();
  }, [currentDay]);

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
      <button onClick={saveGlobalSchedule} style={{ marginTop: "20px" }}>
        Save Schedule
      </button>
    </div>
  );
};

export default ScheduleTable;
