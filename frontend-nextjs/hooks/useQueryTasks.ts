import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Task } from '@prisma/client'

const useQueryTasks = () => {
  const router = useRouter()
  const getTasks = async () => {
    const { data } = await axios.get<Task[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/todo`,
    )
    return data
  }
  return useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: getTasks,
    onError: (err: Error) => {
      router.push('/')
    },
  })
}

export default useQueryTasks
