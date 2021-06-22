import { useQuery } from "react-query";
import { db } from "../utils/firebase";
import { WordOfTheDayType } from "../utils/types";

const getWotd = (date: string): Promise<WordOfTheDayType> => {
  return db
    .ref(`wotd/${date}`)
    .get()
    .then((snapshot: any) => {
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return {};
    })
    .catch((error) => {
      console.error(error);
      return {};
    });
};

const useWotd = (date: string) => {
  return useQuery<
    WordOfTheDayType,
    { message: string },
    WordOfTheDayType,
    [string, string]
  >(["wotd", date], () => getWotd(date), { enabled: Boolean(date) });
};

export default useWotd;
