import { Stack, Text, Textarea } from "@chakra-ui/react"
import { useState } from "react"
import { getDocs, setDoc, doc, collection, onSnapshot } from "@firebase/firestore"
import { firestore } from "../utils/firebase"

const Joined = () => {
  const [question, setQuestion] = useState('')
  const [questions, setQuestions] =  useState<string[]>([])

  const getRoomQuestions = async () => {
    let roomCode = localStorage.getItem('joinedRoom')
    await onSnapshot(doc(firestore, 'rooms', String(roomCode)), (docSnap) => {
      let data = docSnap.data()
      setQuestions(data?.questions)
    })
  }

  const submitQuestion = async () => {
    getRoomQuestions()
    let roomCode = localStorage.getItem('joinedRoom')
    const ref = doc(firestore, "rooms", String(roomCode))
    questions.push(question)
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

  return ( 
    <div className="flex h-screen">
      <Stack className="m-auto">
        <Text className="font-outfit text-2xl font-regular text-center mb-5">Ask a Question</Text>
        <form onSubmit={submitQuestion}>
          <Textarea focusBorderColor="black" onChange={(e) => {setQuestion(e.target.value)}}/>
          <div className="flex justify-center">
            <button onClick={(e) => {e.preventDefault();submitQuestion()}}>
             <Text className="font-outfit text-lg font-regular px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white rounded-full mt-5">Ask</Text>
            </button>
          </div>
        </form>
      </Stack>
    </div>
  )
}

export default Joined