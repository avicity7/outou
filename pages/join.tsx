import { Stack, Text, Input } from "@chakra-ui/react"
import { doc, onSnapshot } from "@firebase/firestore"
import { firestore } from "../utils/firebase"
import { useState } from "react"
import { useRouter } from "next/router"

const Join = () => {
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter() 

  const joinRoom = async () => {
    try{
      await onSnapshot(doc(firestore, 'rooms', roomCode), (docSnap) => {
        let data = docSnap.data()
        if (data !== undefined) {
          localStorage.setItem('joinedRoom', String(roomCode))
          router.push('/joined')
        }
        else { 
          setError('Invalid room code!')
        }
      })
    }
    catch {
      setError('Invalid room code!')
    }
  }
  
  return (
    <div className="flex h-screen">
      <Stack className="m-auto">
        <Text className="font-shippori text-2xl font-regular text-center mb-5">Enter Room code</Text>
        <form onSubmit={joinRoom}>
          <Input onChange={(e) => {setRoomCode(e.target.value)}}/>
          {error !== '' &&
            <div className="flex justify-center">
              <Text className="font-outfit font-semibold text-red-400 pt-2">{error}</Text>
            </div>
          }
          <div className="flex justify-center">
            <button onClick={(e) => {e.preventDefault();joinRoom()}}>
             <Text className="font-outfit text-lg font-regular px-5 py-1 bg-gray-800 hover:bg-gray-900 text-white rounded-full mt-10">Join Room</Text>
            </button>
          </div>
        </form>
      </Stack>
    </div>
  )
}

export default Join
