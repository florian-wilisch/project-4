import React from 'react'
import { BrowserRouter, Switch, Link, Route } from 'react-router-dom'
import './styles/style.scss'


import Home from './components/Home'
import Navbar from './components/Navbar'
import Account from './components/Account'
import Login from './components/Login'
import EditContact from './components/EditContact'

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/account" component={Account} />
      <Route exact path="/contacts/:contactId/edit" component={EditContact} />
      <Route exact path="/hello/world" component={MyPage} />
    </Switch>
  </BrowserRouter>
)

// const Home = () => <Link to={'/hello/world'}>
//   Go to /hello/world page.
// </Link>

const MyPage = () => {
  return <p>
    Hello World
  </p>
}

export default App