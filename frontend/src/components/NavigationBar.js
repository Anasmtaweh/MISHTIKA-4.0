import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

function NavigationBar() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/';
    const isSignupPage = location.pathname === '/signup';
    const token = localStorage.getItem('token');

    let isLoggedIn = !!token;

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload(); // Refresh the page to ensure protected routes are updated
    };

    return (
        !isLoginPage && !isSignupPage && (
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">Pet Project</Navbar.Brand>
                    <Nav className="me-auto">
                        {!isLoggedIn && <Nav.Link as={Link} to="/">Login</Nav.Link>}
                        {!isLoggedIn && <Nav.Link as={Link} to="/signup">Signup</Nav.Link>}
                        {isLoggedIn && (
                            <>
                                <Nav.Link as={Link} to="/petprofile">Pet Profile</Nav.Link>
                                <Nav.Link as={Link} to="/petform">Add Pet</Nav.Link>
                            </>
                        )}
                        <Nav.Link as={Link} to="/aichat">AI Chat</Nav.Link>
                        <Nav.Link as={Link} to="/scheduler">Scheduler</Nav.Link>
                    </Nav>
                    {isLoggedIn && (
                        <Button variant="light" onClick={handleLogout}>
                            Logout
                        </Button>
                    )}
                </Container>
            </Navbar>
        )
    );
}

export default NavigationBar;
