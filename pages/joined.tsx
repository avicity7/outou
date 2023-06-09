import { Stack, Text, Textarea } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { getDocs, setDoc, doc, collection, onSnapshot } from "@firebase/firestore"
import { firestore } from "../utils/firebase"
import { DateTime } from "luxon";
var rand = require('csprng')

import QuestionCard from "@/components/questionCard"

const Joined = () => {
  const [question, setQuestion] = useState('')
  const [slowModeDuration, setSlowModeDuration] = useState(0)
  interface QuestionProvider {
    question: string,
    answer: string,
    author: string,
    timestamp: string
  }
  const [questions, setQuestions] =  useState<QuestionProvider[]>([])
  const [error, setError] = useState('')

  const removeQuestion = async (question: any) => {
    let roomCode = localStorage.getItem('joinedRoom')
    const ref = doc(firestore, "rooms", String(roomCode))
    questions.splice(questions.indexOf(question),1)
    let data = {
      questions: questions
    }
    try {
      setDoc(ref,data)
      localStorage.setItem('room',String(roomCode))
    }
    catch(err) {
      console.log(err)
    }
  }

  const getRoomQuestions = async () => {
    let roomCode = localStorage.getItem('joinedRoom')
    await onSnapshot(doc(firestore, 'rooms', String(roomCode)), (docSnap) => {
      let data = docSnap.data()
      setQuestions(data?.questions.reverse())
      setSlowModeDuration(data?.slowMode)
    })
  }

  const submitQuestion = async () => {
    getRoomQuestions()
    let difference = 5
    for (let i = questions.length - 1; i >= 0; i--) {
      if (questions[i].author === localStorage.getItem('identity')) {
        let now = String(DateTime.now().toISO())
        let end = DateTime.fromISO(now)
        let start = DateTime.fromISO(questions[i].timestamp)

        difference = end.diff(start,"seconds").toObject().seconds as number | 0
      }
    }
    if (difference >= slowModeDuration) {
      setError('')
      let roomCode = localStorage.getItem('joinedRoom')
      const ref = doc(firestore, "rooms", String(roomCode))
      questions.push({question:question, answer: null as any, author: localStorage.getItem('identity') as any , timestamp: DateTime.now().toISO() as any})
      let data = {
        questions: questions
      }
      try {
        setDoc(ref,data,{merge: true})
        localStorage.setItem('room',String(roomCode))
      }
      catch(err) {
        console.log(err)
      }
    }
    else{ 
      setError("Oops! You're sending questions too fast, try again in "+Math.ceil(5 - difference)+" seconds")
    }
  }

  useEffect(() => {
    getRoomQuestions()
    if (localStorage.getItem('identity') === null) {
      localStorage.setItem('identity',String(rand(120,36)))
    }
  },[])

  return ( 
    <div className="flex h-screen">
      <Stack className="m-auto">
        <Text className="font-outfit text-2xl font-regular text-center mb-5">Ask a Question</Text>
        <form onSubmit={submitQuestion}>
          <Textarea autoCapitalize="off" focusBorderColor="black" onChange={(e) => {setQuestion(e.target.value)}}/>
          {error !== '' &&
            <div className="flex justify-center">
              <Text className="font-outfit font-semibold text-red-400 pt-2">{error}</Text>
            </div>
          }
          <div className="flex justify-center">
            <button onClick={(e) => {e.preventDefault(); if (question !== '') submitQuestion()}}>
             <Text className="font-outfit text-lg font-regular px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white rounded-full mt-5">Ask</Text>
            </button>
          </div>
        </form>
        <Text className="flex justify-center font-shippori text-gray-400 pt-5">My Questions</Text>
        <ul>
          {questions.map((question: any) => {
            if (question.author === localStorage.getItem('identity')) {
              return (
                <li key={question.question}>
                  <QuestionCard question={question} onClick={() => {removeQuestion(question)}} setAnswer={null} addAnswer={null} />
                </li>
              )
            }
          })}
        </ul>
      </Stack>
    </div>
  )
}

export default Joined