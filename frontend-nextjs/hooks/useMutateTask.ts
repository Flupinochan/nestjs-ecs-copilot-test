import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Task } from '@prisma/client'
import { EditedTask } from '../types'
import useStore from '../store'

const useMutateTask = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const reset = useStore((state) => state.resetEditedTask)
  // useQueryは、Getのデータを取得するためのもの
  // useMutationは、Post,Put,Deleteのデータを操作するためのもの

  // タスク作成
  // idは自動生成されるのでOmitで除外
  // 作成後にtasksキャッシュはリセット
  const createTaskMutation = useMutation(
    async (task: Omit<EditedTask, 'id'>) => {
      const res = await axios.post<Task>(
        `${process.env.NEXT_PUBLIC_API_URL}/todo`,
        task,
      )
      return res.data
    },
    {
      onSuccess: (res) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks'])
        if (previousTodos) {
          queryClient.setQueryData(['tasks'], [...previousTodos, res])
        }
        reset()
      },
      onError: (err: any) => {
        reset()
        router.push('/')
      },
    },
  )

  // タスク更新
  const updateTaskMutation = useMutation(
    async (task: EditedTask) => {
      const res = await axios.patch<Task>(
        `${process.env.NEXT_PUBLIC_API_URL}/todo/${task.id}`,
        task,
      )
      return res.data
    },
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks'])
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            ['tasks'],
            previousTodos.map((task) => (task.id === res.id ? res : task)),
          )
        }
        reset()
      },
      onError: (err: any) => {
        reset()
        router.push('/')
      },
    },
  )

  // タスク削除
  // variablesには、削除したタスクのidが入る
  const deleteTaskMutation = useMutation(
    async (id: number) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/todo/${id}`)
    },
    {
      onSuccess: (_, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks'])
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            ['tasks'],
            previousTodos.filter((task) => task.id !== variables),
          )
        }
      },
      onError: (err: any) => {
        router.push('/')
      },
    },
  )
  return { createTaskMutation, updateTaskMutation, deleteTaskMutation }
}

export default useMutateTask
