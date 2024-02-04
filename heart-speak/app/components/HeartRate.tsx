import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HeartRateMonitor = () => {
  const [heartRate, setHeartRate] = useState(Number);
  const [timestamp, setTimestamp] = useState('');

  const fetchHeartRateData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get_heart_rate');
      const esteem_response = response.data.data.heart_rate - 15
      console.log(response);
      setHeartRate(esteem_response); // Assuming the response has a heartRate field
      setTimestamp(new Date().toLocaleTimeString()); // Update the timestamp with the current time
    } catch (error) {
      console.error('Error fetching heart rate data:', error);
    }
  };

  useEffect(() => {
    // Set up an interval to fetch heart rate data every 10 seconds
    const interval = setInterval(fetchHeartRateData, 3000);
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold">Current Heart Rate</h2>
      <div className="mt-2">
        {/* <div>Heart Rate: <p>{heartRate ? `${heartRate}` : 'Loading...'}</p> */}
        <span className="countdown font-mono text-6xl">
          <span style={{"--value":heartRate}}></span>
        </span>

      </div>
        <div>Time: {timestamp}</div>
      </div>
    // </div>
  );
};

export default HeartRateMonitor;
