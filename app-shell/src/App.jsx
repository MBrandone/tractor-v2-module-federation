import './App.css';
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import {FlorianRapplRouter} from "./florian-rappl-router";

const App = () => {
    return (
        <>
            <Header/>
            <FlorianRapplRouter/>
            <Footer/>
        </>
    );
};

export default App;
