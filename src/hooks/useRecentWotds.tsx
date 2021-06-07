import { useQuery } from "react-query";
import { db } from "../utils/firebase";
import { WordOfTheDayDictType, WordOfTheDayType } from "../utils/types";

const getRecentWotds = (limit: number): Promise<WordOfTheDayDictType> => {
  return db
    .ref("wotd")
    .orderByKey()
    .limitToLast(limit)
    .get()
    .then((snapshot: any) => {
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return [];
    })
    .catch((error) => {
      console.error(error);
      return {};
    });
};

const useRecentWotds = (limit: number) => {
  return useQuery<
    WordOfTheDayDictType,
    { message: string },
    WordOfTheDayDictType,
    [string, number]
  >(["wotd", limit], () => getRecentWotds(limit));
};

export default useRecentWotds;
