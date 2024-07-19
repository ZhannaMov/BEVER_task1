import React, {useEffect, useState} from 'react';
import css from "./Header.module.css"
import { FaRegUserCircle } from "react-icons/fa";
import axios from "axios"
import {useNavigate} from "react-router-dom";
import {HOME_URL} from "../../helpers/urls";
const Header = () => {

    const [userName, setUsername] = useState("");
    const[index, setIndex] = useState(null);
    const navigate = useNavigate()

    // const userIndex = localStorage.getItem('token');

    const handleLogOut = ()=>{
        localStorage.removeItem("token");
        setUsername("");  // Clear the username on logout
        setIndex(null);
        navigate(HOME_URL)
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const userIndex = localStorage.getItem('token');

            if (userIndex !== null) {
                setIndex(userIndex)
                try {
                    const response = await axios.get('https://bever-aca-assignment.azurewebsites.net/users');
                    const users = response.data.value;
                    const user = users[userIndex];
                    if (user) {
                        setUsername(user.Name);
                        console.log(user.Name)// Set the username
                    } else {
                        console.error('User not found');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                console.error('No user index found in local storage');
            }
        };

        fetchUserData();
    }, []);
    return (
        <div className={css.header}>
            {
                index ? <div className={css.userNameLog}>
                        {userName} /
                        <span onClick={handleLogOut}>
                        Log Out</span>
                    </div>
                    : <div className={css.userIcon}>
                        <FaRegUserCircle/>
                    </div>

            }
        </div>
    );
};

export default Header;