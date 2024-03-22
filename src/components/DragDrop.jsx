import PdfIcon from './PdfIcon'
import { useEffect, useState } from 'react'
export default function DragDrop({ handleFileUpload }) {
  const [files, setFiles] = useState([])
  console.log('🚀 ~ DragDrop ~ files:', files)
  function inputChange(event) {
    const dropArea = document.querySelector('.drag-area')
    dropArea.classList.add('active')
    setFiles(event.target.files)
    handleFileUpload(event.target.files)
    console.log('input')
    dropArea.classList.remove('active')
    const dragText = document.querySelector('.header')
    dragText.textContent = 'Glisser-déposer'
  }
  function dropAreaDragOver(event) {
    event.preventDefault()
    event.stopPropagation()
    const dropArea = document.querySelector('.drag-area')
    const dragText = document.querySelector('.header')

    dropArea.classList.add('active')
    dragText.textContent = 'Relâcher pour déposer'
  }
  function leaveDrag(event) {
    const dropArea = document.querySelector('.drag-area')
    const dragText = document.querySelector('.header')
    dropArea.classList.remove('active')
    // console.log('File left the drag area');
    dragText.textContent = 'Glisser-déposer'
  }
  function handleDrop(event) {
    event.preventDefault()
    event.stopPropagation() // Stop event from propagating further
    const dropArea = document.querySelector('.drag-area')
    const dragText = document.querySelector('.header')
    const files = Array.from(event.dataTransfer.files) // Convert FileList to array
    console.log('🚀 ~ dropArea.addEventListener ~ files:', files)
    handleFileUpload(files) // Call handleFileUpload with the array of files

    dropArea.classList.remove('active')
    dragText.textContent = 'Glisser-déposer'
  }
  function handleBrowse() {
    const input = document.querySelector('input')
    input.click()
  }

  return (
    <div
      class="drag-area"
      onDragOver={(event) => dropAreaDragOver(event)}
      onDragLeave={(event) => leaveDrag(event)}
      onDrop={(event) => handleDrop(event)}
    >
      <div class="icon">
        <PdfIcon />
      </div>

      <span class="header">Glisser-déposer</span>
      <span class="header">
        ou{' '}
        <span
          class="button"
          onClick={() => handleBrowse()}
        >
          parcourir
        </span>
      </span>
      <input
        type="file"
        accept=".pdf"
        hidden
        multiple
        onChange={(event) => inputChange(event)}
      />
      <span class="support">Supporte: PDF</span>
    </div>
  )
}
