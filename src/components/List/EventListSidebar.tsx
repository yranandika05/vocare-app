"use client"

import { format, isSameDay } from "date-fns"
import de from "date-fns/locale/de"
import { CalendarCheck2, MapPin, User } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  location?: string
  notes?: string
}

interface EventListSidebarProps {
  events: CalendarEvent[]
  selectedDay: Date | null
}

export function EventListSidebar({ events, selectedDay }: EventListSidebarProps) {
  if (!selectedDay) return <p className="text-gray-500">Wählen Sie ein Datum</p>

  const dayEvents = events.filter(event => isSameDay(event.start, selectedDay))

  return (
    <div>
      <h3 className="font-semibold mb-2">
        {format(selectedDay, 'EEEE, dd. MMMM', { locale: de })}
      </h3>

      {dayEvents.length === 0 && (
        <p className="text-sm text-gray-500">Keine Termine für diesen Tag.</p>
      )}

      {dayEvents.map(event => (
        <div key={event.id} className="rounded-lg border p-3 mb-3 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="font-medium">{event.title}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <CalendarCheck2 className="w-4 h-4" />
            {format(event.start, 'HH:mm', { locale: de })} bis {format(event.end, 'HH:mm', { locale: de })}
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <MapPin className="w-4 h-4" />
              {event.location}
            </div>
          )}

          {event.notes && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="w-4 h-4" />
              {event.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
