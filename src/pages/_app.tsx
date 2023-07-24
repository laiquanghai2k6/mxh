// import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { theme } from '../chakra/theme'
import Layout from '../components/Layout/Layout'
import { RecoilRoot } from 'recoil'
import { BrowserRouter } from 'react-router-dom'


export default function App({ Component, pageProps }: AppProps) {
  return (
    // <BrowserRouter>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </RecoilRoot >
    // </BrowserRouter>
  )


}
