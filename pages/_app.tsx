import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { Outfit } from 'next/font/google'
import { Shippori_Mincho } from 'next/font/google'

const outfit = Outfit({
  variable: '--font-outfit',
  display: 'swap',
  subsets: ['latin']
});

const shippori = Shippori_Mincho({
  weight: "600",
  variable: '--font-shippori',
  display: 'swap',
  subsets: ['latin']
});


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <style jsx global>
      {`
        :root {
          --font-outfit: ${outfit.style.fontFamily};
          --font-shippori: ${shippori.style.fontFamily};
        }
      `}
      </style>
      <Component {...pageProps} />
    </ChakraProvider>
  ) 
}
