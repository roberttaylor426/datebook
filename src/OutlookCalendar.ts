import CalendarBase from './CalendarBase'
import { FORMAT, URL } from './constants'
import CalendarOptions from './types/CalendarOptions'
import data from './utils/data'
import time  from './utils/time'

/**
 * Generates an Outlook Calendar url.
 *
 * @remark Outlook Calendar's query string params do not support recurrence.
 */
export default class OutlookCalendar extends CalendarBase {
  /**
   * Constructor.
   *
   * @param {CalendarOptions} options - calendar options
   */
  constructor (options: CalendarOptions) {
    super(options)
  }

  /**
   * Generates the Outlook url.
   *
   * @returns {string}
   */
  public render (): string {
    let timestampFormat = FORMAT.OUTLOOK_DATE

    if (!this.allday) {
      timestampFormat += FORMAT.OUTLOOK_TIME
    }

    const params: Record<string, string> = {
      rru: 'addevent',
      startdt: time.formatDate(this.start, timestampFormat),
      enddt: time.formatDate(this.end, timestampFormat),
      subject: this.title,
      body: this.description,
      location: this.location,
      allday: this.allday.toString()
    }

    const baseUrl = URL.OUTLOOK
    const queryString = data.toQueryString(params)

    return `${baseUrl}?path=/calendar/action/compose&${queryString}`
  }
}
