"use client"

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { de } from 'date-fns/locale/de'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import { CustomHoverCard } from '../Cards/HoverCard'
import { EventListSidebar } from '../List/EventListSidebar'

const locales = { de }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
}

interface MonthViewProps {
  selectedDate: Date
}

export function MonthView({ selectedDate }: MonthViewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    async function fetchAppointments() {
      const { data, error } = await supabase.from('appointments').select('*')
      if (!error && data) {
        const mappedEvents = data.map((appt) => ({
          id: appt.id,
          title: appt.title || 'Unbenannter Termin',
          start: new Date(appt.start),
          end: new Date(appt.end),
        }))
        setEvents(mappedEvents)
      }
    }
    fetchAppointments()
  }, [])

  return (
    <div className="flex w-full min-h-[100dvh] p-4 gap-4">
        <div className="flex-1">
            <Calendar
                localizer={localizer}
                events={events}
                defaultView="month"
                views={['month']}
                style={{ height: "80vh" }}
                date={selectedDate}
                toolbar={false}
                formats={{
                monthHeaderFormat: (date, culture, localizer) =>
                    localizer?.format(date, 'MMMM yyyy', culture) ?? '',
                weekdayFormat: (date, culture, localizer) =>
                    localizer?.format(date, 'EEE', culture) ?? '',
                dayFormat: (date, culture, localizer) =>
                    localizer?.format(date, 'd', culture) ?? '',
                }}
                components={{
                    event: CustomHoverCard
                }}
            />
        </div>
        
        <div className="w-80 border-l pl-4">
            <EventListSidebar events={events} selectedDay={selectedDate} />
        </div>
    </div>
  )
}
