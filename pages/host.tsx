import { Stack, Text, Textarea, Spinner, Card, CardBody } from "@chakra-ui/react"
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from "react"
import { getDocs, setDoc, doc, collection, onSnapshot, deleteDoc } from "@firebase/firestore"
import { firestore } from "../utils/firebase"
import { Icon } from '@iconify-icon/react'
import { useRouter } from "next/router"
var rand = require('csprng')
let creating = false

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

const createRoom = async () => {
  if (!creating) {
    creating = !creating
    const roomId = await generateRandomRoom()
    const ref = doc(firestore, "rooms", String(roomId))
    if (localStorage.getItem('accessCode') === null || localStorage.getItem('accessCode') === '') {
      localStorage.setItem('accessCode',String(rand(30,36)))
    }
    let data = {
      questions: [],
      accessCode: localStorage.getItem('accessCode')
    }
    try {
      setDoc(ref,data)
      localStorage.setItem('room',String(roomId))
    }
    catch(err) {
      console.log(err)
    }
    creating = !creating
  }
}



const Host = () => {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState('')
  const [questions, setQuestions] =  useState<any | null>([])
  const [answer, setAnswer] = useState('')
  const [refresh, setRefresh] = useState(false)
  let [copyIsOpen, setCopyIsOpen] = useState(false)
  let [closeRoomIsOpen, setCloseRoomIsOpen] = useState(false)

  const closeCopy = () => {
    setCopyIsOpen(false)
  }

  const openCopy = () => {
    setCopyIsOpen(true)
  }

  const closeCloseRoom = () => {
    setCloseRoomIsOpen(false)
  }

  const openCloseRoom = () => {
    setCloseRoomIsOpen(true)
  }

  const copyLink = () => {
    openCopy()
    navigator.clipboard.writeText(`https://outou.vercel.app/team?room=${localStorage.getItem('room')}&accessCode=${localStorage.getItem('accessCode')}`)
  }

  const closeRoom = async () => {
    router.back()
    await deleteDoc(doc(firestore, 'rooms', roomCode))
    localStorage.removeItem('room')
    localStorage.removeItem('accessCode')
  }

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
      setDoc(ref,data)
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
    const getRoomCode = async () => {
      await createRoom()
      let roomCode = localStorage.getItem('room')
      setRoomCode(roomCode as any)
    }

    if (localStorage.getItem('room') === null || localStorage.getItem('room') === '') {
      getRoomCode()
    }
    else {
      setRoomCode(localStorage.getItem('room') as any)
      getRoomQuestions(localStorage.getItem('room'))
    }
  },[roomCode, refresh])

  return (
    <div className="flex justify-center mt-5 font-outfit">
      <Stack>
        <Text className="text-2xl text-center mb-10">Go to <span className="font-bold">outou.vercel.app</span></Text>
        <Text className="text-lg text-center">The Room Code is</Text>
        {roomCode === '' &&
          <div className="flex flex-row justify-center">
            <Spinner />
          </div>
        }
        {roomCode !== '' && questions !== undefined &&
          <div>
            <Stack className="flex items-center">
              <Text className="text-4xl font-semibold mb-3 text-center">{roomCode}</Text>
              <button onClick={openCloseRoom}>
                <Text className="max-w-sm min-w-sm text-white rounded-full text-md bg-red-400 hover:bg-red-500 px-5 py-0.5">Close Room</Text>
              </button>
              <Transition appear show={closeRoomIsOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeCloseRoom}>
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                          <Dialog.Title
                            as="h3"
                            className="flex flex-row items-center justify-center text-center text-lg font-outfit font-medium leading-6 text-gray-900"
                          >
                            Are you sure you want to close this room?
                          </Dialog.Title>
                          <div className="flex justify-center mt-5">
                            <button onClick={closeRoom}>
                              <Text className="font-outfit text-white px-5 py-1 bg-red-400 hover:bg-red-500 rounded-full">Close this room</Text>
                            </button>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
              <div className="mt-5 pb-10">
                <button onClick={copyLink}>
                <Text className="text-sm text-blue-400 hover:text-blue-500">Share Admin Access</Text>
                </button>
              </div>
              <Transition appear show={copyIsOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeCopy}>
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                          <Dialog.Title
                            as="h3"
                            className="flex flex-row items-center justify-center text-center text-lg font-outfit font-medium leading-6 text-gray-900"
                          >
                            <span className="text-green-600 flex justify-center mr-3">
                             <Icon icon="charm:tick"/>
                            </span>
                            Share link copied to clipboard!
                          </Dialog.Title>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
              <Text className="font-shippori text-lg font-light text-gray-400 text-center">Questions</Text>
              <ul>
                {questions.map((question: any) => {
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

export default Host 