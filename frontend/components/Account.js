import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'

let refreshPage = false

function capitalizeFirstLetter(name) {
  // console.log(name)
  name = name[0].toUpperCase() + name.slice(1)
  return name
}


const Account = () => {
  const [userData, setUserData] = useState([])
  const [userContacts, setUserContacts] = useState([])
  const [reloadPage, setReloadPage] = useState(false)
  const [isActive, setisActive] = useState(false)
  // const [test, runtest] = useState(true)
  let activeIndex = null

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('user_id')

  console.log('running')

  useEffect(() => {
    axios.get(`api/users/${userId}`)
      .then(resp => {
        console.log(resp.data)
        setUserData(resp.data)
        setUserContacts(resp.data.contacts)
      })
  }, [])


  function handleContactEdit() {
    console.log('clicked')
    return <p>hello world</p>
  }


  function handleContactDelete(id) {
    // console.log('triggered')
    axios.delete(`/api/contacts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {      
        // setReloadPage(!reloadPage)
        location.reload()
      })
  }


  if (userData === []) {
    return <div className='section'>
      <div className='container'>
        <div className='title'>
          Loading ...
        </div>
        <progress className='progress is-small is-link' max='100'>60%</progress>
      </div>
    </div>
  }

  return <section className='section mt-6 mx-2'>
    <h1 className='title'>Contacts</h1>
    <div>
      {userContacts.map((elem, index) => {      
        return <div key={index} className='media'>
          <div className='media-content'>
            <div className='content'>
              <p>
                <strong>{capitalizeFirstLetter(elem.name)}</strong>
                <br />
                {elem.birthday && `Birthday: ${elem.birthday}`}
                {/* <br /> */}
              </p>
              {(elem.wants && (elem.wants.length !== 0)) &&
                <p className=''>Wishes/Likes:</p>}
              <ul>
                {elem.wants.map((elem, index) => <li key={index}>
                  {capitalizeFirstLetter(elem)}
                </li>)}
              </ul>
            </div>
          </div>

          <div className='media-right '>
            <div className={`dropdown is-right is-hoverable ${(isActive && (activeIndex === index)) ? 'is-active' : ''}`}>
              <div className="dropdown-trigger">
                {/* <button className="delete" onClick={() => setisActive(!isActive)}aria-haspopup="true" aria-controls="dropdown-menu6"></button> */}
                <FontAwesomeIcon className='has-text-grey mt-1' icon={faEdit} pull="right" size='1x' onClick={() => {
                  activeIndex = index
                  setisActive(!isActive)
                }} />
              </div>
              <div className="dropdown-menu" id="dropdown-menu6" role="menu">
                <div className="dropdown-content">
                  <div className="dropdown-item button m-1">
                    <Link to={`/contacts/${elem.id}/edit`}>Edit</Link>  
                  </div>              
                  <div className="dropdown-item button m-1" onClick={() => {
                    handleContactDelete(elem.id)
                  }}>Delete
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      })}
    </div>
  </section>
}

export default Account