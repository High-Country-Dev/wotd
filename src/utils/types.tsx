export type WordOfTheDayType = {
  body: string;
  date: string;
  definition: string;
  etymology: string;
  id: number;
  language: string;
  word: string;
  roots?: number[];
};

export type WordOfTheDayDictType = { [key: string]: WordOfTheDayType };
