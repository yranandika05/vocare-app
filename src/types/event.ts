import { Category } from "./category"
import { Patient } from "./patient"

export type CalendarEvent = {
  category: Category
  id: string
  title: string
  start: Date
  end: Date
  location?: string
  notes?: string
  patient: Patient
  assignees: {
    id: string
    name: string
    user: string
    user_type: string
  }[]
}
