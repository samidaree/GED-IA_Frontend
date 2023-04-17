import React from "react";
import { useLocation } from "react-router";
import Logo from "../components/Logo";
import Navigation from "../components/Navigation";
import SearchBar from "../components/SearchBar";

const File = (props) => {
    const location = useLocation();
    const fileName = location.state.fileName;
    const fileThumbnail = location.state.fileThumbnail;
    return (
        <>
            <Logo />
            <Navigation />
            <SearchBar />
            <div className="file-page">
                <h2 className="file-name">{fileName}</h2>

                <div className="file-cover">
                    <img src={fileThumbnail}></img>
                </div>
                <div className="button">
                    <button className="button-summary">
                        Faire un résumé
                    </button>
                    <button className="button-index">
                        Indexer
                    </button>
                </div>

                <textarea>

                </textarea>

            </div>
        </>

    )

}

export default File; 