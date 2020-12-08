import React, { useEffect, useState } from 'react'
import axios from 'axios'

const EditContact = (props) => {

  const contactId = props.match.params.contactId
  const [contactData, setContactData] = useState({
    wants: []
  })
  // const [wants, setWants] = useState([])

  useEffect(() => {
    console.log(contactId)
    axios.get(`/api/contacts/${contactId}`)
      .then(resp => {
        console.log(resp.data)
        setContactData(resp.data)
        // setWants(resp.data.wants)
      })
  }, [])


  function capitalizeFirstLetter(name) {
    console.log(name)
    name = name[0].toUpperCase() + name.slice(1)
    return name
  }


  function handleChange(event) {
    const data = {
      ...contactData,
      [event.target.name]: event.target.value
    }
    console.log(data)
    setContactData(data)
  }


  function handleWantsChange(event, i) { 
  // * copy wants into locale variable
  // * mutate wants[0] to new value
  // * save wants back into state
    const data = {
      ...contactData
    }
    data.wants[i] = event.target.value
    setContactData(data)    
  }



  function emptyString(field) {
    if (field.startsWith('wants[')) {
      const i = field.charAt(6)
      const data = {
        ...contactData
      }
      console.log(contactData.field)      
      data.wants.splice(i, 1)
      return setContactData(data)
    }  else { 
      const data = {
        ...contactData,
        [field]: ''
      }
      setContactData(data)
    }
  }
  
  console.log(contactData)

  function handleSubmit() {    
  }


  return <section className='section my-6'>
    <h1 className='title'>Edit</h1>
    <div className="container is-fluid">
      <form className='' onSubmit={handleSubmit}>
        <div className='field '>
          <label className='label'>Name</label>
          <div className="control has-icons-right">
            <input
              className='input'
              type="text"
              onChange={handleChange}
              value={contactData['name'] && capitalizeFirstLetter(contactData['name'])}
              name='name'
            /><span 
              className='icon is-right'>
              <i className='delete' onClick={() => {emptyString('name')}}></i>
            </span>
          </div>
        </div>
        {(contactData.wants !== []) && <label className='label'>Wishes/Likes</label>}
        {contactData.wants.map((w, i) => {
          return <div key={i} className='field '>
            
            <div className="control has-icons-right">
              <input
                className='input'
                type="text"
                onChange={(event) => {handleWantsChange(event, i)}}
                // defaultValue={contactData.wants[i]}
                value={contactData.wants[i]}
                name={contactData.wants[i]}
              /><span 
                className='icon is-right'>
                <i className='delete' onClick={() => {emptyString(`wants[${i}]`)}}></i>
              </span>
            </div>
          </div>
        })}

// * add another one


    <button type='submit' className='button is-link'>Submit</button>
  </form>
  </div></section>
}

export default EditContact