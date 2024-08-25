import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css';
import { useContext } from 'react';
import { DataContext } from '../DataProvider';

const Login = () => {
    const [enteredUsername, setUsername] = useState('');
    const {updateSignUpStatus, updateLocalUsername, updateLocalUserId} = useContext(DataContext);

    const closeContainer = () => {
        const loginContainer = document.getElementById('loginContainer');
        loginContainer.classList.add(styles.fadeOut);
        setTimeout(() => updateSignUpStatus(false), 310);
    }

    const handleLogin = async (e) => {
        e.preventDefault(); // prevent the form from refreshing the page
        try {
            // await axios.get('http://localhost:5172/api/users/delete'); // uncomment this line to delete all users 
            // await axios.get('http://localhost:5172/api/messages/delete'); // uncomment this line to delete all messages
            const response = await axios.post('http://localhost:5172/api/users', { username: enteredUsername });
            updateLocalUsername(response.data.user.username);
            updateLocalUserId(response.data.user._id);
            console.log('User created:', response.data.user, 'User ID:', response.data.user._id);
        } 
        
        catch (error) {
            console.error('Error creating user:', error);
        }

        finally {
            closeContainer();   
        }
    };

    return (
        <>
            <form id='loginContainer' method="post" className={styles.loginContainer} onSubmit={handleLogin}>
                <div className={styles.loginBox}>
                    <h1 className="logo">LiveChat</h1>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputBox}>
                            <i className={`ri-user-line ${styles.icon}`}></i>
                            <input autoComplete='username' className={styles.input} type="text" id="username" placeholder='Enter your username...' name="username" value={enteredUsername} onChange={(e) => setUsername(e.target.value)} required />
                        </div>

                        <button className={`${styles.button} ${styles.login}`} type="submit">Login</button>
                    </div>
                </div>
            </form>

            <div className='copyrightContainer'>
                <p className='copyright'>
                    Made by LordBugsy {new Date().getFullYear() === 2024 ? new Date().getFullYear() : `2024 - ${new Date().getFullYear()}`}. All Rights Reserved
                </p>
            </div>
        </>
    );
};

export default Login;
