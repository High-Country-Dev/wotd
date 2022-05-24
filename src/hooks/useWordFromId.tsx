/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from 'react-query'
import axios from 'axios'

type BaseEtymology = {
  word: string
  language_name: string
  _id: number
}

type Result = {
  data:
    | {
        words: {
          [key: string]: BaseEtymology
        }
      }
    | undefined
}

const getWordFromId = async (id: string): Promise<BaseEtymology> => {
  const url = `https://api.etymologyexplorer.com/dev/get_details?ids=${id}`
  const { data }: Result = await axios.get(url)
  const baseEtymology = Object.values(data?.words ?? {}).pop()
  const { word = '', language_name = '', _id = -1 } = baseEtymology ?? {}
  return { word, language_name, _id }
}

const useWordFromId = (id: string | undefined) => {
  return useQuery<
    BaseEtymology | undefined,
    { message: string },
    BaseEtymology | undefined,
    [string, string | undefined]
  >(['wordFromId', id], () => (id ? getWordFromId(id) : undefined), {
    enabled: id !== undefined,
  })
}

export default useWordFromId
