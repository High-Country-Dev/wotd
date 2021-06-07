import { useQuery } from "react-query";
import { db } from "../utils/firebase";
import { WordOfTheDayType } from "../utils/types";

const getAllWotdWords = (): Promise<string[]> => {
  return db
    .ref("wotd")
    .get()
    .then((snapshot: any) => {
      if (snapshot.exists()) {
        return Object.values<WordOfTheDayType>(snapshot.val())
          .map((s) => s.word)
          .sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1));
      }
      return [];
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
};

const useAllWotdWords = () => {
  return useQuery<string[], { message: string }, string[], string>(
    "allWotdWords",
    () => getAllWotdWords()
  );
};

export default useAllWotdWords;
