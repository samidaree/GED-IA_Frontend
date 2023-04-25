import React from "react";
import { NavLink } from "react-router-dom"

import { useLocation, useNavigate } from "react-router";
import Logo from "../components/Logo";
import Navigation from "../components/Navigation";
import SearchBar from "../components/SearchBar";

/* Mettre la possibilité de changer le prompt à gauche avec la couverture
    mettre une barre qui sépare la couverture et les fonctions 
    rajouter une animation sur la couverture
    mettre les bouttons sauvegarder dans la base de données et 
    choiir un autre fichier en bas des fonctions et couverture 
    
*/
const File = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const file = location.state.selectedFile;
    const fileName = location.state.fileName;
    const fileContents = location.state.fileContents;
    const fileList = location.state.fileList;
    const fileThumbnail = location.state.fileThumbnail;
    const articleData = location.state.articleData;

    async function makeSummary() {
        console.log("make summary")
        let summaries = "";


        /* Debugging */
        Object.values(articleData).forEach(article => {
            const { title, content } = article;
            console.log(`Title: ${title}`);
            console.log(`Article content: ${content}`);
        });


        var inputPrompt = document.getElementById("sum")

        var prompt = inputPrompt.value

        console.log("prompt " + prompt)
        var inputKey = document.getElementById("keyInput")

        var apiKey = inputKey.value
        console.log("API KEY " + apiKey)

        const requestBody = {
            articleData: articleData,
            name: fileName,
            prompt: prompt,
            key: apiKey,
        };
        try {
            const response = await fetch("http://localhost:5000/openai/text", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
            if (response.status === 200) {
                const data = await response.json();
                const summary = data.summary;

                for (const key in summary) {
                    const article = summary[key];
                    summaries += `${key} ${article}`;
                }
            } else if (response.status === 401) {
                const errorData = await response.json();
                console.log("errorData.error");
                const alert = document.getElementById("alert");
                console.log(alert);
                alert.classList.add("show");
                alert.classList.remove("hide");

                console.error('Error reading file:', error);
                console.log(alert);
                // Handle invalid API key error
            } else {
                throw new Error(`HTTP status code ${response.status}`);
            }
        } catch (error) {
            console.error(error);
            // Handle error
        }


        const myTextArea = document.getElementById("summary");
        myTextArea.value = summaries;



        //console.log('Response received from server:', responseData);
    }

    function openFile() {

        window.open(URL.createObjectURL(file.fileObject), '_blank');

    }

    async function saveDB() {
        const keyword = document.getElementById("keywords").value;
        const summary = document.getElementById("summary").value;

        const url = "http://localhost:5000/openai/db"; // Replace this with the actual URL of your server-side endpoint

        const requestBody = {
            name: fileName,
            summary: summary,
            keywords: keyword
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (response.status === 200) {
                const data = await response.text();
                const alert = document.getElementById("alertBD");
                console.log(alert);
                alert.classList.add("show");
                alert.classList.remove("hide");
                console.log(data);
            } else {
                const alert = document.getElementById("alertEchecBD");

                alert.classList.add("show")
                alert.classList.remove("hide");
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function makeIndex() {

        let keywords = "";
        var inputPrompt = document.getElementById("index")

        var prompt = inputPrompt.value


        var inputKey = document.getElementById("keyInput")

        var apiKey = inputKey.value

        console.log("longueur de prompt " + prompt.trim().length);
        console.log("longueur de apiKey " + apiKey.trim().length)

        const requestBody = {
            articleData: articleData,
            name: fileName,
            prompt: prompt,
            key: apiKey
        };

        try {
            const response = await fetch("http://localhost:5000/openai/key", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
            if (response.status === 200) {
                const data = await response.json();
                const keywordArray = data.keywords;
                console.log(keywordArray);
                for (const key in keywordArray) {
                    const keyword = keywordArray[key];
                    keywords += `${key} ${keyword}`;
                }
            } else if (response.status === 401) {
                const errorData = await response.json();
                console.log("errorData.error");
                const alert = document.getElementById("alert");
                console.log(alert);
                alert.classList.add("show");
                alert.classList.remove("hide");

                console.error('Error reading file:', error);
                console.log(alert);
                // Handle invalid API key error
            } else {
                throw new Error(`HTTP status code ${response.status}`);
            }
        } catch (error) {
            console.error(error);
            // Handle error
        }

        const myTextArea = document.getElementById("keywords");
        myTextArea.value = keywords;

    }
    function closeAlert() {
        const alert = document.getElementById("alert");
        alert.classList.add("hide");

    }

    function closeAlertBD() {
        const alert = document.getElementById("alertBD");
        alert.classList.add("hide");

    }

    function closeAlertEchecBD() {
        const alert = document.getElementById("alertEchecBD");
        alert.classList.add("hide");

    }


    const handleBack = () => {
        navigate('/', { state: { fileList } });
    };

    return (
        <>
            <Logo />
            <Navigation />
            { /*<SearchBar /> */}
            <div className="openai">

                <div className="key">
                    <input type="text" id="keyInput" placeholder=" " />
                    <span>Saisissez une clé API</span>

                </div>


            </div>
            <div className="dividerBloc">

                <span className="divider"></span>
            </div>
            <div className="file-page">

                <div className="file-cover" onClick={openFile}>
                    <img src={fileThumbnail} ></img>

                </div>

                <div className="function">

                    <div className="indexation">
                        <input type="text" id="index" placeholder=" " />
                        <span>Prompt</span>
                        <button className="button-index" onClick={makeIndex}>
                            Indexer
                        </button>

                    </div>
                    <div className="inputBox">
                        <div className="wrapper">

                            <textarea id="keywords" placeholder=" " >

                            </textarea>
                            <span>Mots clés</span>
                        </div>
                    </div>
                    <div className="summary">

                        <input type="text" id="sum" placeholder=" " />
                        <span>Prompt</span>
                        <button className="button-summary" onClick={makeSummary}>
                            Faire un résumé
                        </button>
                    </div>
                    <div className="inputBox">
                        <div className="wrapper">

                            <textarea id="summary" placeholder=" ">

                            </textarea>
                            <span>Résumé</span>
                        </div>
                    </div>

                    <div className="saveBack">
                        { /* <NavLink to="/" className="navlink-active"> */}

                        <button className="back" onClick={handleBack}>
                            <span className="buttonText">

                                Choisir un autre fichier
                            </span>
                            <span className="buttonIcon">
                                <ion-icon name="return-up-back-outline"></ion-icon> </span>
                        </button>
                        {/*</NavLink>*/}
                        <button className="save" onClick={saveDB} >
                            <span className="buttonText">
                                Sauvegarder dans la base de données
                            </span>
                            <span className="buttonIcon">
                                <ion-icon name="save-outline"></ion-icon> </span>
                        </button>
                    </div>
                </div>



            </div >
            <div id="alert" className="alert hide">
                <ion-icon id="icon" name="alert-circle-outline"></ion-icon>
                <span className="msg">Clé API invalide</span>
                <span className="close-btn" onClick={closeAlert}>
                    <ion-icon className="close" name="close-outline"></ion-icon>
                </span>
            </div>

            <div id="alertBD" className="alertBD hide">
                <ion-icon id="iconBD" name="checkmark-circle-outline"></ion-icon>                <span className="msgBD">Enregistrement effectué</span>
                <span className="close-btnBD" onClick={closeAlertBD}>
                    <ion-icon className="closeBD" name="close-outline"></ion-icon>
                </span>
            </div>
            <div id="alertEchecBD" className="alert hide">
                <ion-icon id="icon" name="alert-circle-outline"></ion-icon>
                <span className="msg">Échec de l'enregistrement</span>
                <span className="close-btn" onClick={closeAlertEchecBD}>
                    <ion-icon className="close" name="close-outline"></ion-icon>
                </span>
            </div>
        </>

    )

}

export default File; 