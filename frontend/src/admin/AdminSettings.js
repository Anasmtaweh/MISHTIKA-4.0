import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function AdminSettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/auth/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = response.data;
                setName(userData.username);
                setAge(userData.age);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError(err.response?.data?.message || 'An error occurred while fetching user data.');
            }
        };

        fetchUserData();
    }, [token]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            return;
        }

        try {
            await axios.put(
                'http://localhost:3001/admin/settings/password',
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Password updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            console.error('Error updating password:', err);
            // Access the error message from err.response.data.message
            setError(err.response?.data?.message || 'An error occurred while updating password.');
        }
    };
    const handleProfileChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await axios.put(
                'http://localhost:3001/admin/settings/profile',
                { username: name, age },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Profile updated successfully.');
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'An error occurred while updating profile.');
        }
    };

    return (
        <Container className="mt-5">
            <h1>Admin Settings</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <Form onSubmit={handlePasswordChange}>
                <h2>Change Password</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save Password Changes
                </Button>
            </Form>
            <Form onSubmit={handleProfileChange}>
                <h2>Change Profile</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save Profile Changes
                </Button>
            </Form>
        </Container>
    );
}

export default AdminSettings;
