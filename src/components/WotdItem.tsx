import React from "react";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import ListItemText from "@material-ui/core/ListItemText";
import useId from "../hooks/useId";
import useUpdateWotd from "../hooks/useUpdateWotd";

type WotdItemProps = {
  date: string;
  word: string;
  id: number;
  body: string;
};
const WotdItem: React.FC<WotdItemProps> = ({ date, word, id, body }) => {
  const [editting, setEditting] = React.useState(false);
  const [bodyValue, setBodyValue] = React.useState(body);
  const [wordValue, setWordValue] = React.useState(word);
  const { data: idValue } = useId(wordValue);

  const wotdMutation = useUpdateWotd();
  // const { isLoading: loading, data: kinTreeData } = useKinTreeByParams()

  //   console.log("WotdScreen data", data);
  const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBodyValue(event.target.value);
  };

  const handleWordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWordValue(event.target.value);
  };

  const handleEdittingChange = () => {
    setBodyValue(body);
    setWordValue(word);
    setEditting((e) => !e);
  };

  const submit = React.useCallback(() => {
    if (!idValue) {
      alert(
        "Must have an id. If the id doesnt exist then this word is not appropriate. Try another form (e.g. runs vs run) "
      );
    } else {
      wotdMutation.mutate({
        date,
        id: idValue ?? -1,
        word: wordValue,
        body: bodyValue,
      });
      setEditting(false);
    }
  }, [bodyValue, wordValue, idValue, date, wotdMutation]);

  return (
    <ListItem key={date}>
      <div style={{ flexDirection: "column", flex: 3 }}>
        {!editting ? (
          <ListItemText
            primaryTypographyProps={{ color: "primary" }}
            primary={`${date} : ${word} (${id})`}
            secondary={body}
          />
        ) : (
          <>
            <ListItemText
              primaryTypographyProps={{ color: "primary" }}
              primary={`${date}`}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextField
                variant="filled"
                size="small"
                value={wordValue}
                label="word"
                onChange={handleWordChange}
              />
              <div style={{ width: 15 }} />
              <ListItemText
                primaryTypographyProps={{ color: "primary" }}
                primary={`id: ${idValue ?? "undefined"}`}
              />
            </div>
            <TextField
              fullWidth
              multiline
              variant="filled"
              label="body (definition; etymology)"
              size="small"
              value={bodyValue}
              onChange={handleBodyChange}
            />
          </>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Button
          variant="contained"
          disabled={!editting}
          // style={{ visibility: editting ? "visible" : "hidden" }}
          style={
            editting
              ? {}
              : wotdMutation.isSuccess
              ? {
                  color: "green",
                }
              : wotdMutation.isError
              ? { color: "red" }
              : {}
          }
          onClick={submit}
        >
          {editting
            ? "Submit"
            : wotdMutation.isSuccess
            ? "Success!"
            : wotdMutation.isError
            ? "Failure!"
            : "Submit"}
        </Button>
        <div style={{ width: 20 }} />
        <Button variant="contained" onClick={handleEdittingChange}>
          {editting ? "Cancel" : "Edit"}
        </Button>
      </div>
    </ListItem>
  );
};

export default WotdItem;
