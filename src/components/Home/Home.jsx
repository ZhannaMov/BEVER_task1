import React from 'react';
import Header from "../Header/Header";
import Login from "../Login/Login";
import css from "./Home.module.css"
const Home = () => {
    return (
        <div className={css.homeCont}>
            {/*<Header/>*/}
            <Login/>
        </div>
    );
};

export default Home;