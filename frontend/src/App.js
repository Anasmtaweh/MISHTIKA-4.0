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

function App() {
    return (
        <BrowserRouter>
            <NavigationBar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/petprofile" element={<PetProfile />} />
                    <Route path="/petform" element={<PetForm />} />
                    <Route path="/aichat" element={<AIChat />} />
                    <Route path="/scheduler" element={<Scheduler />} />
                    <Route path="/editpet/:petId" element={<EditPet />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
