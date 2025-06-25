"use client"

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { CustomHoverCard } from '../Cards/HoverCard'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { de } from 'date-fns/locale/de'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'


const locales = { de }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
}

interface WeekViewProps {
  selectedDate: Date
}

export function WeekView({ selectedDate }: WeekViewProps) {
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

  useEffect(()=>{
    console.log("events: ", events)
  }, [events])

  return (
    <div className="h-screen p-4">
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={['week']}
        step={30}
        timeslots={2}
        style={{ height: "80vh" }}
        date={selectedDate}
        toolbar={false}
        formats={{
            dayRangeHeaderFormat: () => '', 
            weekdayFormat: (date, culture, localizer) =>
                localizer?.format(date, 'EEEE, dd. MMMM', culture) ?? ''
        }}
        dayPropGetter={(date) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            if (isSelected) {
                return {
                style: { backgroundColor: '#DBEAFE' }
                }
            }
            return {}
            }}
        components={{
            event: CustomHoverCard
        }}
      />
    </div>
  )
}
