export const prependZeros = (str: string | number, len: number) => {
  if (typeof str === 'number' || Number(str)) {
    str = str.toString()
  }
  return len - str.length > 0
    ? new Array(len + 1 - str.length).join('0') + str
    : str
}

export const addDays = (date: Date, days: number) => {
  return new Date(date.valueOf() + 1000 * 60 * 60 * 24 * days)
}

export const getFirebaseDateString = (date: Date) => {
  return `${date.getUTCFullYear()}-${prependZeros(
    date.getUTCMonth() + 1,
    2,
  )}-${prependZeros(date.getUTCDate(), 2)}`
}
