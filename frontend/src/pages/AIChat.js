import React, { useEffect } from 'react'; // Remove useState
import Container from 'react-bootstrap/Container';

function AIChat() {
    useEffect(() => {
        document.title = "MISHTIKA - AI Chat";
    }, []);
    return (
       
        <Container className="mt-5">
            <h1>AI Chat Page</h1>
            <div>
                {/* Chat Bar will go here */}
                <p>Chat Bar</p>
            </div>
        </Container>
        
    );
}

export default AIChat;
