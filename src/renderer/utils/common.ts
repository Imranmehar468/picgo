import { isReactive, isRef, toRaw, unref } from 'vue'

const isDevelopment = process.env.NODE_ENV !== 'production'
/* eslint-disable camelcase */
export const handleTalkingDataEvent = (data: ITalkingDataOptions) => {
  const { EventId, Label = '', MapKv = {} } = data
  MapKv.from = window.location.href
  window.TDAPP.onEvent(EventId, Label, MapKv)
  if (isDevelopment) {
    console.log('talkingData', data)
  }
}

export const trimValues = (obj: IStringKeyMap) => {
  const newObj = {} as IStringKeyMap
  Object.keys(obj).forEach(key => {
    newObj[key] = typeof obj[key] === 'string' ? obj[key].trim() : obj[key]
  })
  return newObj
}

/**
 * get raw data from reactive or ref
 */
export const getRawData = (args: any): any => {
  if (Array.isArray(args)) {
    const data = args.map((item: any) => {
      if (isRef(item)) {
        return unref(item)
      }
      if (isReactive(item)) {
        return toRaw(item)
      }
      return getRawData(item)
    })
    return data
  }
  if (typeof args === 'object') {
    const data = {} as IStringKeyMap
    Object.keys(args).forEach(key => {
      const item = args[key]
      if (isRef(item)) {
        data[key] = unref(item)
      } else if (isReactive(item)) {
        data[key] = toRaw(item)
      } else {
        data[key] = getRawData(item)
      }
    })
    return data
  }
  return args
}
