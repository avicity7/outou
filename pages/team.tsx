import { Stack, Text, Spinner, Card, CardBody } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { getDocs, setDoc, doc, collection, onSnapshot, deleteDoc } from "@firebase/firestore"
import { firestore } from "../utils/firebase"
import { Icon } from '@iconify-icon/react'
import { useRouter } from "next/router"
var rand = require('csprng')

import QuestionCard from "@/components/questionCard"

const generateRandomRoom = () => {
  return new Promise(resolve => {
    let generatedNumber = rand(30,36)
    onSnapshot(doc(firestore, 'rooms', generatedNumber), (docSnap) => {
      let data = docSnap.data()
      if (data !== undefined) {
        generateRandomRoom()
      }
      else { 
        resolve(generatedNumber)
      }
    })
  })
}

export async function getServerSideProps(ctx: any) {
  const roomCode = ctx.query.room
  const accessCode = ctx.query.accessCode
  
  const getAccessCode = () => {
    return new Promise(resolve => {
      onSnapshot(doc(firestore, 'rooms', roomCode), (docSnap) => {
        let data = docSnap.data()
        if (data?.accessCode === accessCode) {
          resolve(true)
        }
        else {
          resolve(false)
        }
      })
    })
  }

  let found = await getAccessCode()
  
  if (!found) {
    return {
      notFound: true
    }
  }
  return {
    props: {}
  }
}


const Team = () => {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState('')
  const [questions, setQuestions] =  useState<any | null>([])
  const [answer, setAnswer] = useState('')

  const getRoomQuestions = async (roomCode: any) => {
    await onSnapshot(doc(firestore, 'rooms', roomCode), (docSnap) => {
      let data = docSnap.data()
      setQuestions(data?.questions.reverse())
    })
  }

  const removeQuestion = async (question: any) => {
    const ref = doc(firestore, "rooms", String(roomCode))
    questions.splice(questions.indexOf(question),1)
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

  const addAnswer = async (question: any, answer:any) => {
    getRoomQuestions(localStorage.getItem('room'))
    let roomCode = localStorage.getItem('room')
    const ref = doc(firestore, "rooms", String(roomCode))
    questions[questions.indexOf(question)].answer = answer
    let data = {
      questions: questions
    }
    try {
      setDoc(ref,data,{merge: true})
    }
    catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!router.isReady) return 
    setRoomCode(router.query.room as any)
    getRoomQuestions(router.query.room)
  },[router.isReady, router.query.room])

  return (
    <div className="flex justify-center mt-10 font-outfit">
      <Stack>
        <Text className="text-xl text-center">Your Room Code is</Text>
        {roomCode === '' &&
          <div className="flex flex-row justify-center">
            <Spinner />
          </div>
        }
        {roomCode !== '' && questions !== undefined &&
          <div className="flex justify-center">
            <Stack>
              <Text className="text-3xl font-semibold mb-3 text-center">{roomCode}</Text>
              <Text className="font-shippori text-lg font-light text-gray-400 text-center">Questions</Text>
              <ul>
                {questions.reverse().map((question: any) => {
                  return (
                    <li key={question.question}>
                      <QuestionCard question={question} onClick={() => {removeQuestion(question)}} setAnswer={(e: any) => {setAnswer(e.target.value)}} addAnswer={() => {addAnswer(question, answer)}}/>
                    </li>
                  )
                })}
              </ul>
            </Stack>
          </div>
        }
      </Stack>
    </div>
  )
}



export default Team 