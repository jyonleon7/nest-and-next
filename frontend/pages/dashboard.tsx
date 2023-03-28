import { Button } from '@mantine/core'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

const Dashboard: NextPage = () => {
  const router = useRouter()
  const logout = async() => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`)
    router.push('/')
  }
  return (
    <Layout title='dashboard'>
      <Button
        onClick={() => {logout()}}
        color='red'
      >logout</Button>
    </Layout>
  )
}

export default Dashboard