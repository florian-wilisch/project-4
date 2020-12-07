import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'



function capitalizeFirstLetter(name) {
  // console.log(name)
  name = name[0].toUpperCase() + name.slice(1)
  return name
}


const FriendCard = (props) => {
  // for (let i = 0; i < props.elem.wants; i++) {
  //   console.log('wants:', props.elem.wants)
  // }
  const [isActive, setisActive] = useState(false)

  function handleContactEdit() {
    console.log('clicked')
    return <p>hello world</p>
  }



  return <div className='media'>
    <div className='media-content'>
      <div className='content'>
        <p>
          <strong>{capitalizeFirstLetter(props.elem.name)}</strong> 
          <br />
          {props.elem.birthday && `Birthday: ${props.elem.birthday}`}  
          {/* <br /> */}
        </p>
        {(props.elem.wants && (props.elem.wants.length !== 0 )) && <div>
          Wishes/Likes:
          <ul>
            {props.elem.wants.map((elem, index) => <li key={index}>
              <div className="level-item">
                  • {capitalizeFirstLetter(elem)}
              </div>
            </li>)}
          </ul>
        </div>}
      </div>
    </div>

    <div className='media-right '>
      <div className={`dropdown is-right is-hoverable ${isActive ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          {/* <button className="delete" onClick={() => setisActive(!isActive)}aria-haspopup="true" aria-controls="dropdown-menu6"></button> */}
          <FontAwesomeIcon className='FAicon mr-1' icon={faEdit} pull="right" size='1x' onClick={() => setisActive(!isActive)}/>
        </div>
        <div className="dropdown-menu" id="dropdown-menu6" role="menu">
          <div className="dropdown-content">
            <div className="dropdown-item">
              <p>Edit</p>
            </div>
            <div className="dropdown-item">
              <p>Delete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}


const Account = () => {
  const [userData, setUserData] = useState([])
  const [userContacts, setUserContacts] = useState([])


  const userId = localStorage.getItem('user_id')


  useEffect(() => {
    axios.get(`api/users/${userId}`)
      .then(resp => {
        console.log(resp.data)
        // console.log(userId)
        setUserData(resp.data)
        setUserContacts(resp.data.contacts)
        // for (let i = 0; i < userContacts.length; i++){
        //   console.log(userContacts[i]['name'])
        //   testContactList.push(userContacts[i])
        // }
      })
  }, [])






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

  return <section className='section mt-6'>
    <h1 className='title'>Contacts</h1>
    {/* <button onClick={() => {}}>Test</button> */}
    <div>
      {userContacts.map((elem, index) => <FriendCard elem={elem} key={index}></FriendCard>)}
    </div>
  </section>

}

export default Account