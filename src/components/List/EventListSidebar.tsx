"use client"

import { CalendarEvent } from "@/types/event"
import { format } from "date-fns"
import { de } from "date-fns/locale/de"
import  EventCard  from "../Cards/EventCard"

interface EventListSidebarProps {
  events: CalendarEvent[]
  selectedDay: Date | null
}

export function EventListSidebar({ events, selectedDay }: EventListSidebarProps) {
  if (!selectedDay) {
    return <p className="text-gray-500">Wählen Sie ein Datum</p>
  }

  const dayEvents = events
    .filter((event) => {
      const start = new Date(event.start)
      const end = new Date(event.end)
      const day = new Date(selectedDay)

      day.setHours(0, 0, 0, 0)
      start.setHours(0, 0, 0, 0)
      end.setHours(0, 0, 0, 0)

      return day >= start && day <= end
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()) // Sort chronologically by start time

  return (
    <div>
      <h3 className="font-semibold mb-2">
        {format(selectedDay, "EEEE, dd. MMMM", { locale: de })}
      </h3>

      {dayEvents.length === 0 ? (
        <p className="text-sm text-gray-500">Keine Termine für diesen Tag.</p>
      ) : (
        dayEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))
      )}
    </div>
  )
}

