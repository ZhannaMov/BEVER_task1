import {LOGIN_URL, TABLES_URL} from "./urls";
import {HOME_URL} from "./urls";
import Login from "../components/Login/Login";
import Home from "../components/Home/Home";

import Tables from "../components/Tables/Tables";
export const myRoutes= [
    {
        path: HOME_URL,
        element: <Home/>
    },
    {
        path: LOGIN_URL,
        element: <Login/>
    },
    {
        path: TABLES_URL,
        element: <Tables/>
    },
]