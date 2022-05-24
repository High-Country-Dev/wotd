/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useInfiniteQuery, useQuery } from 'react-query'
import { db } from '../utils/firebase'
import { WordOfTheDayDictType, WordOfTheDayType } from '../utils/types'

const getRecentWotds = (limit: number): Promise<WordOfTheDayDictType> => {
  return db
    .ref('wotd')
    .orderByKey()
    .limitToLast(limit)
    .get()
    .then((snapshot: any) => {
      if (snapshot.exists()) {
        return snapshot.val()
      }
      return []
    })
    .catch((error) => {
      console.error(error)
      return {}
    })
}

// const useRecentWotds = (limit: number) => {
//   return useQuery<
//     WordOfTheDayDictType,
//     { message: string },
//     WordOfTheDayDictType,
//     string
//   >("wotd", () => getRecentWotds(limit));
// };

export const useRecentWotds = (amount = 15) => {
  const { data: wotdData, ...rest } = useInfiniteQuery<
    WordOfTheDayType[],
    Error,
    WordOfTheDayType[],
    string
  >('wotd', ({ pageParam }) => getWordsOfTheDay(amount, pageParam), {
    keepPreviousData: true,
    getNextPageParam: (lastPage) =>
      lastPage.map((d) => d.date).sort((a, b) => (a < b ? -1 : 1))[0],
  })

  const allWotds: WordOfTheDayType[] =
    wotdData?.pages?.reduce<WordOfTheDayType[]>(
      (accu, wotd) => [...accu, ...wotd],
      [],
    ) ?? []

  return { wotdData, allWotds, ...rest }
}

export const getWordsOfTheDay = async (
  // uid: string | undefined,
  amount: number,
  last_key?: string,
): Promise<WordOfTheDayType[]> => {
  // permission are disabled

  const query = db.ref('wotd').orderByKey().limitToLast(amount)

  const limitedQuery = last_key ? query.endBefore(last_key) : query
  return limitedQuery
    .get()
    .then((snapshot) => {
      const data = snapshot.exists()
        ? (Object.entries(snapshot.val() as WordOfTheDayDictType).map(
            ([key, value]) => ({ ...value, date: key }),
          ) as WordOfTheDayType[])
        : []
      return data
    })
    .catch((error) => {
      console.error(error)
      return []
    })
}

export default useRecentWotds
