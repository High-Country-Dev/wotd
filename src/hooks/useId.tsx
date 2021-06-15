import { useQuery } from "react-query";
import axios from "axios";

type idResult = {
  data:
    | {
        words: {
          [key: string]: { _id: number };
        };
      }
    | undefined;
};

const getId = async (word: string): Promise<number> => {
  const url = `https://api.etymologyexplorer.com/dev/get_details?word=${word}`;
  const { data }: idResult = await axios.get(url);
  return (
    Object.values(data?.words ?? { key: { _id: undefined } })[0]?._id ?? -1
  );
};

const useId = (word: string) => {
  return useQuery<
    number | undefined,
    { message: string },
    number | undefined,
    [string, string]
  >(["id", word], () => getId(word), { enabled: !!word });
};

export default useId;
