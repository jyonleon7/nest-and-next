import { Button } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import UserInfo from '../components/UserInfo'

const Dashboard: NextPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const logout = async() => {
    // queryClient.clear(); // クエリキャッシュをすべて削除する
    queryClient.removeQueries(['user']) // クエリキャッシュをkey ごとに削除する
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`)
    router.push('/')
  }
  return (
    <Layout title='dashboard'>
      <UserInfo />
      <Button
        onClick={() => {logout()}}
        color='red'
      >logout</Button>
    </Layout>
  )
}

export default Dashboard