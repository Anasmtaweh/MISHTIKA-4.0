import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
function AdminDashboard() {
    useEffect(() => {
        document.title = "MISHTIKA - Admin Dashboard";
    }, []);

    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/admin/dashboard', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDashboardData(response.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.response?.data?.message || 'An error occurred while fetching dashboard data.');
            }
        };

        fetchDashboardData();
    }, [token]);

    if (error) {
        return (
            <Container className="mt-5">
                <div className="alert alert-danger">{error}</div>
            </Container>
        );
    }

    if (!dashboardData) {
        return (
            <Container className="mt-5">
                <p>Loading dashboard data...</p>
            </Container>
        );
    }

    return (
        
        <Container className="mt-5">
            <h1>Admin Dashboard</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total Users</td>
                        <td>{dashboardData.totalUsers}</td>
                    </tr>
                    <tr>
                        <td>Total Pets</td>
                        <td>{dashboardData.totalPets}</td>
                    </tr>
                    <tr>
                        <td>Active Users</td>
                        <td>{dashboardData.activeUsers}</td>
                    </tr>
                </tbody>
            </Table>

            <h2>Recent Activity</h2>
            <ul>
                {dashboardData.recentActivity.map((activity, index) => (
                    <li key={index}>
                        {activity.type} - {activity.details} ({new Date(activity.timestamp).toLocaleString()})
                    </li>
                ))}
            </ul>
        </Container>
        
    );
}

export default AdminDashboard;
