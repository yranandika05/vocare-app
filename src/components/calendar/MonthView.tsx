"use client"

import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { de } from "date-fns/locale/de"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { CustomHoverCard } from "../Cards/HoverCard"
import { EventListSidebar } from "../List/EventListSidebar"
import { CalendarEvent } from "@/types/event"

const locales = { de }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface MonthViewProps {
  selectedDate: Date
  events: CalendarEvent[]
}

export function MonthView({ selectedDate, events }: MonthViewProps) {
  return (
    <div className="flex w-full min-h-[100dvh] p-4 gap-4">
      <div className="flex-1">
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="month"
          views={["month"]}
          date={selectedDate}
          toolbar={false}
          style={{ height: "80vh" }}
          formats={{
            monthHeaderFormat: (date, culture, localizer) =>
              localizer?.format(date, "MMMM yyyy", culture) ?? "",
            weekdayFormat: (date, culture, localizer) =>
              localizer?.format(date, "EEE", culture) ?? "",
            dayFormat: (date, culture, localizer) =>
              localizer?.format(date, "d", culture) ?? "",
          }}
          components={{
            event: CustomHoverCard,
          }}
        />
      </div>

      <div className="w-80 border-l pl-4">
        <EventListSidebar events={events} selectedDay={selectedDate} />
      </div>
    </div>
  )
}
