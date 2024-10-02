import React, { useState } from 'react';
import './ChatBot.css'; // Optional: Include CSS for styling

const ChatBot = () => {
    const [chatHistory, setChatHistory] = useState([]); // Store all messages
    const [isLoading, setIsLoading] = useState(false);
    const [userMessage, setUserMessage] = useState('');

    const sendMessage = async (message) => {
        setIsLoading(true); // Set loading state to true
    
        // Add user's message to chat history
        const newUserMessage = { user: message, bot: null }; // Create user message object
        setChatHistory((prev) => [...prev, newUserMessage]); // Add user message to history
    
        // Send the message to your backend API
        const response = await fetch('http://localhost:5000/api/chat', { // Updated endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
    
        if (!response.ok) { // Error handling
            console.error('Error fetching data:', response.statusText);
            setChatHistory((prev) => [
                ...prev,
                { user: message, bot: "Sorry, I couldn't reach the server." }
            ]);
            setIsLoading(false);
            return;
        }
    
        const data = await response.json();
    
        // Update chat history with AI response, ensuring proper object structure
        setChatHistory((prev) => {
            // Add bot's reply without duplicating the user's message
            return [...prev, { user: null, bot: data.reply }];
        });
    
        setIsLoading(false); // Set loading state to false
        setUserMessage(''); // Clear input field
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userMessage.trim()) {
            sendMessage(userMessage);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-window">
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`chat-message ${chat.user ? 'user' : 'bot'}`}>
                        {chat.user && <p>{chat.user}</p>}
                        {chat.bot && <p>{chat.bot}</p>}
                    </div>
                ))}
                {isLoading && <p className="loading">Loading...</p>}
            </div>
            <form onSubmit={handleSubmit} className="chat-form">
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="chat-input"
                />
                <button type="submit" className="send-button">Send</button>
            </form>
        </div>
    );
};

export default ChatBot;
