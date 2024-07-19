
import './App.css';
import Home from "./components/Home/Home";
import {useRoutes} from "react-router-dom";
import {myRoutes} from "./helpers/routing";
import Header from "./components/Header/Header";

function App() {
    let element = useRoutes(myRoutes);
  return (
    <div>

        <Header/>
        {element}
    </div>
  );
}

export default App;
