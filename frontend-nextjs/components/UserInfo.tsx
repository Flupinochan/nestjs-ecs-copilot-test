import { useQueryUser } from '../hooks/useQueryUser'
import { Loader } from '@mantine/core'

export const UserInfo = () => {
  // useQuery(Promise)実行中は、isLoadingがtrueになる
  const { data: user, isLoading } = useQueryUser()
  if (isLoading) return <Loader />
  return <p>{user?.email}</p>
}
