import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HeartRateMonitor = () => {
  const [heartRate, setHeartRate] = useState(null);
  const [timestamp, setTimestamp] = useState('');

  const fetchHeartRateData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get_heart_rate');
      setHeartRate(response.data.heartRate); // Assuming the response has a heartRate field
      setTimestamp(new Date().toLocaleTimeString()); // Update the timestamp with the current time
    } catch (error) {
      console.error('Error fetching heart rate data:', error);
    }
  };

  useEffect(() => {
    // Set up an interval to fetch heart rate data every 10 seconds
    const interval = setInterval(fetchHeartRateData, 10000);
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold">Current Heart Rate</h2>
      <div className="mt-2">
        <div>Heart Rate: {heartRate ? `${heartRate} bpm` : 'Loading...'}</div>
        <div>Time: {timestamp}</div>
      </div>
    </div>
  );
};

export default HeartRateMonitor;
