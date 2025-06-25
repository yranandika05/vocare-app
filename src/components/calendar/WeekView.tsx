"use client"
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { de } from 'date-fns/locale/de'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'


const locales = { de }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
  }

export default function WeekView() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    async function fetchAppointments() {
      const { data, error } = await supabase.from('appointments').select('*')
      if (!error && data) {
        setEvents(
          data.map((appt) => ({
            id: appt.id,
            title: appt.title || 'Unbenannter Termin',
            start: new Date(appt.start),
            end: new Date(appt.end),
          }))
        )
      }
    }

    fetchAppointments()
  }, [])

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
      />
    </div>
  )
}
