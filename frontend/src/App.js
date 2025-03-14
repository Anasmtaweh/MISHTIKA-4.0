import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PetProfile from './pages/PetProfile';
import ProtectedRoute from './components/ProtectedRoute';
import PetForm from './pages/PetForm';
import NavigationBar from './components/NavigationBar';
import AIChat from './pages/AIChat';
import Scheduler from './pages/Scheduler';
import EditPet from './pages/EditPet';
import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';

function App() {
    return (
        <BrowserRouter>
            <NavigationBar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected routes for regular users */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/petprofile" element={<PetProfile />} />
                    <Route path="/petform" element={<PetForm />} />
                    <Route path="/aichat" element={<AIChat />} />
                    <Route path="/scheduler" element={<Scheduler />} />
                    <Route path="/editpet/:petId" element={<EditPet />} />
                </Route>

                {/* Protected route for admins */}
                <Route element={<ProtectedRoute isAdminRoute={true} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
