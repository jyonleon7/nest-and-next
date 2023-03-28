import { InputDescriptionProps } from '@mantine/core'

export type AuthForm = {
  email: string
  password: string
}

export type EditedTask = {
  id: number
  title: string
  description?: string | null
}