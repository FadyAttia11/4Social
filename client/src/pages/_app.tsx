import { ThemeProvider, CSSReset } from '@chakra-ui/react'
import React from 'react'
import { createClient, Provider } from 'urql';

const client = createClient({ 
  url: 'http://localhost:5000/graphql',
  fetchOptions: {
    credentials: 'include' //send the cookie with the req
  }
});

import theme from '../theme'

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
          <CSSReset />
          <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
