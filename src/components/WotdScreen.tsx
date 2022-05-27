/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TextField, Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Fragment, useState } from 'react'
import { getFirebaseDateString } from 'utils/functions'
import { WordOfTheDayType } from 'utils/types'
import useAllWotdWords from '../hooks/useAllWotdWords'
import useRecentWotds from '../hooks/useRecentWotds'
import useWotd from '../hooks/useWotd'
import WotdItem from './WotdItem'

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    // backgroundColor: theme.palette.background.paper,
  },
}))

const WotdScreen = () => {
  const {
    allWotds: recentWotds,
    status,
    error,
    isFetching,
    fetchNextPage,
  } = useRecentWotds(20)
  const {
    data: allWords,
    status: allWotdWordsStatus,
    error: allWotdWordsError,
  } = useAllWotdWords()

  const [date, setDate] = useState<string>()

  const { data: wotd } = useWotd(date ?? '')
  //   console.log("WotdScreen data", data);

  const newDateObject: WordOfTheDayType = {
    word: '',
    body: '',
    id: -1,
    group_word: '',
    group_language: '',
    group_id: '',
    date: getFirebaseDateString(
      new Date(
        Math.max(
          ...Object.values(recentWotds ?? {}).map((w) =>
            new Date(w.date).valueOf(),
          ),
        ) +
          1000 * 60 * 60 * 24,
      ),
    ),
  }

  const allDateObjects = [
    newDateObject,
    ...Object.values(recentWotds ?? {}).sort((a, b) =>
      a.date < b.date ? 1 : -1,
    ),
  ]

  const classes = useStyles()

  return (
    <div style={{ paddingRight: 20, paddingLeft: 20, height: '100%' }}>
      <h1 style={{ color: 'white', marginTop: 0, paddingTop: 20 }}>
        Words of the Day
      </h1>
      <h2 style={{ color: 'white', marginTop: 0, paddingTop: 20 }}>
        Word Checker
      </h2>
      {allWotdWordsStatus === 'loading' ? (
        <Typography color='primary' component='span'>
          Loading...
        </Typography>
      ) : !allWords || allWotdWordsStatus === 'error' ? (
        <Typography color='primary' component='span'>
          Error: {allWotdWordsError?.message}
        </Typography>
      ) : (
        <>
          <Autocomplete<{ date: string; word: string }>
            id='all-wotd-word-combo-box'
            options={allWords}
            // groupBy={(option) => option.date.slice(0, 4)}
            // .sort((a, b) => (a.date > b.date ? 1 : -1))
            // .reverse()}
            getOptionLabel={(option) => option.word}
            onChange={(event, newValue) => setDate(newValue?.date)}
            //   style={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Search all WOTDs'
                variant='outlined'
              />
            )}
          />
          {wotd ? (
            <WotdItem
              word={wotd.word}
              body={wotd.body}
              id={wotd.id}
              date={wotd.date}
              group_word={wotd.group_word}
              group_id={wotd.group_id}
              group_language={wotd.group_language}
            />
          ) : null}
        </>
      )}
      <h2 style={{ color: 'white', marginTop: 0, paddingTop: 20 }}>
        Past / Upcoming Words of the Day
      </h2>
      {status === 'loading' ? (
        <Typography color='primary' component='span'>
          Loading...
        </Typography>
      ) : status === 'error' ? (
        <Typography color='primary' component='span'>
          Error: {error?.message}
        </Typography>
      ) : !recentWotds ? (
        <span>No data!</span>
      ) : (
        <>
          <List className={classes.root}>
            {allDateObjects.map(
              ({
                word,
                body,
                id,
                group_word,
                group_language,
                group_id,
                date,
              }) => (
                <Fragment key={`${date}-${id}`}>
                  <WotdItem
                    word={word}
                    body={body}
                    id={id}
                    date={date}
                    group_word={group_word}
                    group_id={group_id}
                    group_language={group_language}
                  />
                  <Divider />
                </Fragment>
              ),
            )}
          </List>
          <div>{isFetching ? 'Background Updating...' : ' '}</div>
        </>
      )}
      <Button onClick={() => fetchNextPage()}>More</Button>
    </div>
  )
}

export default WotdScreen
