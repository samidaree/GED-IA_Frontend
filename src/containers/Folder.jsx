import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router'

import Card from '../components/Card'
import { Document, Page, pdfjs } from 'react-pdf'
import * as pdfjsLib from 'pdfjs-dist'
import { useNavigate } from 'react-router-dom'
import DragDrop from '../components/DragDrop'

/**
 * A component that allows users to upload and browse PDF files, displays uploaded files as cards,
 * and navigates to a file view page when a card is clicked.
 *
 * @returns {JSX.Element} The Folder component
 */

const Folder = () => {
  /**
   * The state of the component, including the content to be displayed, the list of uploaded files, and the currently selected file
   *
   * @typedef {Object} FolderState
   * @property {JSX.Element} content - The content to be displayed in the component
   * @property {Array.<Object>} fileList - The list of uploaded files
   * @property {Object} selectedFile - The currently selected file
   */

  // Get the current location and state from the router
  const location = useLocation()
  const state = location.state

  /**
   * The list of uploaded files
   *
   * @type {Array.<Object>}
   */
  const [fileList, setFileList] = useState(state ? state.fileList : [])

  /**
   * The currently selected file
   *
   * @type {Object}
   */
  const [selectedFile, setSelectedFile] = useState(null)

  const navigate = useNavigate()

  // Use the useEffect hook to log the fileList to the console whenever it changes
  useEffect(() => {
    console.log(fileList)
  }, [fileList])

  /**
   * Handles the user clicking on the file upload button, reads the contents of the uploaded file(s),
   * extracts thumbnail image(s) from PDF files, and adds the file(s) to the list of uploaded files.
   *
   * @param {Event} event - The file upload event
   */
  async function handleFileUpload(inputs) {
    console.log('🚀 ~ handleFileUpload ~ e:', inputs)
    const fileListArray = inputs

    for (let i = 0; i < fileListArray.length; i++) {
      const file = fileListArray[i]

      // Extract thumbnail from PDF file
      if (file.type === 'application/pdf') {
        const data = await readPdfFile(file)
        const thumbnail = data.thumbnail

        setFileList((fileList) => [
          ...fileList,
          { name: file.name, thumbnail, fileObject: file },
        ])
      }
    }

    //setContent();
  }

  /**
   * Closes the alert message displayed when an error occurs while clicking on a file that does not have a table of contents.
   */
  function closeAlert() {
    const alert = document.getElementById('alert')
    alert.classList.add('hide')
  }

  /**
   * Handles the user clicking on a file card, reads the contents of the selected file,
   * extracts articles from the PDF file, and navigates to the file view page.
   *
   * @param {number} index - The index of the selected file in the fileList state
   */
  async function handleClick(index) {
    console.log('Clicked on card:', index)
    setSelectedFile(fileList[index])
    console.log('selected ', fileList[index])
    const file = fileList[index].fileObject

    // Read the contents of the file
    try {
      let fileContents, thumbnail, articleData, data

      // Extract text and thumbnail from PDF file
      if (file.type === 'application/pdf') {
        data = await readPdfFile(file)
        fileContents = data.text
        thumbnail = data.thumbnail

        articleData = extractArticles(data.outline, fileContents)
      } else {
        fileContents = await readFileAsText(file)
        thumbnail = fileList[index].thumbnail
        articleData = {
          0: { title: file.name, start: 0, end: fileContents.length },
        }
      }

      //console.log("fileContents" + fileContents);

      navigate('/file', {
        state: {
          fileList: fileList,
          selectedFile: fileList[index],
          fileName: fileList[index].name,
          fileThumbnail: thumbnail,
          fileContents: fileContents,
          articleData: articleData,
        },
      })
    } catch (error) {
      const alert = document.getElementById('alert')
      console.log(alert)
      alert.classList.add('show')
      alert.classList.remove('hide')

      console.error('Error reading file:', error)
      console.log(alert)
    }
  }

  /**
   * Extracts articles from the PDF file based on the table of contents.
   *
   * @param {Array.<Object>} outline - The table of contents for the PDF file
   * @param {string} fileContents - The contents of the PDF file as a string
   * @returns {Object} An object containing the titles and contents of each article in the PDF file
   */

  function extractArticles(outline, fileContents) {
    const articleData = {}

    // Extract text for each article based on the outline
    let startIndex = fileContents
      .toLowerCase()
      .replace(/\s/g, '')
      .indexOf(outline[0].title.replace(/\s/g, '').toLowerCase())

    // Skip the first occurrence of the title = first occurence in TOC
    const titleNoSpaces = outline[0].title.replace(/\s/g, '').toLowerCase()
    const fileContentsNoSpaces = fileContents.replace(/\s/g, '').toLowerCase()
    startIndex = fileContentsNoSpaces.indexOf(
      titleNoSpaces,
      startIndex + titleNoSpaces.length,
    )
    console.log('new start index : ', startIndex)

    for (let i = 0; i < outline.length - 1; i++) {
      const titleNoSpaces = outline[i].title.replace(/\s/g, '').toLowerCase()
      const start = fileContentsNoSpaces.indexOf(titleNoSpaces, startIndex)
      if (start === -1) continue

      const end = fileContentsNoSpaces.indexOf(
        outline[i + 1].title.replace(/\s/g, '').toLowerCase(),
        start,
      )
      if (end === -1) continue

      console.log(`Article ${i} start index: ${startIndex}`)
      console.log(`Article ${i} start position: ${start}`)
      console.log(`Article ${i} end position: ${end}`)

      try {
        articleData[i] = {
          title: outline[i].title,
          content: fileContentsNoSpaces.slice(start, end).trim(),
        }
      } catch (error) {
        console.error(`Error extracting article data for article ${i}:`, error)
      }

      startIndex = end
    }

    // Extract text for the last article
    const lastTitle = outline[outline.length - 1].title
    const start = fileContents
      .toLowerCase()
      .replace(/\s/g, '')
      .indexOf(lastTitle.replace(/\s/g, '').toLowerCase(), startIndex)
    if (start !== -1) {
      try {
        articleData[outline.length - 1] = {
          title: lastTitle,
          content: fileContentsNoSpaces.slice(start + lastTitle.length).trim(),
        }
      } catch (error) {
        console.error('Error extracting article data for last article:', error)
      }
    }

    console.log('Extracted article data:', articleData)

    return articleData
  }

  /**
   * Reads a PDF file and returns its thumbnail image, number of pages, extracted text, and outline.
   *
   * @async
   * @param {File} file - The PDF file to be read.
   * @returns {Promise<{thumbnail: string, pageCount: number, text: string, outline: object}>} - An object containing the thumbnail image as a data URL, the number of pages, the extracted text, and the document outline (if available).
   */
  async function readPdfFile(file) {
    const reader = new FileReader()
    const fileDataPromise = new Promise((resolve) => {
      reader.onload = () => resolve(reader.result)
    })
    reader.readAsArrayBuffer(file)

    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    const loadingTask = pdfjs.getDocument({ data: await fileDataPromise })
    const pdfData = await loadingTask.promise
    const page = await pdfData.getPage(1)
    const viewport = page.getViewport({ scale: 1 })
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    canvas.width = viewport.width
    canvas.height = viewport.height

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    }

    await page.render(renderContext).promise

    const thumbnail = canvas.toDataURL()
    const pageCount = pdfData.numPages
    let text = ''
    let outline = null

    try {
      outline = await pdfData.getOutline()
      console.log(outline)
    } catch (error) {
      console.error('Error getting outline:', error)
    }

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdfData.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map((item) => item.str + ' ').join('')
    }

    return { thumbnail, pageCount, text, outline }
  }

  return (
    <div>
      <DragDrop handleFileUpload={handleFileUpload} />

      <div className="files">
        <ul>
          {fileList.map((file, index) => (
            <Card
              key={index}
              name={file.name}
              image={file.thumbnail}
              onClick={() => handleClick(index)}
            />
          ))}
        </ul>
      </div>
      <div
        id="alert"
        className="alert hide"
      >
        <ion-icon
          id="icon"
          name="alert-circle-outline"
        ></ion-icon>
        <span className="msg">
          Votre fichier ne contient pas de table de matières
        </span>
        <span
          className="close-btn"
          onClick={closeAlert}
        >
          <ion-icon
            className="close"
            name="close-outline"
          ></ion-icon>
        </span>
      </div>
    </div>
  )
}

export default Folder
