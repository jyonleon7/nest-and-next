import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core';
import axios from 'axios';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // react-query の標準だと、RESTへのfetch に失敗した場合には、3回までtry してしまうから、それを無効にする
      retry: false,
      // ユーザーがブラウザにフォーカスするタイミングでfetchが走ってしまうのを阻止する
      refetchOnWindowFocus: false,
    }
  }
})

function MyApp({ Component, pageProps }: AppProps) {
    // frontend と backend でのcookieのやり取りを行う場合には、以下をtrue にする必要がある。
    axios.defaults.withCredentials = true
    useEffect(() => {
      (async() => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/csrf`
        )
        axios.defaults.headers.common['csrf-token'] = data.csrfToken
      })()
    })
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'light',
          fontFamily: 'Verdana, sans-serif',
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
export default MyApp
