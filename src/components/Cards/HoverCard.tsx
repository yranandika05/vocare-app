import { CalendarCheck2, MapPin, User } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { format } from "date-fns"
import { de } from "date-fns/locale/de"

interface EventProps {
  event: {
    id: string
    title: string
    start: Date
    end: Date
    location?: string
    notes?: string
  }
}

export function CustomHoverCard({ event }: EventProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="bg-green-50 flex flex-col justify-center h-full px-2 py-2 border border-gray-300 border-l-5 border-l-green-400 rounded-sm space-y-1">
            <div className="text-gray-800 font-semibold">{event.title}</div>
            <div className="text-xs text-gray-500 truncate">
                {format(event.start, 'HH:mm', { locale: de })} - {format(event.end, 'HH:mm', { locale: de })}
            </div>
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="w-80">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="font-semibold">{event.title}</span>
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
      </HoverCardContent>
    </HoverCard>
  )
}
