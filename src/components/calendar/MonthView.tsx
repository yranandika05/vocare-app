"use client"
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export default function MonthView() {
  return (
    <div className="p-4">
      <DayPicker mode="single" />
    </div>
  )
}
