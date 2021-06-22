import { useQuery } from "react-query";
import { db } from "../utils/firebase";
import { WordOfTheDayType } from "../utils/types";

const getAllWotdWords = (): Promise<{ word: string; date: string }[]> => {
  return db
    .ref("wotd")
    .get()
    .then((snapshot: any) => {
      if (snapshot.exists()) {
        return Object.values<WordOfTheDayType>(snapshot.val())
          .map((s) => ({ word: s.word, date: s.date }))
          .sort((a, b) =>
            a.word.toLowerCase() > b.word.toLowerCase() ? 1 : -1
          );
      }
      return [];
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
};

const useAllWotdWords = () => {
  return useQuery<
    { word: string; date: string }[],
    { message: string },
    { word: string; date: string }[],
    string
  >("allWotdWords", () => getAllWotdWords());
};

export default useAllWotdWords;
