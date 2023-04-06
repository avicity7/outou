import { Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()

  return (
    <>
      <div className="flex h-screen">
        <Stack className="m-auto">
          <Text className="font-shippori text-center text-md">シ　ツ</Text>
          <Text className="font-shippori text-center text-md">モ　ン</Text>
          <Text className="font-shippori text-center text-4xl pb-20">shitsumon</Text>
          <button onClick={() => {router.push('/join')}}>
            <Text className="font-outfit text-xl font-regular px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full mb-5">Join a Room</Text>
          </button>
          <button onClick={() => {router.push('/host')}}>
            <Text className="font-outfit text-xl font-regular px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full mb-5">Host a Room</Text>
          </button>
        </Stack>
        <Text className='font-shippori text-sm absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pb-2'>Created with <span className="text-red-400">♥</span> by <a className="underline hover:text-blue-400" href="https://github.com/avicity7" target="_blank">avicity7</a></Text>
      </div>
    </>
  )
}

export default Home