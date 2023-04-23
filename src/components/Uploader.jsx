import React from 'react';

const Uploader = () => {

    return (
        <div className=".uploader">
            <form action="" onClick={() => {
                document.querySelector(".input-field").click();
            }}>
                <input type="file" className='input-field' accept=".pdf" multiple hidden></input>
                <ion-icon id="icon" name="cloud-upload-outline"></ion-icon>
                <p> Parcourir ou glissez des fichiers</p>
            </form>
        </div>
    );
};

export default Uploader;