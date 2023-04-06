import { Stack, Text, Spinner, Card, CardBody } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { getDocs, setDoc, doc, collection, onSnapshot, deleteDoc } from "@firebase/firestore"
import { firestore } from "../utils/firebase"
import { Icon } from '@iconify-icon/react'
import { useRouter } from "next/router"

const getLastRoomID = async() => {
  let roomArray = Array()
  const rooms = await getDocs(collection(firestore, 'rooms'))
  rooms.forEach((room) => {
    roomArray.push(room.id)
  })
  return parseInt(roomArray[roomArray.length - 1]) + 1
}


const Host = () => {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState('')
  const [questions, setQuestions] =  useState<any | null>([]);

  const closeRoom = async () => {
    router.back()
    await deleteDoc(doc(firestore, 'rooms', roomCode))
    localStorage.setItem('room','')
  }

  const createRoom = async () => {
    const lastRoomID = await getLastRoomID()
    const ref = doc(firestore, "rooms", String(lastRoomID))
    let data = {
      questions: []
    }
    try {
      setDoc(ref,data)
      setRoomCode(String(lastRoomID))
      localStorage.setItem('room',String(lastRoomID))
    }
    catch(err) {
      console.log(err)
    }
  }

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
    if (localStorage.getItem('room') === null || localStorage.getItem('room') === '') {
      createRoom()
    }
    else {
      setRoomCode(localStorage.getItem('room') as any)
      getRoomQuestions(localStorage.getItem('room'))
    }
  },[roomCode])

  return (
    <div className="flex justify-center mt-10 font-outfit">
      <Stack>
        <Text className="text-xl">Your Room Code is</Text>
        {roomCode === '' &&
          <div className="flex flex-row justify-center">
            <Spinner />
          </div>
        }
        {roomCode !== '' && questions !== undefined &&
          <div className="flex justify-center">
            <Stack>
              <Text className="text-3xl font-semibold mb-3 text-center">{roomCode}</Text>
              <button onClick={closeRoom}>
                <Text className="text-white rounded-full text-md bg-red-400 hover:bg-red-500 px-5 py-0.5 mb-20">Close Room</Text>
              </button>
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

export default Host 