import * as queryString from 'query-string'
import { FORMAT, RECURRENCE, URL } from '../constants'
import CalendarBase from '../CalendarBase'
import YahooCalendar from '../YahooCalendar'
import time from '../utils/time'
import CalendarOptions from '../types/CalendarOptions'

const {
  FREQUENCY: { DAILY, WEEKLY, MONTHLY }
} = RECURRENCE

describe('YahooCalendar', () => {
  let testOpts: CalendarOptions

  beforeEach(() => {
    testOpts = {
      title: 'Fun Party',
      description: 'BYOB',
      location: 'New York',
      start: new Date('2019-07-04T19:00:00.000')
    }
  })

  afterEach(() => jest.clearAllMocks())

  it('should be a subclass of CalendarBase', () => {
    const result = new YahooCalendar(testOpts)

    expect(result).toBeInstanceOf(CalendarBase)
  })

  describe('getWeekdays()', () => {
    it('should return a string of all weekdays joined', () => {
      const calendar = new YahooCalendar(testOpts)
      const result = calendar.getWeekdays(['SU', 'MO'])

      expect(result).toEqual('SuMo')
    })

    it('should strip out any non-alphanumeric chars', () => {
      const calendar = new YahooCalendar(testOpts)
      const result = calendar.getWeekdays(['3SU', '-2MO'])

      expect(result).toEqual('SuMo')
    })
  })

  describe('getFrequency()', () => {
    const { FREQUENCY } = RECURRENCE
    let obj: YahooCalendar

    beforeEach(() => {
      obj = new YahooCalendar(testOpts)
    })

    it('should return `Yr` for yearly recurrences', () => {
      expect(obj.getFrequency(FREQUENCY.YEARLY)).toEqual('Yr')
    })

    it('should return `Mh` for monthly recurrences', () => {
      expect(obj.getFrequency(FREQUENCY.MONTHLY)).toEqual('Mh')
    })

    it('should return `Wk` for monthly recurrences', () => {
      expect(obj.getFrequency(FREQUENCY.WEEKLY)).toEqual('Wk')
    })

    it('should default to daily recurrences', () => {
      expect(obj.getFrequency(FREQUENCY.DAILY)).toEqual('Dy')
    })
  })

  describe('getRecurrence()', () => {
    let obj: YahooCalendar

    beforeEach(() => {
      obj = new YahooCalendar(testOpts)
    })

    it('should prepend single digit interval with 0', () => {
      const recurrence = {
        interval: 3,
        frequency: DAILY
      }

      const result = obj.getRecurrence(recurrence)
      expect(result).toBe('03Dy')
    })

    it('should return yahoo calendar rpat rule', () => {
      const recurrence = {
        interval: 10,
        frequency: DAILY
      }

      const result = obj.getRecurrence(recurrence)
      expect(result).toBe('10Dy')
    })

    it('should append the weekdays, prefixed with `1`, to the recurrence', () => {
      const recurrence = {
        interval: 10,
        frequency: MONTHLY,
        weekdays: ['SU', 'MO']
      }

      const result = obj.getRecurrence(recurrence)
      expect(result).toBe('10Mh1SuMo')
    })

    it('should return the weekdays with the first weekdays\' count for monthly recurrences', () => {
      const recurrence = {
        interval: 10,
        frequency: MONTHLY,
        weekdays: ['2SU', '3MO']
      }

      const result = obj.getRecurrence(recurrence)
      expect(result).toBe('10Mh2SuMo')
    })

    it('should return the weekdays\' counts for weekly recurrences', () => {
      const recurrence = {
        interval: 10,
        frequency: WEEKLY,
        weekdays: ['2SU', '3MO']
      }

      const result = obj.getRecurrence(recurrence)
      expect(result).toBe('10WkSuMo')
    })
  })

  describe('getRecurrenceLengthDays()', () => {
    const { FREQUENCY } = RECURRENCE
    let obj: YahooCalendar

    beforeEach(() => {
      obj = new YahooCalendar(testOpts)
    })

    describe('when the interval is specified in a recurrence', () => {
      const interval = 10

      it('should return (interval * 365.25) days for a yearly recurrence', () => {
        expect(obj.getRecurrenceLengthDays({
          frequency: FREQUENCY.YEARLY,
          interval
        })).toEqual(365.25 * interval)
      })

      it('should return (interval * 30.42) days for a monthly recurrence', () => {
        expect(obj.getRecurrenceLengthDays({
          frequency: FREQUENCY.MONTHLY,
          interval
        })).toEqual(30.42 * interval)
      })

      it('should return (interval * 7) days for a weekly recurrence', () => {
        expect(obj.getRecurrenceLengthDays({
          frequency: FREQUENCY.WEEKLY,
          interval
        })).toEqual(7 * interval)
      })

      it('should return the interval itself as the number of days if no frequency is specified', () => {
        expect(obj.getRecurrenceLengthDays({ interval })).toEqual(interval)
      })
    })

    it('should return the number of days in 100 years', () => {
      expect(obj.getRecurrenceLengthDays({})).toEqual(36525)
    })

    it('should fall back to days if no frequency is specified', () => {
      const obj = new YahooCalendar(testOpts)
      const recurrence = {
        interval: 3
      }

      const result = obj.getRecurrence(recurrence)

      expect(result).toBe('03Dy')
    })

    it('should fall back to one day if no interval is specified', () => {
      const obj = new YahooCalendar(testOpts)
      const recurrence = {
        frequency: DAILY
      }

      const result = obj.getRecurrence(recurrence)

      expect(result).toBe('01Dy')
    })
  })

  describe('getICSDuration()', () => {
    it('should get the duration between two datetimes', () => {
      const calendar = new YahooCalendar(testOpts)
      const start = new Date('2019-03-23T17:00:00.000')
      const end = new Date('2019-03-23T20:23:00.000')
      const expectedDiff = '0323'
      const actualDiff = calendar.getICSDuration(start.getTime(), end.getTime())

      expect(actualDiff).toBe(expectedDiff)
    })
  })

  describe('getHoursICSDuration()', () => {
    it('should get the duration between two datetimes', () => {
      const calendar = new YahooCalendar(testOpts)
      const start = new Date('2019-03-23T17:00:00.000')
      const end = new Date('2019-03-23T20:23:00.000') // 03:23:00 difference
      const actualDiff = calendar.getHoursICSDuration(start.getTime(), end.getTime())

      expect(actualDiff).toBe(3)
    })
  })

  describe('render()', () => {
    it('should use the correct baseUrl', () => {
      const obj = new YahooCalendar(testOpts)
      const result = obj.render()
      const baseUrl = result.split('?')[0]

      expect(baseUrl).toBe(URL.YAHOO)
    })

    describe('is all day event', () => {
      const testOpts = {
        title: 'Fun Party',
        description: 'BYOB',
        location: 'New York',
        start: new Date('2019-07-04T19:00:00.000')
      }

      describe('no recurrence', () => {
        it('should format the query string without an end time', () => {
          const obj = new YahooCalendar(testOpts)
          const result = obj.render()

          const querystring = result.split('?')[1]
          const params = queryString.parse(querystring)
          const expectedObj = {
            v: '60',
            title: 'Fun Party',
            desc: 'BYOB',
            in_loc: 'New York',
            dur: 'allday',
            st: time.formatDate(obj.start, FORMAT.DATE)
          }
          expect(params).toMatchObject(expectedObj)
          expect(expectedObj).toMatchObject(params)
        })
      })

      describe('recurrence', () => {
        it('should format the query string with start and end times containing only their dates', () => {
          const recurrenceEnd = new Date('2019-07-10T19:00:00.000')
          const obj = new YahooCalendar({
            ...testOpts,
            recurrence: {
              frequency: DAILY,
              interval: 1,
              end: recurrenceEnd
            }
          })
          const result = obj.render()

          const querystring = result.split('?')[1]
          const params = queryString.parse(querystring)
          const expectedObj = {
            v: '60',
            title: 'Fun Party',
            desc: 'BYOB',
            in_loc: 'New York',
            dur: 'allday',
            st: time.formatDate(testOpts.start, FORMAT.DATE),
            RPAT: '01Dy',
            REND: time.formatDate(recurrenceEnd, FORMAT.DATE)
          }
          expect(params).toMatchObject(expectedObj)
        })
      })
    })

    describe('is not all day event', () => {
      const testOpts = {
        title: 'Fun Party',
        description: 'BYOB',
        location: 'New York',
        start: new Date('2019-07-04T19:00:00.000'),
        end: new Date('2019-07-04T21:00:00.000') // two-hour long event (19h to 21h)
      }

      describe('no recurrence', () => {
        describe('when the duration of the event spans 99 hours or fewer', () => {
          it('should format the query string with the time parameters with the start time and duration of two hours', () => {
            const obj = new YahooCalendar(testOpts)
            const result = obj.render()

            const querystring = result.split('?')[1]
            const params = queryString.parse(querystring)
            const expectedObj = {
              v: '60',
              title: 'Fun Party',
              desc: 'BYOB',
              in_loc: 'New York',
              st: time.formatDate(testOpts.start, FORMAT.FULL),
              dur: '0200'
            }
            expect(params).toMatchObject(expectedObj)
            expect(expectedObj).toMatchObject(params)
          })
        })

        describe('when the duration of the event spans longer than 99 hours', () => {
          it('should format the query string with the time parameters in start/end timestamps', () => {
            const start = new Date('2019-07-04T19:00:00.000')
            const end = new Date('2019-07-08T23:00:00.000') // one-hundred-hour long event, (four days, three hours)

            const obj = new YahooCalendar({ ...testOpts, start, end })
            const result = obj.render()

            const querystring = result.split('?')[1]
            const params = queryString.parse(querystring)
            const expectedObj = {
              v: '60',
              title: 'Fun Party',
              desc: 'BYOB',
              in_loc: 'New York',
              st: time.formatDate(start, FORMAT.FULL),
              et: time.formatDate(end, FORMAT.FULL)
            }
            expect(params).toMatchObject(expectedObj)
            expect(expectedObj).toMatchObject(params)
          })
        })
      })

      describe('recurrence', () => {
        it('should format the query string with RPAT and REND params', () => {
          const recurrenceEnd = new Date('2019-07-10T19:00:00.000')
          const obj = new YahooCalendar({
            ...testOpts,
            recurrence: {
              frequency: DAILY,
              interval: 1,
              end: recurrenceEnd
            }
          })
          const result = obj.render()

          const querystring = result.split('?')[1]
          const params = queryString.parse(querystring)
          const expectedObj = {
            v: '60',
            title: 'Fun Party',
            desc: 'BYOB',
            in_loc: 'New York',
            dur: '0200',
            st: time.formatDate(testOpts.start, FORMAT.FULL),
            RPAT: '01Dy',
            REND: time.formatDate(recurrenceEnd, FORMAT.DATE)
          }
          expect(params).toMatchObject(expectedObj)
        })
      })
    })
  })
})
