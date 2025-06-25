"use client"

import { useEffect, useState } from "react"
import { format, isToday } from "date-fns"
import { de } from "date-fns/locale/de"
import { CalendarCheck2, MapPin, User } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  location?: string
  notes?: string
}

interface ListViewProps {
  startDate: Date
}

export function ListView({ startDate }: ListViewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    // Dummy data
    const dummy: CalendarEvent[] = [
      {
        id: "1",
        title: "Arzttermin",
        start: new Date('2025-06-10T08:45:00'),
        end: new Date('2025-06-10T09:30:00'),
        location: "Praxis Dr. Muster",
        notes: "Keine Begleitung notwendig"
      },
      {
        id: "2",
        title: "MDK Besuch - Pflegegrad Prüfung",
        start: new Date('2025-06-11T10:30:00'),
        end: new Date('2025-06-11T12:00:00'),
        location: "Musterpatient zuhause",
        notes: "Rauno Rauer soll dabei sein"
      },
      {
        id: "3",
        title: "Physiotherapie",
        start: new Date('2025-06-12T14:00:00'),
        end: new Date('2025-06-12T14:45:00'),
        location: "Therapiezentrum",
        notes: "Begleitung durch Angehörige"
      }
    ]

    
    const filtered = dummy.filter(e => e.start >= startDate)
    setEvents(filtered)
    setLoading(false)
  }, [startDate])

  if (loading) return <p className="text-sm text-gray-500 text-center py-12">Lade Daten...</p>
  if (events.length === 0) return <p className="text-sm text-gray-500 text-center py-12">Keine Termine ab diesem Datum.</p>

  const grouped = events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
    const dateKey = format(event.start, 'yyyy-MM-dd')
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(event)
    return acc
  }, {})

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 space-y-8">
      {Object.entries(grouped).map(([date, items]) => (
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
              <div key={event.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
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
        </div>
      ))}

      <p className="text-sm text-gray-500 text-center">Keine weiteren Termine gefunden.</p>
    </div>
  )
}
