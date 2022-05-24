/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Button from '@material-ui/core/Button'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'
import ListItemText from '@material-ui/core/ListItemText'
import useId from '../hooks/useId'
import useUpdateWotd from '../hooks/useUpdateWotd'
import { useState, ChangeEvent, useCallback } from 'react'
import Typography from '@material-ui/core/Typography'

import useWordFromId from 'hooks/useWordFromId'

type WotdItemProps = {
  date: string
  word: string
  id: number
  body: string
  group_word: string | undefined
  group_id: string | undefined
  group_language: string | undefined
}
const WotdItem = ({
  date,
  word,
  id,
  body,
  group_word,
  group_id,
  group_language,
}: WotdItemProps) => {
  const [editting, setEditting] = useState(false)
  const [bodyValue, setBodyValue] = useState(body)
  const [rootIdValue, setRootIdValue] = useState(group_id)
  const [wordValue, setWordValue] = useState(word)
  const { data: idValue } = useId(wordValue)
  const { data: root } = useWordFromId(rootIdValue)

  const wotdMutation = useUpdateWotd()
  // const { isLoading: loading, data: kinTreeData } = useKinTreeByParams()

  //   console.log("WotdScreen data", data);
  const handleBodyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBodyValue(event.target.value)
  }

  const handleRootIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRootIdValue(event.target.value)
  }

  const handleWordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWordValue(event.target.value)
  }

  const handleEdittingChange = () => {
    setBodyValue(body)
    setWordValue(word)
    setEditting((e) => !e)
  }

  const submit = useCallback(() => {
    if (!idValue) {
      alert(
        'Must have an id. If the id doesnt exist then this word is not appropriate. Try another form (e.g. runs vs run) ',
      )
    } else {
      wotdMutation.mutate({
        date,
        id: idValue ?? -1,
        word: wordValue,
        body: bodyValue,
        group_id: root?._id.toString() ?? null,
        group_word: root?.word ?? null,
        group_language: root?.language_name ?? null,
      })
      setEditting(false)
    }
  }, [
    idValue,
    wotdMutation,
    date,
    wordValue,
    bodyValue,
    root?._id,
    root?.word,
    root?.language_name,
  ])

  return (
    <ListItem key={date}>
      <div style={{ flexDirection: 'column', flex: 3 }}>
        {!editting ? (
          <>
            <ListItemText
              primaryTypographyProps={{ color: 'primary' }}
              primary={`${date} : ${word} (${id})`}
              secondary={body}
            />
            <ListItemText
              primaryTypographyProps={{ color: 'primary' }}
              primary={'Root'}
              secondary={`${group_word} : ${group_language} (${group_id})`}
            />
          </>
        ) : (
          <>
            <ListItemText
              primaryTypographyProps={{ color: 'primary' }}
              primary={`${date}`}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TextField
                variant='filled'
                size='small'
                value={wordValue}
                label='word'
                onChange={handleWordChange}
              />
              <div style={{ width: 15 }} />
              <ListItemText
                primaryTypographyProps={{ color: 'primary' }}
                primary={`id: ${idValue ?? 'undefined'}`}
              />
            </div>
            <TextField
              fullWidth
              multiline
              variant='filled'
              label='body (definition; etymology)'
              size='small'
              value={bodyValue}
              onChange={handleBodyChange}
            />
            <div style={{ display: 'flex' }}>
              <TextField
                variant='filled'
                label='Root id'
                size='small'
                value={rootIdValue}
                onChange={handleRootIdChange}
              />
              <Typography style={{ padding: 5 }} color='primary'>
                <b>Root:</b>
              </Typography>
              <Typography style={{ padding: 5 }} color='primary'>
                word
                <br />
                <b>{root?.word}</b>
              </Typography>
              <Typography style={{ padding: 5 }} color='primary'>
                language
                <br />
                <b>{root?.language_name}</b>
              </Typography>
              <Typography style={{ padding: 5 }} color='primary'>
                id
                <br />
                <b>{root?._id}</b>
              </Typography>
            </div>
          </>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
        <Button
          variant='contained'
          disabled={!editting}
          // style={{ visibility: editting ? "visible" : "hidden" }}
          style={
            editting
              ? {}
              : wotdMutation.isSuccess
              ? {
                  color: 'green',
                }
              : wotdMutation.isError
              ? { color: 'red' }
              : {}
          }
          onClick={submit}>
          {editting
            ? 'Submit'
            : wotdMutation.isSuccess
            ? 'Success!'
            : wotdMutation.isError
            ? 'Failure!'
            : 'Submit'}
        </Button>
        <div style={{ width: 20 }} />
        <Button variant='contained' onClick={handleEdittingChange}>
          {editting ? 'Cancel' : 'Edit'}
        </Button>
      </div>
    </ListItem>
  )
}

export default WotdItem
