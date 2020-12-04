import React, { useState } from 'react'
import axios from 'axios'

const Login = (props) => {

  const [formData, updateFormData] = useState({
    email: '',
    password: ''
  })

  const [errorMessage, updateErrorMessage] = useState('')

  function handleChange(event) {
    const data = {
      ...formData,
      [event.target.name]: event.target.value
    }
    updateFormData(data)
  }

  function handleSubmit(event) {
    event.preventDefault()

    axios.post('/api/login', formData)
      .then(resp => {

        localStorage.setItem('token', resp.data.token)
        localStorage.setItem('user_id', resp.data.user_id)
        localStorage.setItem('user_name', resp.data.user_name)
        // localStorage.setItem('userEmail', resp.data.userEmail)
        // localStorage.setItem('userAvatar', resp.data.userAvatar)
        // localStorage.setItem('userBio', resp.data.userBio)
        // localStorage.setItem('userCity', resp.data.userCity)
        console.log(resp)
        console.log(localStorage)
        props.history.push('/')
      })
      .catch(error => {
        updateErrorMessage(error.response.statusText)
      })
  }

  return <section className='hero is-fullheight-with-navbar'>
    <div className="hero-body">
      <div className="container is-fluid my-5">
        <form onSubmit={handleSubmit}>
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
            </div>
            <p className="help">Please enter your password</p>
            {errorMessage !== '' && <p className="help" style={{ color: 'red' }}>
              {'Unable to log in, please check your username and password are correct'}
            </p>}
          </div>
          <div className="field is-grouped is-grouped-right">
            <p className="control">
              <button className="button is-link">
                Log In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </section>
}

export default Login