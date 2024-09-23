'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { AxiosError } from 'axios'; 
import * as Yup from 'yup'
import { IconDatabase } from '@tabler/icons-react'
import { ShieldCheckIcon } from '@heroicons/react/solid'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import {
  Anchor,
  TextInput,
  Button,
  Group,
  PasswordInput,
  Alert,
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { Layout } from '../../components/Layout'
import { AuthForm } from '../../types'

// Yupを使用した独自のバリデーション
// ※class-validatorライブラリと同様
const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export default function Home() {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')

  // useFormを使用してフォームの状態を管理
  // validateでバリデーションを指定し、initialValuesで初期値を指定
  const form = useForm<AuthForm>({
    validate: yupResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  })

  // フォームボタンを押したときの処理
  const handleSubmit = async () => {
    try {
      if (isRegister) {
        // サインイン(ユーザ作成)する場合
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
          email: form.values.email,
          password: form.values.password,
        })
      } else {
        // サインイン(ログイン)する場合
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
          email: form.values.email,
          password: form.values.password,
        })
      }
      // フォームを空にする
      form.reset()
      // ダッシュボードにリダイレクト
      router.push('/dashboard')
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage = axiosError.response?.data as { message: string };
      setError(errorMessage?.message);
    }
  }
  return (
    <Layout title="Auth">
      <ShieldCheckIcon className="h-16 w-16 text-blue-500" />
      {error && (
        <Alert
          color="red"
          my="md"
          variant="filled"
          icon={<ExclamationCircleIcon />}
          title="Authentication Error"
          radius="md"
        >
          {error}
        </Alert>
      )}
      {/* form.onSubmit()でラップすると、preventDefault()が自動で呼ばれる */}
      {/* Mantine uiのuseFormは、 stateの管理が自動で行われる */}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          mt="md"
          id="email"
          label="Email*"
          placeholder="example@gmail.com"
          {...form.getInputProps('email')}
        />
        <PasswordInput
          mt="md"
          id="password"
          label="Password*"
          placeholder="password"
          description="Password must be at least 6 characters"
          {...form.getInputProps('password')}
        />
        <Group mt="xl" justify="space-between">
          <Anchor
            component="button"
            type="button"
            size="xs"
            className="text-gray-300"
            onClick={() => {
              setIsRegister(!isRegister)
              setError('')
            }}
          >
            {isRegister ? 'Signin' : 'Create new account'}
          </Anchor>
          <Button type="submit" color="cyan" leftSection={<IconDatabase />}>
            {isRegister ? 'Signup' : 'Signin'}
          </Button>
        </Group>
      </form>
    </Layout>
  )
}
