import { Alert, Anchor, Button, Group, PasswordInput, TextInput } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import * as Yup from 'yup'
import Layout from '../components/Layout'
import { AuthForm } from '../types'

const Home: NextPage = () => {

  const schema = Yup.object().shape({
    email: Yup.string().email('emailを入力してください')
      .required('emailが入力されていません。'),
    password: Yup.string()
      .required('passwordが入力されていません。')
      .min(5, 'パスワードは5桁以上の数字でにゅうりょくしてください')
  })
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const form = useForm<AuthForm>({
    validate: yupResolver(schema),
    initialValues: {
      email: '',
      password: ''
    }
  })

  const handleSubmit = async() => {
    try {
      if (isRegister) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
          email: form.values.email,
          password: form.values.password,
        })
      }
      // isRegister がtrue の場合には、上記の記述でユーザーを作成したのちに、そのままログインをする
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email: form.values.email,
        password: form.values.password,
      })
      form.reset()
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.response.data.message)
    }
  }
  return (
    <Layout title="Auth">
      <div>check</div>
      {error && <>
        これだろ
        <Alert
          color='red'
        >{error}</Alert>
      </>}
      {/* mantain ui のform,onSubmit を使用することで、handleSubmit内で、prevent.default()等をしなくて済む */}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          mt='md'
          id='email'
          label='email'
          placeholder='example.com'
          // value="" と onChange={} の内容をよしなにしてくれるやつ
          {...form.getInputProps('email')}
        />
        <PasswordInput
          mt='md'
          id='password'
          label='password'
          placeholder='xxxxxxxx'
          description='5文字以上で入力してください'
          // value="" と onChange={} の内容をよしなにしてくれるやつ
          {...form.getInputProps('password')}
        />
        <Group mt='xl' position='apart'>
          <Anchor
            onClick={() => {
              setIsRegister(!isRegister)
              setError('')
            }}
          >{isRegister ? 'アカウントを持っている方はこちら': 'アカウントを持っていない方はこちら'}</Anchor>
        </Group>
        <Button type='submit'>{isRegister? 'register': 'login'}</Button>
      </form>
    </Layout>
  )
}

export default Home
