import React from 'react'
import { NavLink } from 'react-router-dom'

const Navigation = () => {
  return (
    <div className="navigation">
      <ul>
        <NavLink
          to="/"
          className={(nav) => (nav.isActive ? 'nav-active' : '')}
          end
        >
          <li>Accueil</li>
        </NavLink>
        <NavLink
          to="/settings"
          className={(nav) => (nav.isActive ? 'nav-active' : '')}
          end
        >
          <li>Paramètres</li>
        </NavLink>
        <NavLink
          to="/about"
          className={(nav) => (nav.isActive ? 'nav-active' : '')}
          end
        >
          <li>À propos</li>
        </NavLink>
      </ul>
    </div>
  )
}

export default Navigation
