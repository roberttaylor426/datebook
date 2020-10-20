import CalendarBase from './CalendarBase'
import { RECURRENCE, URL, FORMAT } from './constants'
import data from './utils/data'
import time from './utils/time'
import CalendarOptions from './types/CalendarOptions'
import CalendarRecurrence from './types/CalendarRecurrence'

/**
 * Generates a Yahoo! Calendar url.
 *
 * @remark Yahoo! Calendar's support for recurrence is limited to only the interval and frequency.
 */
export default class YahooCalendar extends CalendarBase {
  /**
   * Constructor.
   *
   * @param {CalendarOptions} options - calendar options
   */
  constructor (options: CalendarOptions) {
    super(options)
  }

  /**
   * Maps the given Recurrence weekdays to a Yahoo! weekdays format.
   * This will strip out any count prefixes, as they're not supported by YC.
   * Example: 1MO,2TU,3WE becomes MoTuWe
   *
   * @param {string[]} [weekdays = []]
   * @returns {string}
   */
  public getWeekdays (weekdays: string[] = []): string {
    return weekdays
      .map(w => {
        return data.toProperCase(w.replace(/[^A-Z]/ig, ''))
      })
      .join('')
  }

  /**
   * Maps the given Recurrence frequency to a Yahoo! frequency format.
   * Example: DAILY becomes Dy; MONTHLY becomes Mh
   *
   * @param {string} frequency
   * @returns {string}
   */
  public getFrequency (frequency: string | undefined): string {
    const { FREQUENCY } = RECURRENCE

    switch (frequency) {
      case FREQUENCY.YEARLY:
        return 'Yr'
      case FREQUENCY.MONTHLY:
        return 'Mh'
      case FREQUENCY.WEEKLY:
        return 'Wk'
      default:
        return 'Dy' // daily
    }
  }

  /**
   * Converts the Recurrence to a Yahoo! recurrence string.
   *
   * @param {CalendarRecurrence} recurrence
   * @returns {string}
   */
  public getRecurrence (recurrence: CalendarRecurrence): string {
    const frequency = this.getFrequency(recurrence.frequency)
    const weekdays = this.getWeekdays(recurrence.weekdays)
    const { interval = 1 } = recurrence

    let prefix = ''

    if (recurrence.weekdays?.length && recurrence.frequency === RECURRENCE.FREQUENCY.MONTHLY) {
      // YC only supports the first count of a recurring weekday
      // e.g., -1FR,2TU (every last Friday and every second Tuesday) is NOT supported, but
      // -1FR,TU (every last Friday and Tuesday) IS supported -- strip out all prefixes from
      // the list, then find the first nonzero prefix (if any) and prepend it to the list
      const matches = recurrence.weekdays[0].match(/^([1-5])/)

      prefix = matches ? matches[0] : '1'
    }

    return [
      time.addLeadingZero(interval),
      frequency,
      prefix,
      weekdays
    ].join('')
  }

  /**
   * Computes the number of days a recurrence will last.
   *
   * @param {CalendarRecurrence} recurrence
   * @returns {number}
   */
  public getRecurrenceLengthDays (recurrence: CalendarRecurrence): number {
    const { frequency, interval } = recurrence
    const { FREQUENCY } = RECURRENCE

    if (interval) {
      switch (frequency) {
        case FREQUENCY.YEARLY:
          return interval * 365.25
        case FREQUENCY.MONTHLY:
          return interval * 30.42 // avg days in a year
        case FREQUENCY.WEEKLY:
          return interval * 7
        default:
          return interval // daily
      }
    }

    // if no frequency is specified, set an arbitrarily-long recurrence end
    return 365.25 * 100 // 100 years
  }

  /**
   * Returns the duration between two given dates in hhmm format.
   *
   * @param {number} start
   * @param {number} end
   * @returns {string}
   */
  public getICSDuration (start: number, end: number): string {
    const seconds = Math.floor((end - start) / 1000)
    const hours = Math.floor(seconds / 3600)
    const mins = ((seconds / 3600) % 1) * 60

    return `${time.addLeadingZero(hours)}${time.addLeadingZero(mins)}`
  }

  /**
   * Returns the number of hours between two given dates.
   *
   * @param {number} start
   * @param {number} end
   * @returns {number}
   */
  public getHoursICSDuration (start: number, end: number): number {
    const seconds = Math.floor((end - start) / 1000)

    return Math.floor(seconds / 3600)
  }

  /**
   * Generates the Yahoo! Calendar data.
   *
   * @returns {string}
   */
  public render (): string {
    const params: Record<string, string>  = {
      v: '60', // version number; must be 60
      title: this.title,
      desc: this.description,
      in_loc: this.location
    }

    if (this.allday) {
      params.dur = 'allday'
      params.st = time.formatDate(this.start, FORMAT.DATE)
    } else {
      params.st = time.formatDate(this.start, FORMAT.FULL)

      if (this.getHoursICSDuration(this.start.getTime(), this.end.getTime()) > 99) {
        // Yahoo only supports up to 99 hours, so we are forced to specify the end time instead of the duration
        params.et = time.formatDate(this.end, FORMAT.FULL)
      } else {
        // we prefer specifying duration in lieu of end time, because apparently Yahoo's end time is buggy w.r.t. timezones
        params.dur = this.getICSDuration(this.start.getTime(), this.end.getTime())
      }
    }

    if (this.recurrence) {
      params.RPAT = this.getRecurrence(this.recurrence)

      if (this.recurrence.end) {
        params.REND = time.formatDate(this.recurrence.end, FORMAT.DATE)
      } else {
        const days = this.getRecurrenceLengthDays(this.recurrence)
        const rend = time.incrementDate(this.end, Math.ceil(days))

        params.REND = time.formatDate(rend, FORMAT.DATE)
      }
    }

    const baseUrl = URL.YAHOO
    const queryString = data.toQueryString(params)

    return `${baseUrl}?${queryString}`
  }
}
