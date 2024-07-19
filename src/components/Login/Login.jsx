import React, {useEffect, useState} from 'react';
import css from  './Login.module.css'
import {useNavigate} from "react-router-dom";
import {TABLES_URL} from "../../helpers/urls";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const[loggedUser, setLoggedUser] = useState(null)
    const [Name, setName] = useState('');
    const [Password, setPassword] = useState('');

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get("https://bever-aca-assignment.azurewebsites.net/users");
                setUsers(response.data.value);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        getUsers();
    }, []);

    const loginFn = (event) => {
        event.preventDefault();
        try {
            if (users.length > 0) {
                const index = users.findIndex(el => el.Name === Name && el.Password === Password);
                if (index !== -1) {
                    const user = users[index];
                    localStorage.setItem('token', index)
                    navigate(TABLES_URL);
                } else {
                    alert('Invalid email or password');
                }
            } else {
                alert('User data is not properly loaded');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred while logging in.');
        }
    };

    return (
        <div>
            <form className={css.logForm} onSubmit={loginFn} >
                <input placeholder="login"
                       className={css.logInput}
                       onChange={(e) => setName(e.target.value)}
                />
                <input placeholder="password"
                       className={css.logInput}
                       type={"password"}
                       onChange={(e) => setPassword(e.target.value)}

                />
                <button className={css.logBtn} onClick={loginFn} >Log In</button>
            </form>

        </div>
    );
};

export default Login;