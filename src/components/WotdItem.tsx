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
  definition: string | undefined
  etymology: string | undefined
  group_word: string | undefined
  group_id: string | undefined
  group_language: string | undefined
}
const WotdItem = ({
  date,
  word,
  id,
  body,
  definition,
  etymology,
  group_word,
  group_id,
  group_language,
}: WotdItemProps) => {
  const [editting, setEditting] = useState(false)
  const [etymologyValue, setEtymologyValue] = useState(etymology ?? '')
  const [definitionValue, setDefinitionValue] = useState(definition ?? '')
  const [rootIdValue, setRootIdValue] = useState(group_id)
  const [wordValue, setWordValue] = useState(word)
  const { data: idValue } = useId(wordValue)
  const { data: root } = useWordFromId(rootIdValue)
  const showImages = date >= '2022-08-01'

  const wotdMutation = useUpdateWotd()
  // const { isLoading: loading, data: kinTreeData } = useKinTreeByParams()

  //   console.log("WotdScreen data", data);
  const handleEtymologyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEtymologyValue(event.target.value)
  }

  const handleDefinitionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDefinitionValue(event.target.value)
  }

  const handleRootIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRootIdValue(event.target.value)
  }

  const handleWordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWordValue(event.target.value)
  }

  const handleEdittingChange = () => {
    setEtymologyValue(etymology ?? '')
    setDefinitionValue(definition ?? '')
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
        definition: definitionValue,
        etymology: etymologyValue,
        body: definitionValue + '. ' + etymologyValue,
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
    // bodyValue,
    definitionValue,
    etymologyValue,
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
              secondary={
                <>
                  <span>
                    <b>Definition</b>: {definition}
                    <br />
                  </span>
                  <span>
                    <b>Etymology</b>: {etymology}
                    <br />
                  </span>
                  <span>
                    <b>Body</b>: {body}
                  </span>
                </>
              }
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
              label='definition'
              size='small'
              value={definitionValue}
              onChange={handleDefinitionChange}
            />
            <TextField
              fullWidth
              multiline
              variant='filled'
              label='etymology'
              size='small'
              value={etymologyValue}
              onChange={handleEtymologyChange}
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
      {showImages && (
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 50,
          }}>
          <img
            src={`https://etymology-explorer-tree-images.s3.us-east-1.amazonaws.com/${word}.jpg`}
            width={100}
            alt={word}
            title={word}
          />
          <img
            src={`https://etymology-explorer-tree-images.s3.us-east-1.amazonaws.com/${group_id}.jpg`}
            width={100}
            alt={group_id}
            title={group_id}
          />
        </div>
      )}
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
