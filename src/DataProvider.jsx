import React, { createContext, useState } from "react";

export const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [localUsername, updateLocalUsername] = useState("");
    const [localUserId, updateLocalUserId] = useState("");
    const [signUpStatus, updateSignUpStatus] = useState(true);
    const [messageCount, updateMessageCount] = useState(0); // this variable will only be used to update the chat every time a new message is sent which is more "memory friendly" than fetching all messages every second
    
    return (
        <DataContext.Provider value={{ 
            localUsername, updateLocalUsername, signUpStatus, updateSignUpStatus, localUserId, updateLocalUserId,
            messageCount, updateMessageCount
         }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;