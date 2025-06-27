import { DateRange } from "react-day-picker"

export type CalendarFilter = {
  title?: string
  category?: string
  client?: string
  location?: string
  assigneeIds?: string[]
  dateRange?: DateRange
}