"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase/client"
import { CalendarToolbar } from "@/components/calendar/CalendarToolbar"
import { ListView } from "@/components/List/ListView"
import { MonthView } from "@/components/calendar/MonthView"
import { WeekView } from "@/components/calendar/WeekView"
import { CalendarEvent } from "@/types/event"
import { CalendarFilter } from "@/types/filter"
import { Category } from "@/types/category"
import { Patient } from "@/types/patient"
import { startOfDay } from "date-fns"

export default function CalendarPage() {
  const [currentView, setCurrentView] = useState<"list" | "week" | "month">("week")
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()))
  const [appointments, setAppointments] = useState<CalendarEvent[]>([])
  const [filters, setFilters] = useState<CalendarFilter>({})

  useEffect(() => {
    async function fetchAppointments() {
      const [{ data: appointmentsData, error }, { data: relativesData, error: error2 }] = await Promise.all([
        supabase.from("appointments").select(`
          id,
          title,
          start,
          end,
          location,
          notes,
          category (
            id,
            label,
            color,
            icon
          ),
          patient (
            id,
            firstname,
            lastname
          ),
          appointment_assignee (
            id,
            user,
            user_type
          )
        `),
        supabase.from("relatives").select("id, firstname, lastname, pronoun")
      ])
  
      if (error || error2) {
        console.error("Error fetching appointments:", error || error2)
        return
      }
  
      const mapped = appointmentsData.map((appt) => {
        const assigneesRaw = appt.appointment_assignee || []
      
        const assignees = assigneesRaw.map((asg: any) => {
          let assigneeName = "Unbekannt"
      
          if (asg.user_type === "relatives") {
            const match = relativesData.find(r => r.id === asg.user)
            if (match) {
              assigneeName = [match.pronoun, match.firstname, match.lastname].filter(Boolean).join(" ")
            }
          }
      
          return {
            id: asg.id,
            user: asg.user,
            user_type: asg.user_type,
            name: assigneeName
          }
        })
      
        return {
          id: appt.id,
          title: appt.title,
          start: new Date(appt.start),
          end: new Date(appt.end),
          location: appt.location,
          notes: appt.notes,
          category: appt.category as unknown as Category,
          patient: appt.patient as unknown as Patient,
          assignees
        }
      })
      
  
      setAppointments(mapped)
    }
  
    fetchAppointments()
  }, [])
  


  useEffect(()=> {
    console.log("app:", appointments)
}, [appointments])

  const filteredAppointments = appointments.filter((event) => {
    const { title, category, client, location, dateRange } = filters

    const matchTitle = title
      ? event.title?.toLowerCase().includes(title.toLowerCase())
      : true

    const matchCategory = category
      ? event.category?.label?.toLowerCase().includes(category.toLowerCase())
      : true

    const name = `${event.patient.firstname ?? ""} ${event.patient.lastname ?? ""}`.trim()
    const matchClient = client
      ? name.toLowerCase().includes(client.toLowerCase()) 
      : true

    const matchAssignees = filters.assigneeIds?.length
      ? event.assignees?.some((a) => filters.assigneeIds?.includes(a.id))
      : true

    const matchLocation = location
      ? event.location?.toLowerCase().includes(location.toLowerCase())
      : true

    const matchDateRange = dateRange?.from
      ? event.start >= dateRange.from &&
        (!dateRange.to || event.start <= dateRange.to)
      : true

    return (
      matchTitle &&
      matchCategory &&
      matchClient &&
      matchAssignees &&
      matchLocation &&
      matchDateRange
    )
  })

  return (
    <div className="w-full min-h-[100dvh] p-4 space-y-4">
      <CalendarToolbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        filters={filters}
        setFilters={setFilters}
      />

      {currentView === "list" && (
        <ListView startDate={selectedDate} events={filteredAppointments} />
      )}
      {currentView === "week" && (
        <WeekView selectedDate={selectedDate} events={filteredAppointments} />
      )}
      {currentView === "month" && (
        <MonthView selectedDate={selectedDate} events={filteredAppointments} />
      )}
    </div>
  )
}
