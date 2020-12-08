import React, { useEffect, useState } from 'react'
import axios from 'axios'
import regeneratorRuntime from "regenerator-runtime"
import Vocal from '@untemps/react-vocal'
import { Link } from 'react-router-dom'
var $ = require("jquery")

let contactFound = false
let requestType = []
let wantsList = []
let strTest = ''

const Home = () => {
  const [searchVal, getSearchVal] = useState('')
  const [updateSearch, setUpdateSearch] = useState(false)
  const [currentContact, setCurrentContact] = useState('None')
  const [currentEvent, setCurrentEvent] = useState('None')
  const [natLangResult, setNatLangResult] = useState([])
  const [currentBirthday, setCurrentBirthday] = useState('None')
  const [currentWant, setCurrentWant] = useState('None')
  const [wantList, setWantList] = useState([])
  const [contactList, setContactList] = useState([])
  const [birthdayDay, setBirthdayDay] = useState('')
  const [birthdayMonth, setBirthdayMonth] = useState('')
  const [formattedWantList, setFormattedWantList] = useState('')
  const [recording, setRecording] = useState(false)
  // const [requestType, setRequestType] = useState([])

  // const [contactFound, setContactFound] = useState(false)

  const NatLangUrl = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${process.env.GoogleNatLangKey}`
  // console.log(NatLangUrl)
  const birthKeyWords = ['birthday', 'born']


  function goPython() {
    $.ajax({
      url: "./quickstart.py"
    }).done(function () {
      alert('finished python script')
    })
  }

  function formatWants(list) {

    console.log('NAME:', list)
    for (let i = 0; i < list.length; i++) {
      // setFormattedWantList(formattedWantList + `\n\u2022${list[i]}`)
      strTest = strTest + `\n\u2022${list[i]}`
    }
    console.log('Formatted List:', strTest)
    setFormattedWantList(strTest)
    // console.log('WANT LIST:', formattedWantList)

  }


  useEffect(() => {
    axios.post(NatLangUrl, {
      'encodingType': 'UTF8',
      'document': {
        'type': 'PLAIN_TEXT',
        'content': searchVal
      }
    })
      .then(axiosResp => {
        console.log('NatLang results: ', axiosResp.data.entities)
        setNatLangResult(axiosResp.data.entities)
        setUpdateSearch(false)
      })
  }, [updateSearch])

  useEffect(() => {
    axios.get('/api/users/1')
      .then(axiosResp => {
        setContactList(axiosResp.data.contacts)
      })
  }, [currentContact])


  function getContactName(name) {
    setTimeout(() => {
      console.log("CONTACT NAME:", name)
      console.log("CONTACT LIST:", contactList)
      for (let i = 0; i < contactList.length; i++) {
        // console.log("Friend name", contactList[i]['name'])
        // console.log('NATLANG result', name)
        if (contactList[i]['name'] === name) {
          setWantList(contactList[i]['wants'])
          formatWants(contactList[i]['wants'])
          console.log('wantlist:', wantList)
          contactFound = true
          console.log('FOUND')
          console.log('TEST Here', contactList[i])
          if (requestType.includes('WANT')) {
            addContactWant(contactList[i]['id'], currentWant)
          }
          if (requestType.includes('BIRTHDAY')) {
            addContactBirthday(contactList[i]['id'])
          }
        }
      }
      if (contactFound === false) {
        // console.log("RETURN THE BETTER FUNCT")
        addNewContact(name, currentWant)
      }
    }, 1000)
  }

  function addContactWant(id, want) {
    axios.get(`/api/contacts/${id}`)
      .then(resp => {
        const currentWant = resp.data['wants']
        for (let i = 0; i < want.length; i++)
          if (currentWant.includes(want[i]) === false) {
            currentWant.push(want[i])
          }
        console.log('WANT TEST:', typeof want)
        axios.put(`/api/users/1/contacts/${id}`, {
          'name': resp.data['name'],
          'wants': currentWant
        })
        console.log(`Added ${want} to ${resp.data['name']}'s want list`)
      })
  }

  function addContactBirthday(id, birthday) {
    axios.get(`/api/contacts/${id}`)
      .then(resp => {
        axios.put(`/api/users/1/contacts/${id}`, {
          'name': resp.data['name'],
          'birthday': currentBirthday
        })
      })
  }


  function addNewContact(name, want) {
    console.log(`Created new contact: ${name}`)
    axios.post('api/users/1/contacts', {
      'name': name,
      'wants': []
    })
      .then((response) => {
        console.log('TYPE', requestType)
        // Check if we also want to add a "want":
        if (requestType.includes('WANT')) {
          console.log("REACHED WANT")
          addContactWant(response.data['id'], currentWant)
        }
        // Check if we want to add a birthday:
        if (requestType.includes('BIRTHDAY')) {
          console.log("REACHED BIRTHDAY")
          addContactBirthday(response.data['id'], currentBirthday)
        }
      })
  }

  function googleLoginTest() {
    axios.post(`/api/users/test`, {
      'summary': `${currentContact}'s birthday!`,
      'description': `${currentContact}'s Wishlist: ${strTest}`,
      'start': {
        'dateTime': `2020-${birthdayMonth}-${birthdayDay}T14:30:00`,
        'timeZone': 'Europe/Zurich'
      },
      'end': {
        'dateTime': `2020-${birthdayMonth}-${birthdayDay}T17:00:00`,
        'timeZone': 'Europe/Zurich'
      },
      'reminders': {
        'useDefault': false,
        'overrides': [
          { 'method': 'email', 'minutes': 40320 },
          { 'method': 'popup', 'minutes': 40320 }
        ]
      }

    })
  }





  useEffect(() => {

    for (let i = 0; i < natLangResult.length; i++) {
      const element = natLangResult[i]
      if (element['type'] === 'PERSON') {
        setCurrentContact(element['name'])
      }
      if (element['type'] === 'EVENT') {
        if (element['name'] === 'birthday') {
          setCurrentEvent(element['name'])
          requestType.push('BIRTHDAY')
          console.log(requestType)
        }
      }
      if (element['type'] === 'DATE') {
        let day = element['metadata']['day']
        let month = element['metadata']['month']
        let year = ''
        if ((element['metadata']['year'])) {
          year = element['metadata']['year']
        }
        if (Number(element['metadata']['day']) < 10) {
          day = '0' + element['metadata']['day']
        }
        if (Number(element['metadata']['month']) < 10) {
          month = '0' + element['metadata']['month']
        }
        if (year === '') {
          setCurrentBirthday(day + '/' + month)
          setBirthdayDay(day)
          setBirthdayMonth(month)
        } else {
          setCurrentBirthday(day + '/' + month + '/' + year)
        }

        console.log(day + '/' + month + '/' + year)
      }
      if ((element['type'] === 'CONSUMER_GOOD') || (element['type'] === 'WORK_OF_ART') || (element['type'] === 'OTHER')) {
        // setCurrentWant(element['name'])
        console.log(element['name'])
        wantsList.push(element['name'])
      }
    }
    if (wantsList.length > 0) {
      setCurrentWant(wantsList)
    }
  }, [natLangResult])

  function resetAllValues() {
    contactFound = false
    requestType = []
    wantsList = []
    strTest = ''
    setResult('')
    getSearchVal('')
    setUpdateSearch(false)
    setCurrentContact('None')
    setCurrentEvent('None')
    setNatLangResult([])
    setCurrentBirthday('None')
    setCurrentWant('None')
    setWantList([])
    setContactList([])
    setBirthdayDay('')
    setBirthdayMonth('')
    setFormattedWantList('')
  }


  // Voice Stuff Starts //
  const [result, setResult] = useState('')

  const _onVocalStart = () => {
    resetAllValues()
    setRecording(true)
    setResult('')
  }

  const _onVocalResult = (result) => {
    setRecording(false)
    getSearchVal(result.toLocaleLowerCase())
    console.log('RESULTS', result)
    setResult(result)
    setUpdateSearch(true)
  }
  // Voice Stuff Ends //

  useEffect(() => {
    console.log(searchVal.split(' '))
    for (let index = 0; index < searchVal.split(' ').length; index++) {
      const element = searchVal.split(' ')[index]
      if ((birthKeyWords.includes(element))) {
        setCurrentEvent('Birthday')
        requestType.push('BIRTHDAY')
      }
      if ((element === 'wants') || (element === 'needs') || (element === 'likes')) {
        setCurrentEvent('Wants')
        requestType.push('WANT')
      }
      if ((element === 'need') || (element === 'have')) {
        setCurrentEvent('Task')
      }
    }
  }, [updateSearch])

  return <section className='homepage'>




    <section className='hero is-fullheight-with-navbar' >
      <div className="hero-body is-align-items-center has-text-centered">




        <div className="container has-text-centered" >
        {/* <button id="speech" className="btn" style={{ position: 'relative', marginTop: '25%' }}> */}

          {/* <i className="fa fa-microphone" aria-hidden="true"></i> */}


        {/* </button> */}
        <Vocal
            onStart={_onVocalStart}
            onResult={_onVocalResult}
            style={{ width: 100, height: 100, position: 'absolute', left: '17%', top: '17%' }}
            
          >
            <button id="speech" className="btn" data-testid="__vocal-root__" role="button" aria-label="start recognition" style={{position: 'relative', marginTop: '25%'}}>
{/* <svg data-testid="__icon-root__" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
<path data-testid="__icon-path__" fill="black" d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path>
</svg> */}
          {recording ? (<div className="pulse-ring"></div>): ''}
          
            </button>
          </Vocal>

          {/* <span style={{ position: 'relative' }}> */}

          {/* <input defaultValue={result} style={{ width: 300, height: 40 }} /> */}
          {/* </span> */}


          <form onSubmit={(e) => {
            e.preventDefault()
            getSearchVal(result.toLocaleLowerCase())
            console.log('search value: ', searchVal)
            setUpdateSearch(!updateSearch)
          }}>
            <input placeholder="Input Request" defaultValue={result} style={{ width: 300, height: 40 }} onChange={(e) => {
              getSearchVal(e.target.value.toLocaleLowerCase())
              setResult(e.target.value.toLocaleLowerCase())
            }}></input>
            <button style={{ height: 40 }}>Submit</button>
          </form>
          <div>
            <h1>Contact: {currentContact}</h1>
            <h1>Request type: {currentEvent}</h1>
            <h1>birthday: {currentBirthday}</h1>
            <h1>Wants: {currentWant}</h1>
            <button onClick={(e) => {
              if (currentContact.toLowerCase() !== 'none') {
                getContactName(currentContact.toLowerCase())

              }
            }
            }>Click test</button>
          </div>

          <button onClick={() => {
            googleLoginTest()
          }}>
            <h1> Run my python Calendar script</h1>
          </button>
          <button onClick={(e) => {
            resetAllValues()
          }
          }>Reset all</button>

        </div>
      </div>
    </section>
  </section>
}

export default Home