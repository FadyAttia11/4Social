import { ThemeProvider, CSSReset } from '@chakra-ui/react'
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import React from 'react'
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, data => fn(result, data as any) as any)
}

const client = createClient({ 
  url: 'http://localhost:5000/graphql',
  fetchOptions: {
    credentials: 'include' //send the cookie with the req
  },
  exchanges: [dedupExchange, cacheExchange({ //for URQL cache update
    updates: {
      Mutation: {
        logout: (_result, args, cache, info) => {
          betterUpdateQuery<LogoutMutation, MeQuery>(
            cache,
            {query: MeDocument},
            _result,
            (result, query) => ({ me: null })
          )
        },

        login: (_result, args, cache, info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(cache,
            { query: MeDocument},
            _result,
            (result, query) => {
              if (result.login.errors) {
                return query
              } else {
                return {
                  me: result.login.user
                }
              }
            }
          )
        },

        register: (_result, args, cache, info) => { //update cache when register too
          betterUpdateQuery<RegisterMutation, MeQuery>(cache,
            { query: MeDocument},
            _result,
            (result, query) => {
              if (result.register.errors) {
                return query
              } else {
                return {
                  me: result.register.user
                }
              }
            }
          )
        }
      },
    }
  }), fetchExchange] 
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
