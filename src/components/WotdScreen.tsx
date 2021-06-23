import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Divider from "@material-ui/core/Divider";

import useRecentWotds from "../hooks/useRecentWotds";
import useAllWotdWords from "../hooks/useAllWotdWords";
import { TextField, Typography } from "@material-ui/core";
import WotdItem from "./WotdItem";
import { addDays, getFirebaseDateString } from "../utils/functions";
import useWotd from "../hooks/useWotd";
import { WordOfTheDayType } from "../utils/types";

const DAY = 24 * 60 * 60 * 1000;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    // backgroundColor: theme.palette.background.paper,
  },
}));

type WotdScreenProps = {};
const WotdScreen: React.FC<WotdScreenProps> = () => {
  const { data: recentWotds, status, error, isFetching } = useRecentWotds(20);
  const {
    data: allWords,
    status: allWotdWordsStatus,
    error: allWotdWordsError,
  } = useAllWotdWords();

  const [date, setDate] = React.useState<string>();

  const { data: wotd } = useWotd(date ?? "");
  //   console.log("WotdScreen data", data);

  let dates: number[];
  let allDateNodes: React.ReactNode[] = [];

  if (recentWotds) {
    dates = Object.keys(recentWotds ?? {}).map((w) =>
      new Date(w + "z").valueOf()
    );

    const firstDate = Math.min(...dates);
    const lastDate = Math.max(...dates);
    // console.log(new Date(firstDate));
    // console.log(new Date(lastDate));

    for (let i = lastDate + DAY * 2; i > firstDate; i -= DAY) {
      // .map(([date, { word, body, id }]) => (
      const date = getFirebaseDateString(new Date(i));
      const { word = "", body = "", id = -1 } = recentWotds[date] ?? {};
      allDateNodes.push(
        <React.Fragment key={date + String(i)}>
          <WotdItem word={word} body={body} id={id} date={date} />
          <Divider />
        </React.Fragment>
      );
    }
  }

  // const nextDate = getFirebaseDateString(
  //   lastDate ? addDays(lastDate, 1) : new Date()
  // );

  const classes = useStyles();

  return (
    <div style={{ paddingRight: 20, paddingLeft: 20, height: "100%" }}>
      <h1 style={{ color: "white", marginTop: 0, paddingTop: 20 }}>
        Words of the Day
      </h1>
      <h2 style={{ color: "white", marginTop: 0, paddingTop: 20 }}>
        Word Checker
      </h2>
      {allWotdWordsStatus === "loading" ? (
        <Typography color="primary" component="span">
          Loading...
        </Typography>
      ) : !allWords || allWotdWordsStatus === "error" ? (
        <Typography color="primary" component="span">
          Error: {allWotdWordsError?.message}
        </Typography>
      ) : (
        <React.Fragment>
          <Autocomplete<{ date: string; word: string }>
            id="all-wotd-word-combo-box"
            options={allWords}
            getOptionLabel={(option) => option.word}
            onChange={(event: any, newValue) => setDate(newValue?.date)}
            //   style={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search all WOTDs"
                variant="outlined"
              />
            )}
          />
          {wotd ? (
            <WotdItem
              word={wotd.word}
              body={wotd.body}
              id={wotd.id}
              date={wotd.date}
            />
          ) : null}
        </React.Fragment>
      )}
      <h2 style={{ color: "white", marginTop: 0, paddingTop: 20 }}>
        Past / Upcoming Words of the Day
      </h2>
      {status === "loading" ? (
        <Typography color="primary" component="span">
          Loading...
        </Typography>
      ) : status === "error" ? (
        <Typography color="primary" component="span">
          Error: {error?.message}
        </Typography>
      ) : !recentWotds ? (
        <span>No data!</span>
      ) : (
        <>
          <List className={classes.root}>{allDateNodes}</List>
          <div>{isFetching ? "Background Updating..." : " "}</div>
        </>
      )}
    </div>
  );
};

export default WotdScreen;
