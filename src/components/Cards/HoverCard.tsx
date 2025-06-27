import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card"
import { format } from "date-fns"
import { de } from "date-fns/locale/de"
import { CalendarEvent } from "@/types/event"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog"
import { EventForm } from "../Form/EventForm"
import EventCard from "./EventCard"

interface EventProps  {
  event: CalendarEvent
}

export function CustomHoverCard({ event }: EventProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className="bg-green-50 flex flex-col justify-center h-full px-2 py-2 border border-gray-300 border-l-5 rounded-sm space-y-1"
          style={{ borderLeftColor: event.category.color }}
        >
          <div className="text-gray-800 font-semibold">{event.title}</div>
          <div className="text-xs text-gray-500 truncate">
            {format(event.start, "HH:mm", { locale: de })} -{" "}
            {format(event.end, "HH:mm", { locale: de })}
          </div>
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="w-80 space-y-2">
        <EventCard event={event} />
      </HoverCardContent>
    </HoverCard>
  )
}
