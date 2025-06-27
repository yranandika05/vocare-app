"use client"

import { CalendarEvent } from "@/types/event"
import { eachDayOfInterval, format, isToday } from "date-fns"
import { de } from "date-fns/locale/de"
import { CalendarCheck2, MapPin, NotebookText, User } from "lucide-react"
import { useEffect } from "react"
import EventCard from "../Cards/EventCard"

interface ListViewProps {
  startDate: Date
  events: CalendarEvent[]
}

export function ListView({ startDate, events }: ListViewProps) {
  const filteredEvents = events.filter(e => e.end >= startDate)

  if (filteredEvents.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-12">Keine Termine ab diesem Datum.</p>
  }

  const grouped: Record<string, CalendarEvent[]> = {}

  filteredEvents.forEach(event => {
    const days = eachDayOfInterval({ start: event.start, end: event.end })

    days.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd')
      if (!grouped[dateKey]) grouped[dateKey] = []

      if (!grouped[dateKey].some(e => e.id === event.id)) {
        grouped[dateKey].push(event)
      }
    })
  })

  useEffect(()=> {
          console.log("group:", grouped)
      }, [])

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 space-y-8">
      {Object.entries(grouped)
        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
        .map(([date, items]) => (
        <div key={date} className="space-y-2 w-full max-w-md">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-lg font-semibold">
              {format(new Date(date), 'EEEE, dd. MMMM', { locale: de })}
            </h3>
            {isToday(new Date(date)) && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Heute</span>
            )}
          </div>

          <div className="space-y-2">
            {items.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}

      <p className="text-sm text-gray-500 text-center">Keine weiteren Termine gefunden.</p>
    </div>
  )
}
