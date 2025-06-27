"use client"

import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { CustomHoverCard } from "../Cards/HoverCard"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { de } from "date-fns/locale/de"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { CalendarEvent } from "@/types/event"

const locales = { de }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface WeekViewProps {
  selectedDate: Date
  events: CalendarEvent[]
}

export function WeekView({ selectedDate, events }: WeekViewProps) {
  return (
    <div className="h-screen p-4">
      <Calendar
        showMultiDayTimes
        localizer={localizer}
        events={events}
        defaultView="week"
        views={["week"]}
        step={30}
        timeslots={2}
        style={{ height: "80vh" }}
        date={selectedDate}
        toolbar={false}
        formats={{
          dayRangeHeaderFormat: () => "",
          weekdayFormat: (date, culture, localizer) =>
            localizer?.format(date, "EEEE, dd. MMMM", culture) ?? "",
        }}
        dayPropGetter={(date) => {
          const isSelected =
            date.toDateString() === selectedDate.toDateString()
          if (isSelected) {
            return {
              style: {
                backgroundColor: "#DBEAFE", // tailwind blue-100
              },
            }
          }
          return {}
        }}
        components={{
          event: CustomHoverCard,
        }}
      />
    </div>
  )
}
