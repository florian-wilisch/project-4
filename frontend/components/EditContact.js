import React, { useEffect, useState } from 'react'
import axios from 'axios'

const EditContact = (props) => {

  const contactId = props.match.params.contactId
  const [contactData, setContactData] = useState([])
  const [wants, setWants] = useState([])

  useEffect(() => {
    console.log(contactId)
    axios.get(`/api/contacts/${contactId}`)
      .then(resp => {
        console.log(resp.data)
        setContactData(resp.data)
        setWants(resp.data.wants)
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
  
  
  function handleSubmit() {

  }

  console.log( typeof wants)

  return <section className='section my-6'>
    <h1 className='title'>Edit</h1>
    <div className="container is-fluid">
      <form className='' onSubmit={handleSubmit}>
        <div className='field '>
          <label className='label'>Name</label>
          <div className="control">
            <input
              className='input'
              type="text"
              onChange={handleChange}
              value={contactData['name'] && capitalizeFirstLetter(contactData['name'])}
              name='name'
            />
          </div>
        </div>
        {(wants !== []) && <label className='label'>Wishes/Likes</label>}
        {wants.map((w, i) => {
          return <div key={i} className='field '>
            
            <div className="control">
              <input
                className='input'
                type="text"
                onChange={handleChange}
                value={contactData['wants'][i]}
                name={`want ${i}`}
              />
            </div>
          </div>
        })}







    {/* <div className="field">
      <label className='label' onClick={() => setIsVisible(!isVisible)}>Category*</label>
    </div> */}

    {/* <div className="is-multiple control">
      <Select
        closeMenuOnSelect={false}
        value={selectedCategories}
        onChange={setSelectedCategories}
        components={makeAnimated()}
        options={options}
        isMulti
        autoFocus
        isSearchable
        placeholder="Select the category available"
        className="basic-multi-select"

      />
    </div> */}

    {/* <div className='field mt-3'>
      <label className='label'>Address*</label>
      <div className="control">
        <input
          className='input'
          type="text"
          onChange={handleChange}
          value={formData['address']}
          name='address'
          placeholder='Street and Number'
        />
      </div>
      <div className="control mt-1">
        <input
          label='postcode'
          className='input'
          type="text"
          onChange={handleChange}
          value={formData['postcode']}
          name='postcode'
          placeholder='Postcode'
        />
      </div>
      <div className="control mt-1">
        <input
          className='input'
          type="text"
          onChange={handleChange}
          value={formData['city']}
          name='city'
          placeholder='City'
        />
      </div>
    </div>

    <div className='field'>
      <label className='label'>Phone</label>
      <div className="control">
        <input
          className='input'
          type="text"
          onChange={handleChange}
          value={formData['phone']}
          name='phone'
        />
      </div>
    </div>

    <div className='field'>
      <label className='label'>Email</label>
      <div className="control">
        <input
          className='input'
          type="text"
          onChange={handleChange}
          value={formData['email']}
          name='email'
        />
      </div>
    </div>

    <div className='field'>
      <label className='label'>Website</label>
      <div className="control">
        <input
          className='input'
          type="text"
          onChange={handleChange}
          value={formData['website']}
          name='website'
        />
      </div>
    </div>
    <div className='field'>
      <label className='label'>Photo</label>
      <div className="control">
        <UploadImage
          updateImage={updateImage}
        />

      </div>
    </div>
    <div className='field'>
      <label className='label'>Description</label>
      <div className="control">
        <textarea
          className='textarea'
          type="text"
          onChange={handleChange}
          value={formData['bio']}
          name='bio'
        />
      </div>
    </div> */}

    <button type='submit' className='button is-link'>Submit</button>
  </form>
  </div></section>
}

export default EditContact