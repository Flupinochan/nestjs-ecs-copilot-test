import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { User } from '@prisma/client'

export const useQueryUser = () => {
  const router = useRouter()
  const getUser = async () => {
    const { data } = await axios.get<Omit<User, 'hashedPassword'>>(
      `${process.env.NEXT_PUBLIC_API_URL}/user`,
    )
    return data
  }
  // Axiosを直接使用せずに、useQueryでラップしてユーザ情報を取得する
  // メリット: エラーハンドリングが容易になる。キャッシュが利用できる。ローディングステータスが管理しやすい。
  // queryKey: キャッシュのキーを指定する。
  // queryFn: データを取得する関数を指定する。
  // onError: エラーが発生した場合に呼び出される関数を指定する。
  return useQuery<Omit<User, 'hashedPassword'>, Error>({
    queryKey: ['user'],
    queryFn: getUser,
    onError: (error: Error) => {
      console.log(error)
      router.push('/')
    },
  })
}

export default useQueryUser
