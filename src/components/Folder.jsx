import React, { useState, useEffect } from 'react';
import Card from "./Card";
import { Document, Page, pdfjs } from "react-pdf";
import * as pdfjsLib from 'pdfjs-dist';
import { BrowserRouter, Route, Link, useNavigate } from 'react-router-dom';


const Folder = () => {

    const [content, setContent] = useState(<div id="box-file-upload" >
        <label htmlFor="folder" className="file-upload" >
            Choisir un dossier
        </label>
        <input type="file" name="file" id="folder" onChange={handleFileUpload} style={{ display: "none" }} accept=".pdf, .docx" webkitdirectory="true" directory="true" multiple ></input>
    </div>)
    const [fileList, setFileList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        console.log(fileList);
    }, [fileList]);

    async function handleFileUpload(event) {
        const files = event.target.files;
        const fileListArray = Array.from(files);

        for (let i = 0; i < fileListArray.length; i++) {
            const file = fileListArray[i];

            // Extract thumbnail from PDF file
            if (file.type === 'application/pdf') {
                const data = await readPdfFile(file);
                const thumbnail = data.thumbnail;

                setFileList(fileList => [...fileList, { name: file.name, thumbnail, fileObject: file }]);
            } else {
                setFileList(fileList => [...fileList, { name: file.name, fileObject: file }]);
            }
        }

        //setContent(); 
    }

    async function handleClick(index) {
        console.log('Clicked on card:', index);
        setSelectedFile(fileList[index]);
        console.log("selected ", fileList[index]);
        const file = fileList[index].fileObject;

        // Read the contents of the file
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = async () => {
            const fileContents = fileReader.result;

            // Send the file contents to the backend
            try {
                const response = await fetch('http://localhost:5000/upload-text', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: fileContents })
                });

                const data = await response.text();

                console.log('Response received from server:', data);
            } catch (error) {
                console.error('Error sending request:', error);
            }

            navigate('/file', { state: { selectedFile: fileList[index], fileName: fileList[index].name, fileThumbnail: fileList[index].thumbnail } });
        };
    }

    async function readPdfFile(file) {
        const reader = new FileReader();
        const fileDataPromise = new Promise(resolve => {
            reader.onload = () => resolve(reader.result);
        });
        reader.readAsArrayBuffer(file);

        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        const loadingTask = pdfjs.getDocument({ data: await fileDataPromise });

        const pdfData = await loadingTask.promise;
        const page = await pdfData.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        await page.render(renderContext).promise;

        return {
            thumbnail: canvas.toDataURL(),
            pageCount: pdfData.numPages
        };
    }

    const navigate = useNavigate();




    return (
        <div>
            {content}
            <div className="files">
                <ul>
                    {fileList.map((file, index) => (
                        <Card key={index} name={file.name} image={file.thumbnail} onClick={() => handleClick(index)} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Folder;