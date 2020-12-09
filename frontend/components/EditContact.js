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

  function handleNewWantsChange(event, i) { 
    const data = [
      ...newWants
    ]
    data[i] = event.target.value
    setNewWants(data)
    // setNewWants(
    //   newWants[i] = event.target.value
    // )
    // console.log(newWants)
  
  }
  
  const [newWants, setNewWants] = useState([''])

  function addWantField(event) {
    if (!event.target.value) {
      const data = [
        ...newWants
      ]
      data.push('')
      setNewWants(data)
    }
  }

  console.log(newWants)


  function emptyString(field) {
    console.log(field)
    if (field.startsWith('wants[')) {
      const i = field.charAt(6)
      const data = {
        ...contactData
      }
      console.log(contactData.field)      
      data.wants.splice(i, 1)
      return setContactData(data)      
    } else if (field.startsWith('newWants[')) {
      const i = field.charAt(9)
      const data = [
        ...newWants
      ]
      data.splice(i, 1)
      return setNewWants(data)
    } else { 
      const data = {
        ...contactData,
        [field]: ''
      }
      setContactData(data)
    }
  }
  
  console.log(contactData)

  function handleSubmit(event) {
    event.preventDefault()
    console.log(event)
    const token = localStorage.getItem('token')

    newWants.splice(newWants.indexOf(''), 1)
    const initialWants = contactData.wants
    const finalWants = initialWants.concat(newWants)
    const finalData = {
      ...contactData,
      wants: finalWants
    }
    console.log(finalData)
    axios.put(`/api/contacts/${contactId}`, finalData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        props.history.push('/account')        
      })
  }


  return <section className='section mt-6 mb-3'>
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
        <div className='field '>
          <label className='label'>Birthday</label>
          <div className="control has-icons-right">
            <input
              className='input'
              type="text"
              onChange={handleChange}
              value={contactData['birthday']}
              name='birthday'
            /><span 
              className='icon is-right'>
              <i className='delete' onClick={() => {emptyString('birthday')}}></i>
            </span>
          </div>
        </div>
        <label className='label'>Wishes/Likes</label>
        {(contactData.wants !== []) && contactData.wants.map((w, i) => {
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

        {newWants.map((w, i) => {
          return <div key={i} className='field '>            
            <div className="control has-icons-right">
              <input
                className='input'
                type="text"
                onFocus={addWantField}
                onBeforeInputCapture
                onChange={(event) => {handleNewWantsChange(event, i)}}
                // defaultValue={contactData.wants[i]}
                value={newWants[i]}
                name={newWants[i]}
                placeholder='Add one by typing here...'
              /><span 
                className='icon is-right'>
                <i className='delete' onClick={() => {emptyString(`newWants[${i}]`)}}></i>
              </span>
            </div>
          </div>
        })}

        {/* <div className='field '>           
          <div className="control has-icons-right">
            <input
              className='input'
              type="text"
              // onChange={(event) => {addWant(event)}}
              onFocus={addWantField}
              onChange={(event) => {

                handleNewWantsChange(event, (newWants.length - 1))
              }}
              // defaultValue={contactData.wants[i]}
              value={newWants[(newWants.length)]}
              name={newWants[(newWants.length)]}
              placeholder='Standalone - Add one by typing here...'
            /><span 
              className='icon is-right'>
              <i className='delete' onClick={() => {emptyString(`wants[${i}]`)}}></i>
            </span>
          </div>
        </div> */}


        <button type='submit' className='button is-link mt-2'>Save</button>
      </form>
    </div>
  </section>
}

export default EditContact