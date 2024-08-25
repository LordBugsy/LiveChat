import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import styles from './LiveChat.module.css';
import { DataContext } from '../DataProvider';

// images
import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';

const LiveChat = () => {
    const [messages, setMessages] = useState([]);
    const [messageToSend, setMessageToSend] = useState('');
    const { localUserId, messageCount, updateMessageCount } = useContext(DataContext);
    
    const chatEndRef = useRef(null); // a reference to track the bottom of the chat

    const updateInput = (event) => {
        const button = document.getElementById('button');
        const value = event.target.value;

        if (value.trim().length === 0) button.classList.add(styles.disabled);
        else button.classList.remove(styles.disabled);

        setMessageToSend(value);
    };

    const renderProfileImage = (profileColour) => {
        profileColour = parseInt(profileColour);
        switch (profileColour) {
            case 1:
                return img1;
            case 2:
                return img2;
            case 3:
                return img3;
            case 4:
                return img4;
            case 5:
                return img5;
            default:
                return img1;
        }
    };

    const sendMessage = async () => {
        if (messageToSend.trim().length === 0) return;
        try {
            const response = await axios.post('http://localhost:5172/api/messages', {
                userId: localUserId,
                message: messageToSend
            });
            console.log('Message sent:', response.data.chat);
            setMessageToSend('');
            updateMessageCount((msgCount) => msgCount + 1);
        } 
        
        catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:5172/api/messages');
                setMessages(response.data);
            } 
            
            catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [messageCount, localUserId]); // this will only run when the messageCount changes or localUserId is changed

    // sccroll to the bottom when messages are loaded or when new messages are added
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' }); // 'scrollIntoView' is a method that scrolls the element into the visible area of the browser window
        }
    }, [messages]); // this will only run when the messages change

    // 3: Handle "Enter" key press to send message
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className={styles.liveChatContainer}>
            <div className={styles.header}>
                <h1 className="logo">LiveChat</h1>
                <h1 className={styles.copyright}>Made by @LordBugsy</h1>
            </div>

            <div className={styles.liveChat}>
                {messages.length > 0 ? (
                    messages.map((message, index) => {
                        const showProfileInfo = index === 0 || message.userId._id !== messages[index - 1].userId._id;

                        return (
                            <div key={message._id} className={styles.messageContainer}>
                                {showProfileInfo && (
                                    <div className={styles.profileImageContainer}>
                                        <img
                                            src={renderProfileImage(message.userId.profileColour)}
                                            alt={`${message.userId.profileColour}.png`}
                                            className={styles.image}
                                        />
                                        <h2 className={`${styles.messageAuthor}`}>
                                            {message.userId.username} <span className={styles.authorId}>({message.userId._id})</span>
                                        </h2>
                                    </div>
                                )}
                                <div className={styles.messageBox}>
                                    <p className={styles.messsage}>{message.message}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className={styles.noMessages}>No messages sent yet.</p>
                )}
                {/* ref to track the bottom of the chat */}
                <div ref={chatEndRef} />
            </div>

            <div className={styles.inputContainer}>
                <input id="inputText" name="message" value={messageToSend} onChange={updateInput} onKeyDown={handleKeyDown} className={styles.input} type="text" placeholder="Type your message..." /> {/* onKeyDown means that when a key is pressed, it will perform an action */}
                <button onClick={sendMessage} id="button" disabled={messageToSend.length === 0} className={`${styles.button} ${messageToSend.length === 0 ? styles.disabled : styles.send}`}>
                     <i className={`ri-arrow-up-line ${styles.icon}`}></i>
                </button>
            </div>
        </div>
    );
};

export default LiveChat;
