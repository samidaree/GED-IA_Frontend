import React from "react";
import Logo from "./Logo"
import Navigation from "./Navigation";
import Folder from "../containers/Folder";

/**
 * A functional component that renders the home page.
 *
 * @returns {JSX.Element} The rendered home page.
 */
const Home = () => {

    return (
        <div>
            <Logo />
            <Navigation />
            <Folder />
        </div>
    );
};

export default Home;