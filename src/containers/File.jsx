import React from "react";
import { useLocation } from "react-router";
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
    const location = useLocation();
    const file = location.state.selectedFile;
    const fileName = location.state.fileName;
    const fileThumbnail = location.state.fileThumbnail;
    const articleData = location.state.articleData;

    async function makeSummary() {
        console.log("make summary")
        let summaries = "";

        Object.values(articleData).forEach(article => {
            const { title, content } = article;
            console.log(`Title: ${title}`);
            console.log(`Article content: ${content}`);
        });

        const requestBody = {
            articleData: articleData
        };
        const response = await fetch('http://localhost:5000/openai/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }).then(response => response.json()).then(data => {
            const summary = data.summary;
            console.log(summary);
            console.log("summary")
            for (const key in summary) {
                const article = summary[key];
                summaries += `${key} ${article}`
                //console.log(`${key} ${article}`);
            }
        }).catch(error => console.error(error));

        const myTextArea = document.getElementById("summary");
        myTextArea.value = summaries;



        //console.log('Response received from server:', responseData);
    }

    function openFile() {

        window.open(URL.createObjectURL(file.fileObject), '_blank');

    }
    return (
        <>
            <Logo />
            <Navigation />
            { /*<SearchBar /> */}
            <div class="openai">

                <div class="key">
                    <label for="keyInput">
                        Saisir une clé API
                    </label>
                    <input type="text" id="keyInput" />

                </div>

                <div class="prompt">
                    <label for="promptInput">
                        Saisir un prompt
                    </label>
                    <input type="text" id="promptInput" />

                </div>


            </div>
            <div className="file-page">

                <div className="file-cover" onClick={openFile}>
                    <img src={fileThumbnail} ></img>

                </div>

                <div class="function">

                    <button className="button-summary" onClick={makeSummary}>
                        Faire un résumé
                    </button>
                    <div className="inputBox">
                        <div class="wrapper">

                            <textarea id="summary" placeholder=" ">

                            </textarea>
                            <span>Résumé</span>
                        </div>
                    </div>
                    <button className="button-index">
                        Indexer
                    </button>
                    <div class="inputBox">
                        <div class="wrapper">

                            <textarea id="keywords" placeholder=" " >

                            </textarea>
                            <span>Mots clés</span>
                        </div>
                    </div>
                    <div class="saveBack">

                        <button >
                            Choisir un autre fichier
                        </button>
                        <button >
                            Sauvegarder dans la base de données                        </button>
                    </div>
                </div>



            </div >
        </>

    )

}

export default File; 