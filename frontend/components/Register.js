import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Register = (props) => {
  // console.log(props)
  const [formData, updateFormData] = useState({
    username: '',
    email: '',
    password: '',
    google_Auth_Token: 'Unregistered'
  })

  const [errors, updateErrors] = useState({
    username: '',
    email: '',
    password: ''
  })

  
  function handleChange(event) {

    const name = event.target.name

    const value = event.target.value

    const data = {
      ...formData,
      [name]: value
    }
    const newErrors = {
      ...errors,
      [name]: ''
    }

    updateFormData(data)
    updateErrors(newErrors)
  }


  function handleSubmit(event) {
    event.preventDefault()
    axios.post('/api/signup', formData)
      .then(resp => {
        if (resp.data.errors) {
          updateErrors(resp.data.errors)
          console.log(errors)
        } else {
          console.log(formData)
          props.history.push('/login')
        }
      })

  }

  console.log(formData)

  return <section className='hero is-fullheight-with-navbar'>
    <div className="hero-body">
      <div className="container is-fluid mt-5">
        <h1 className='title'>Registration</h1>

        <form onSubmit={handleSubmit} className='mb-5'>
          <div className="field">
            <label className="label">Username</label>
            <div className="control">
              <input
                type="text"
                onChange={handleChange}
                value={formData.username}
                name="username"
                className="input"
              />
              {errors.username && <p className="help" style={{ color: 'red' }}>
                {'There was a problem with your Username'}
              </p>}
            </div>
            <p className="help">Please choose a unique username</p>
          </div>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                type="text"
                onChange={handleChange}
                value={formData.email}
                name="email"
                className="input"
              />
              {errors.email && <p className="help" style={{ color: 'red' }}>
                {'There was a problem with your Email'}
              </p>}
            </div>
            <p className="help">e.g. example@example.com</p>
          </div>

          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                type="password"
                onChange={handleChange}
                value={formData.password}
                name="password"
                className="input"
              />
              {errors.password && <p className="help" style={{ color: 'red' }}>
                {'There was a problem with your Password'}
              </p>}
            </div>
            <p className="help">Create a password</p>
          </div>
          <div className="field">
            <label className="label">Confirm Password</label>
            <div className="control">
              <input
                type="password"
                // onChange={handleChange}
                value={formData.passwordConfirmation}
                name="passwordConfirmation"
                className="input"
              />
              {errors.passwordConfirmation && <p className="help" style={{ color: 'red' }}>
                {'Does not match password'}
              </p>}
            </div>
            <p className="help">Please make sure your passwords match</p>
          </div>
          <div className="field is-grouped is-grouped-right">
            <p className="control">
              <button className="button is-link">
                Register
              </button>
            </p>
          </div>
        </form>

        <hr className="has-background-success"></hr>
        <div className="columns is-vcentered is-mobile mb-0">
          <div className='column help'>Already registered?</div>
          <div className="column is-narrow">
            <Link to='/login' className="button is-small is-light">Login</Link>
          </div>
        </div>

      </div>
    </div>
  </section>

}

export default Register