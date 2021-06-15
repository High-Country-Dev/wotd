export type WordOfTheDayType = {
  body: string;
  date: string;
  definition?: string;
  etymology?: string;
  id: number;
  language?: string;
  word: string;
  roots?: number[];
};

export type EtymologyObjectDictType = { [id: string]: any };

export type TreeApiType = [
  "tree",
  { words: EtymologyObjectDictType; affixes: number[] },
  NestedTreeType,
  [number, number][]
];

export type NestedTreeType = { [node: string]: NestedTreeType };

export type WordOfTheDayDictType = { [key: string]: WordOfTheDayType };
