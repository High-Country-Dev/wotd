export type WordOfTheDayType = {
  body: string
  date: string
  definition?: string
  etymology?: string
  id: number
  language?: string
  word: string
  roots?: number[]
  group_word?: string
  group_id?: string
  group_language?: string
}

export type EditWordOfTheDayType = {
  body: string | null
  date: string | null
  definition?: string | null
  etymology?: string | null
  id: number | null
  language?: string | null
  word: string | null
  roots?: number[] | null
  group_word?: string | null
  group_id?: string | null
  group_language?: string | null
}

export type EtymologyObjectDictType = { [id: string]: any }

export type TreeApiType = [
  'tree',
  { words: EtymologyObjectDictType; affixes: number[] },
  NestedTreeType,
  [number, number][],
]

export type NestedTreeType = { [node: string]: NestedTreeType }

export type WordOfTheDayDictType = { [key: string]: WordOfTheDayType }
