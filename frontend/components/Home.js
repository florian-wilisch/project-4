import React, { useEffect, useState } from 'react'
import axios from 'axios'
import regeneratorRuntime from "regenerator-runtime";
import Vocal from '@untemps/react-vocal'

let contactFound = false


const Home = () => {
  const [searchVal, getSearchVal] = useState('')
  const [updateSearch, setUpdateSearch] = useState(false)
  const [currentContact, setCurrentContact] = useState('None')
  const [currentEvent, setCurrentEvent] = useState('None')
  const [natLangResult, setNatLangResult] = useState([])
  const [currentBirthday, setCurrentBirthday] = useState('None')
  const [currentWant, setCurrentWant] = useState('None')
  const [contactList, setContactList] = useState([])
  // const [contactFound, setContactFound] = useState(false)

  const NatLangUrl = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${process.env.GoogleNatLangKey}`
  // console.log(NatLangUrl)
  const birthKeyWords = ['birthday', 'born on']


  useEffect(() => {
    axios.post(NatLangUrl, {
      'encodingType': 'UTF8',
      'document': {
        'type': 'PLAIN_TEXT',
        'content': searchVal
      }
    })
      .then(axiosResp => {
        console.log(axiosResp.data.entities)
        setNatLangResult(axiosResp.data.entities)
        setUpdateSearch(false)
      })
  }, [updateSearch])

  useEffect(() => {
    axios.get('/api/users/1')
      .then(axiosResp => {
        setContactList(axiosResp.data.contacts)

      })

  }, [])


  function getContactName(name) {

    setTimeout(() => {
      console.log("LEN", contactList.length - 1)
      for (let i = 0; i < contactList.length; i++) {
        // console.log("Friend name", contactList[i]['name'])
        // console.log('NATLANG result', name)
        if (contactList[i]['name'] === name) {
          contactFound = true
          console.log('FOUND')
          console.log(contactList[i])
          addContactWant(contactList[i]['id'], currentWant)
        }
      }
      if (contactFound === false) {
        // console.log("RETURN THE BETTER FUNCT")
        addNewContact(name, currentWant)
      }
    }, 1000)

  }

  function addContactWant(id, want) {
    axios.get(`/api/users/1/contacts/${id}`)
      .then(resp => {
        const currentWant = resp.data['wants']
        if (currentWant.includes(want) == false) {
          currentWant.push(want)
        }
        axios.put(`/api/users/1/contacts/${id}`, {
          'name': resp.data['name'],
          'wants': currentWant
        })
      })

  }
  function addContactBirthday(id, birthday) {
    axios.get(`/api/users/1/contacts/${id}`)
      .then(resp => {
        axios.put(`/api/users/1/contacts/${id}`, {
          'name': resp.data['name'],
          'birthday': currentBirthday
        })
      })

  }

  function addNewContact(name, want) {
    console.log(want)
    axios.post('api/users/1/contacts', {
      'name': name,
      'wants': []
    })
      .then((response) => {
        // Check if we also want to add a "want":
        if (currentWant !== 'None') {
          addContactWant(response.data['id'], currentWant)
        }
        // Check if we want to add a birthday:
        if (currentBirthday !== 'None') {
          console.log()
          addContactBirthday(response.data['id'], currentBirthday)
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
        }
      }
      if (element['type'] === 'DATE') {
        let day = element['metadata']['day']
        let month = element['metadata']['month']
        if (Number(element['metadata']['day']) < 10 ){
          day = '0' + element['metadata']['day']
        }
        if (Number(element['metadata']['month']) < 10 ){
          month = '0' + element['metadata']['month']
        }
        setCurrentBirthday(day + '/' + month)
        console.log(element['metadata']['day'] + '/' + element['metadata']['month'])
      }
      if ((element['type'] === 'CONSUMER_GOOD') || (element['type'] === 'WORK_OF_ART')) {
        setCurrentWant(element['name'])
      }
    }
  }, [natLangResult])


  // Voice Stuff Starts //
  const [result, setResult] = useState('')

  const _onVocalStart = () => {
    setResult('')
  }

  const _onVocalResult = (result) => {
    getSearchVal(result)
    setResult(result)
    setUpdateSearch(true)
  }
  // Voice Stuff Ends //

  useEffect(() => {
    console.log(searchVal.split(' '))
    for (let index = 0; index < searchVal.split(' ').length; index++) {
      const element = searchVal.split(' ')[index]
      if ((element === 'wants') || (element === 'needs')) {
        setCurrentEvent('Wants')
      }
      if ((element === 'need') || (element === 'have')) {
        setCurrentEvent('Task')
      }
    }
  }, [updateSearch])

  return <section>
    <span style={{ position: 'relative' }}>
      <Vocal
        onStart={_onVocalStart}
        onResult={_onVocalResult}
        style={{ width: 16, position: 'absolute', right: 10, top: -2 }}
      />
      <input defaultValue={result} style={{ width: 300, height: 40 }} />
    </span>
    <div>
      <form onSubmit={(e) => {
        e.preventDefault()
        console.log(searchVal)
        setUpdateSearch(true)
      }}>
        <input placeholder="Input Request" onChange={(e) => {
          getSearchVal(e.target.value.toLocaleLowerCase())
        }}></input>
        <button>Submit</button>
      </form>
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
  </section>
}

export default Home