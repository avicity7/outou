import { Stack, Text, Spinner, Card, CardBody } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { getDocs, setDoc, doc, collection, onSnapshot, deleteDoc } from "@firebase/firestore"
import { firestore } from "../utils/firebase"
import { Icon } from '@iconify-icon/react'
import { useRouter } from "next/router"
var rand = require('csprng')

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


const Team = () => {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState('')
  const [questions, setQuestions] =  useState<any | null>([])
  console.log(router.query.room)

  const getRoomQuestions = async (roomCode: any) => {
    await onSnapshot(doc(firestore, 'rooms', roomCode), (docSnap) => {
      let data = docSnap.data()
      setQuestions(data?.questions)
    })
  }

  const removeQuestion = async (question: any) => {
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
                {questions.map((question: any) => (
                  <li key={question}>
                    <div>
                      <Card className="my-5">
                        <CardBody>
                          <div className="flex flex-row justify-between items-center">
                            <Text className="text-xl mr-3 text-center">{question}</Text>
                            <button className="flex justify-center text-gray-300 hover:text-red-400" onClick={() => {removeQuestion(question)}}>
                             <Icon icon="ph:trash-simple-bold"/>
                            </button>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </li>
                ))}
              </ul>
            </Stack>
          </div>
        }
      </Stack>
    </div>
  )
}

export default Team 