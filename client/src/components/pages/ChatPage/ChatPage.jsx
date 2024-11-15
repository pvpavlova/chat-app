import React, { useState } from 'react';
import { TextField, IconButton, Avatar, Typography, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Sidebar from '../../organisms/SideBar/SideBar';
import './ChatPage.css';

const ChatPage = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: user.username,
        isOwn: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <Sidebar />
      <div className="chat-content">
        <div className="chat-header">
          <Avatar src={user.profilePicture || '/logo.webp'} />
          <Typography variant="h6" className="chat-title">
            Воображаемый друг
          </Typography>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <Box
              key={message.id}
              className={`message ${message.isOwn ? 'own-message' : 'other-message'}`}
            >
              <Typography className="message-text">{message.text}</Typography>
              <Typography className="message-time">{message.timestamp}</Typography>
            </Box>
          ))}
        </div>

        <div className="chat-input-container">
          <TextField
            variant="outlined"
            placeholder="Начните писать..."
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;