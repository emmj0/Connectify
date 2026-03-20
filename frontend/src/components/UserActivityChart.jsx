import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const UserActivityChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchActivityData = async () => {
            try {
                const res = await axios.get('http://localhost:5003/api/admin/activity-summary');
                // Map data to expected chart format
                const chartData = res.data.map(entry => ({
                    date: entry._id,
                    logins: entry.logins
                }));
                setData(chartData);
            } catch (err) {
                console.error("Failed to fetch activity data:", err);
            }
        };

        fetchActivityData();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow p-6 mt-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">User Login Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserActivityChart;
