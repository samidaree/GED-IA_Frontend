import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../components/Home'
import About from '../components/About'
import File from './File'
import Settings from '../components/Settings'

function App() {
  /**
   * A React component representing the root of the application that defines the routes and corresponding components for different paths.
   * @returns {JSX.Element} - The JSX element representing the component.
   */
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/about"
          element={<About />}
        />
        <Route
          path="*"
          element={<Home />}
        />
        <Route
          path="/file"
          element={<File />}
        />
        <Route
          path="settings"
          element={<Settings />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
