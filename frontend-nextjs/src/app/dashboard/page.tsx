'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { LogoutIcon } from '@heroicons/react/solid'
import { Layout } from '../../../components/Layout'
import { UserInfo } from '../../../components/UserInfo'
import { useQueryClient } from '@tanstack/react-query'
import TaskForm from '../../../components/TaskForm'
import TaskList from '../../../components/TaskList'

export default function Page() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const signOut = async () => {
    queryClient.removeQueries({ queryKey: ['user'] }) // useQueryによって作成されるキャッシュを削除する
    queryClient.removeQueries({ queryKey: ['tasks'] })
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signout`)
    router.push('/')
  }

  return (
    <Layout title="Dashboard">
      <div className="mb-10">
        <LogoutIcon
          className="mb-6 w-6 h-6 cursor-pointer text-blue-500"
          onClick={signOut}
        />
        <UserInfo />
        <TaskForm />
        <TaskList />
      </div>
    </Layout>
  )
}
