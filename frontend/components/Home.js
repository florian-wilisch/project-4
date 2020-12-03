import React, { useEffect, useState } from 'react'
import axios from 'axios'
import regeneratorRuntime from "regenerator-runtime";
import Vocal from '@untemps/react-vocal'


const Home = () => {
  const [searchVal, getSearchVal] = useState('')
  const [updateSearch, setUpdateSearch] = useState(false)
  const [currentContact, setCurrentContact] = useState('None')
  const [currentEvent, setCurrentEvent] = useState('None')
  const [natLangResult, setNatLangResult] = useState([])
  const [currentBirthday, setCurrentBirthday] = useState('None')

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
        setCurrentBirthday(element['name'])
        console.log(element['name'])
      }
    }
  }, [natLangResult])
  const [result, setResult] = useState('')
   
  const _onVocalStart = () => {
     setResult('')
  }
  
  const _onVocalResult = (result) => {
    getSearchVal(result)
     setResult(result)
     setUpdateSearch(true)
  }
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
    <button onClick={(e) => {
      console.log('clicked')
    }
    }>Click test</button>

  </div>
  </section>
}

export default Home