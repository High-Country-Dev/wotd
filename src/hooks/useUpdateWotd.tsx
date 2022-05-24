/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios'
import { useMutation, useQueryClient } from 'react-query'
import { db } from '../utils/firebase'
import { EditWordOfTheDayType, WordOfTheDayType } from '../utils/types'

// mutations: https://medium.com/analytics-vidhya/how-to-post-and-fetch-data-using-react-query-4c3280c0ef96

//date format: 2021-06-17
const updateWotd = async ({
  date,
  id,
  word,
  body,
  group_id,
  group_language,
  group_word,
}: EditWordOfTheDayType): Promise<string[]> => {
  // const { data: response } = await axios.post('https://employee.free.beeceptor.com/create', data);
  const url = `https://api.etymologyexplorer.com/dev/get_trees?ids=${id}`
  const { data } = await axios.get(url)
  const roots = Object.keys(data[1]['words']).map((i) => Number(i))

  return db.ref(`wotd/${date}`).update({
    body,
    word,
    date,
    id,
    roots,
    group_id,
    group_language,
    group_word,
    language: 'English',
  })
  // .then((snapshot: any) => {
  //   if (snapshot.exists()) {
  //     return Object.values<WordOfTheDayType>(snapshot.val())
  //       .map((s) => s.word)
  //       .sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1));
  //   }
  //   return [];
  // });
  //   .catch((error) => {
  //     console.error(error);
  //     return [];
  //   });
}

// const useUpdateWotd = ({ date, id, word, body }: WordOfTheDayType) => {
const useUpdateWotd = () => {
  const queryClient = useQueryClient()
  return useMutation<string[], unknown, EditWordOfTheDayType, unknown>(
    ({ date, id, body, word, group_id, group_language, group_word }) =>
      updateWotd({
        date,
        id,
        body,
        word,
        group_id,
        group_language,
        group_word,
      }),
    {
      onSuccess: (data) => {
        console.log(data)
      },
      onError: (error: any) => {
        if (error.message === 'PERMISSION_DENIED: Permission denied') {
          alert('Failure: Permission denied. Try logging out and back in')
        } else {
          alert('Failure: Unknown reason. Try logging out and back in')
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries('allWotdWords')
        queryClient.invalidateQueries('wotd')
      },
    },
  )
  // return useQuery<string[], { message: string }, string[], string>(
  //   "allWotdWords",
  //   () => getAllWotdWords()
  // );
}

export default useUpdateWotd
