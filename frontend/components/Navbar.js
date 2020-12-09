import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { faBookmark } from '@fortawesome/free-regular-svg-icons'
// npm install --save @fortawesome/free-regular-svg-icons

const NavBar = (props) => {
  const [isActive, setisActive] = useState(false)

  function handleLogout() {
    localStorage.removeItem('token')
    props.history.push('/')
  }

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const userName = localStorage.getItem('userName')

  return <nav className="navbar is-success is-fixed-top" id="navbar">
    <div className="navbar-brand">
      <a className="navbar-item" href="/">
        {/* <img src="" alt="rmbr" height="28" /> */}
        <FontAwesomeIcon icon={faBookmark} color='#2a363b' size='2x' />
        <p className='ml-2 title is-4 has-text-dark'>rmbr</p>
      </a>
      <a role="button" className={`navbar-burger burger ${isActive ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" data-target='navbar-menu'
        onClick={() => setisActive(!isActive)}>
        <span className='is-primary' aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div className={`navbar-menu ${isActive ? 'is-active is-success' : ''}`} id='navbar-menu'>
      <div className="navbar-start">
        <Link to="/" className="navbar-item" onClick={() => setisActive(!isActive)}>
          <strong>Home</strong>
        </Link>
        {localStorage.getItem('token') &&<Link to="/account" className="navbar-item" onClick={() => setisActive(!isActive)}>Account</Link>}
        {/* <Link to="/map" className="navbar-item">Map</Link> */}
      </div>
      <div className="navbar-end">
        <div className="navbar-item">

          {!localStorage.getItem('token') && <Link className='button is-link' to='/register' onClick={() => setisActive(!isActive)}>Register</Link>}
          {!localStorage.getItem('token') && <Link to="/login" className="button is-light ml-2" onClick={() => setisActive(!isActive)}>Login</Link>}
          {/* {localStorage.getItem('token') && <p>Welcome back <Link className="is-capitalized" to={`/users/${userId}`}><strong className="is-link">{userName}</strong></Link></p>}
          {localStorage.getItem('token') && <Link to='/locations/new-location' className="button is-link">Add Location</Link>} */}
          {localStorage.getItem('token') && <button
            className="button ml-2"
            onClick={handleLogout}
          >Logout</button>}
        </div>
      </div>
    </div>
  </nav>
}

export default withRouter(NavBar)