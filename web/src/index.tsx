import React from 'react';
import ReactDOM from 'react-dom';
import { getAccessToken, setAccessToken } from './accessToken';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  Observable,
  ApolloProvider
} from '@apollo/client'

import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwt_decode, { JwtPayload } from "jwt-decode";
import Master from './Master';

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle: any;
      Promise.resolve(operation)
        .then(operation => {
          const accessToken = getAccessToken();
          if (accessToken) {
            operation.setContext({
              headers: {
                authorization: `bearer ${accessToken}`
              }
            });
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: "accessToken",
      isTokenValidOrUndefined: () => {
        const token = getAccessToken();

        if (!token) {
          return true;
        }

        try {
          const { exp } = jwt_decode<JwtPayload>(token);
          if (!exp || Date.now() >= exp * 1000) {
            return false;
          } else {
            return true;
          }
        } catch {
          return false;
        }
      },
      fetchAccessToken: () => {
        return fetch("http://localhost:3001/refresh_token", {
          method: "POST",
          credentials: "include"
        });
      },
      handleFetch: accessToken => {
        setAccessToken(accessToken);
      },
      handleError: err => {
        console.warn("Your refresh token is invalid. Try to relogin");
        console.error(err);
      }
    }),
    // onerror((aux) => {
    //   // console.log(graphQLErrors);
    //   // console.log(networkError);
    // }),
    requestLink,
    new HttpLink({
      uri: "http://localhost:3001/graphql",
      credentials: "include"
    })
  ]),
  cache: new InMemoryCache({})
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Master />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

