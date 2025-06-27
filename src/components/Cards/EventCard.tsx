"use client"
import { CalendarEvent } from "@/types/event"
import { de } from "date-fns/locale"
import { CalendarCheck2, MapPin, Contact, User, NotebookText, Pencil } from "lucide-react"
import { format } from "date-fns"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog"
import { EventForm } from "../Form/EventForm"

interface EventCardProps {
    event: CalendarEvent
}

export default function EventCard({ event }:EventCardProps ) {
    return (
      <div key={event.id} className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Title and Category */}
        <div className="flex gap-2 mb-2">
          <span className="w-3 h-3 rounded-full inline-block mt-2" style={{ backgroundColor: event.category?.color }} />
          <div>
            <span className="font-medium">{event.title}</span>
            <p className="text-xs text-gray-500">{event.category.label}</p>
          </div>
        </div>
        
        {/* Start Time and End Time */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <CalendarCheck2 className="w-4 h-4" />
            {format(event.start, 'dd.MM.yyyy HH:mm', { locale: de })} bis {format(event.end, 'dd.MM.yyyy HH:mm', { locale: de })}
        </div>


        {/* Location */}
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <MapPin className="w-4 h-4" />
            {event.location}
          </div>
        )}

        {/* Assignees */}
        {event.assignees?.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-gray-500">
            <Contact className="w-4 h-4 mt-0.5" />
            <div className="flex flex-col">
              {event.assignees.map((assignee) => (
                <span key={assignee.id}>
                  {assignee.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Client */}
        {event.patient && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User className="w-4 h-4" />
            {event.patient.firstname || event.patient.lastname ? (
              <span>
                {[event.patient.firstname, event.patient.lastname].filter(Boolean).join(" ")}
              </span>
            ) : (
              <span className="italic text-muted-foreground">Kein Patientenname</span>
            )}
          </div>
        )}

        {/* Notes */}
        {event.notes && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <NotebookText className="w-4 h-4" />
            {event.notes}
          </div>
        )}

        {/* Dialog Button to open Edit Form */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
              <Pencil className="w-4 h-4" />
              Bearbeiten
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Termin bearbeiten</DialogTitle>
            <EventForm
              initialData={{
                title: event.title,
                location: event.location,
                notes: event.notes,
                categoryId: event.category?.id,
                patientId: event.patient?.id,
                assigneeIds: event.assignees?.map((a) => a.id) ?? [],
                dateRange: {
                  from: new Date(event.start),
                  to: new Date(event.end),
                },
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    )
}