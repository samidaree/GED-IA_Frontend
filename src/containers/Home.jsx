import React from "react";
import Logo from "../components/Logo"
import SearchBar from "../components/SearchBar";
import Navigation from "../components/Navigation";
import Folder from "../components/Folder";

const Home = () => {

    return (
        <div>
            <Logo />
            <Navigation />
            <SearchBar />
            <Folder />
        </div>
    );
};

export default Home;