import { Text, Textarea, Card, CardBody } from "@chakra-ui/react"
import { useState } from "react"
import { Icon } from "@iconify-icon/react"

const QuestionCard = ({question,onClick,setAnswer,addAnswer}: any) => {
  const [open, setOpen] = useState(false)
  return (
      <div>
        <Card className="mx-5 my-5 max-w-xs md:max-w-3xl">
          <CardBody>
            <div className="flex flex-row justify-between items-center mb-2">
              <Text className="font-shippori text-md text-red-700">Question</Text>
              {onclick !== null && 
                <button className="flex justify-center text-gray-300 hover:text-red-400" onClick={onClick}>
                <Icon icon="ph:trash-simple-bold"/>
                </button>
              }
            </div>
            <Text className="font-outfit text-xl text-left mb-5">{question.question}</Text>
            {question.answer !== null &&
              <>
              <Text className="font-shippori text-md text-green-700 mb-2">Answer</Text>
              <Text className="font-outfit text-xl text-left mb-5">{question.answer}</Text>
              </>
            }
            {!open && question.answer === null && addAnswer !== null &&
              <button onClick={() => {setOpen(!open)}}>
                <Text className="font-outfit text-sm font-regular px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full mt-3">Add Answer</Text>
              </button>
            }
            {!open && question.answer !== null && addAnswer !== null &&
              <button onClick={() => {setOpen(!open)}}>
                <Text className="font-outfit text-sm font-regular px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full mt-3">Edit Answer</Text>
              </button>
            }
            {open && question.answer === null && addAnswer !== null &&
              <>
                <button onClick={() => {setOpen(!open)}} className="text-xs text-gray-300 hover:text-red-500 mb-2">
                  <Icon icon="akar-icons:cross"/>
                </button>
                <Textarea focusBorderColor="black" placeholder="Add an answer" onChange={setAnswer}/>
                <button onClick={() => {addAnswer();setOpen(!open)}}>
                  <Text className="font-outfit text-sm font-regular px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full mt-3">Add Answer</Text>
                </button>
              </>
            }
            {open && question.answer !== null && addAnswer !== null &&
              <>
                <button onClick={() => {setOpen(!open)}} className="text-xs text-gray-300 hover:text-red-500 mb-2">
                  <Icon icon="akar-icons:cross"/>
                </button>
                <Textarea focusBorderColor="black" placeholder="Add an answer" onChange={setAnswer}/>
                <button onClick={addAnswer}>
                  <Text className="font-outfit text-sm font-regular px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full mt-3">Edit Answer</Text>
                </button>
              </>
            }
          </CardBody>
        </Card>
      </div>
  )
}
export default QuestionCard