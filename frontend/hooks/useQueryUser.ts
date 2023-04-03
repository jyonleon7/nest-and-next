import { User } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'

const useQueryUser = () => {
  const router = useRouter()
  const getUser = async(): Promise<Omit<User, 'hashedPassword'>> => {
    const { data } = await axios.get<Omit<User, 'hashedPassword'>>(`${process.env.NEXT_PUBLIC_API_URL}/user`)
    return data
  }
  return useQuery<Omit<User, 'hashedPassword'>, Error>({
    queryFn: getUser,
    // queryFnで取得したデータをブラウザの方でキャッシュしてくれるため、key に名前をつける
    queryKey: ['user'],
    onError: (err: any) => {
      // 401 Jwt Token が無効な場合
      // 403 Csrf Token が無効な場合
      if (err.response.status === 401 || err.response.status === 403) {
        router.push('/')
      }
    }
  })
}

export default useQueryUser