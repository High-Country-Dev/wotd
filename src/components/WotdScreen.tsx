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
  //   console.log("WotdScreen data", data);

  const [lastDate] = Object.keys(recentWotds ?? {})
    .map((w) => new Date(w + "z"))
    .reverse();

  const nextDate = getFirebaseDateString(
    lastDate ? addDays(lastDate, 1) : new Date()
  );

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
        <Autocomplete
          id="all-wotd-word-combo-box"
          options={allWords}
          //   style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Combo box" variant="outlined" />
          )}
        />
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
          <List className={classes.root}>
            <WotdItem
              key="newest"
              word={""}
              body={""}
              id={-1}
              // date={newDayString}
              date={nextDate}
            />
            <Divider />
            {Object.entries(recentWotds)
              .reverse()
              .map(([date, { word, body, id }]) => (
                <React.Fragment key={date}>
                  <WotdItem word={word} body={body} id={id} date={date} />
                  <Divider />
                </React.Fragment>
              ))}
          </List>
          <div>{isFetching ? "Background Updating..." : " "}</div>
        </>
      )}
    </div>
  );
};

export default WotdScreen;
