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
        <input type="file" name="file" id="folder" onChange={handleFileUpload} style={{ display: "none" }} webkitdirectory="true" directory="true" multiple ></input>
    </div>)
    const [fileList, setFileList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const navigate = useNavigate();

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
        try {
            let fileContents, thumbnail, articleData, data;

            // Extract text and thumbnail from PDF file
            if (file.type === 'application/pdf') {
                data = await readPdfFile(file);
                fileContents = data.text;
                thumbnail = data.thumbnail;
                articleData = extractArticles(data.outline, fileContents);
                Object.values(articleData).forEach(article => {
                    const { title, content } = article;
                    console.log(`Title: ${title}`);
                    console.log(`Article content: ${content}`);
                });
            } else {
                fileContents = await readFileAsText(file);
                thumbnail = fileList[index].thumbnail;
                articleData = { 0: { title: file.name, start: 0, end: fileContents.length } };
            }

            console.log("fileContents" + fileContents);

            // Send the file contents to the backend
            const response = await fetch('http://localhost:5000/upload-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: fileContents })
            });

            const responseData = await response.text();

            console.log('Response received from server:', responseData);

            navigate('/file', {
                state: {
                    selectedFile: fileList[index],
                    fileName: fileList[index].name,
                    fileThumbnail: thumbnail,
                    //articleData: extractArticles(data.outline, data.pageCount, fileContents) // Update here
                }
            });
        } catch (error) {
            console.error('Error reading file:', error);
        }
    }


    function extractArticles(outline, fileContents) {
        const articleData = {};

        // Extract text for each article based on the outline
        let startIndex = fileContents.toLowerCase().replace(/\s/g, '').indexOf(outline[0].title.replace(/\s/g, '').toLowerCase());
        console.log('Start index:', startIndex); // Check the start index
        for (let i = 0; i < outline.length - 1; i++) {
            const titleNoSpaces = outline[i].title.replace(/\s/g, '').toLowerCase();
            const fileContentsNoSpaces = fileContents.replace(/\s/g, '').toLowerCase();
            const start = fileContentsNoSpaces.indexOf(titleNoSpaces, startIndex);
            if (start === -1) continue;

            const end = fileContentsNoSpaces.indexOf(outline[i + 1].title.replace(/\s/g, '').toLowerCase(), start);
            if (end === -1) continue;

            console.log(`Article ${i} start index: ${startIndex}`);
            console.log(`Article ${i} start position: ${start}`);
            console.log(`Article ${i} end position: ${end}`);

            try {
                articleData[i] = { title: outline[i].title, content: fileContents.slice(start + outline[i].title.length, end).trim() };
            } catch (error) {
                console.error(`Error extracting article data for article ${i}:`, error);
            }

            startIndex = end;
        }

        // Extract text for the last article
        const lastTitle = outline[outline.length - 1].title;
        const start = fileContents.toLowerCase().replace(/\s/g, '').indexOf(lastTitle.replace(/\s/g, '').toLowerCase(), startIndex);
        if (start !== -1) {
            try {
                articleData[outline.length - 1] = { title: lastTitle, content: fileContents.slice(start + lastTitle.length).trim() };
            } catch (error) {
                console.error('Error extracting article data for last article:', error);
            }
        }

        console.log('Extracted article data:', articleData);

        return articleData;
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

        const thumbnail = canvas.toDataURL();
        const pageCount = pdfData.numPages;
        let text = '';
        let outline = null;

        try {
            outline = await pdfData.getOutline(); // Get the outline data
            console.log(outline); // Log the outline data to the console
        } catch (error) {
            console.error('Error getting outline:', error);
        }

        for (let i = 1; i <= pageCount; i++) {
            const page = await pdfData.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str + ' ').join('');
        }

        return { thumbnail, pageCount, text, outline };
    }




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