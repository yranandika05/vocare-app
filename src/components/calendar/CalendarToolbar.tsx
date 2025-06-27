import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"
import { Calendar } from "../ui/calendar"
import { Calendar as CalendarIcon, Plus } from "lucide-react"
import { CalendarFilterPopover } from "../Cards/CalendarFilterPopover"
import { CalendarFilter } from "@/types/filter"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog"
import { EventForm } from "../Form/EventForm"

interface Props {
  currentView: "list" | "week" | "month"
  setCurrentView: (view: "list" | "week" | "month") => void
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  filters: CalendarFilter
  setFilters: (filters: CalendarFilter) => void
}

export function CalendarToolbar({
  currentView,
  setCurrentView,
  selectedDate,
  setSelectedDate,
  filters,
  setFilters
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex space-x-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-3xs flex items-center justify-start gap-2 px-2"
            >
              <CalendarIcon className="w-4 h-4" />
              {selectedDate.toLocaleDateString()}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
            />
          </PopoverContent>
        </Popover>

        <ToggleGroup
          type="single"
          value={currentView}
          onValueChange={(value) =>
            value && setCurrentView(value as Props["currentView"])
          }
          className="border rounded-sm"
        >
          <ToggleGroupItem
            value="list"
            className="px-4 data-[state=on]:bg-primary data-[state=on]:text-white"
          >
            Liste
          </ToggleGroupItem>
          <ToggleGroupItem
            value="week"
            className="px-4 data-[state=on]:bg-primary data-[state=on]:text-white"
          >
            Woche
          </ToggleGroupItem>
          <ToggleGroupItem
            value="month"
            className="px-4 data-[state=on]:bg-primary data-[state=on]:text-white"
          >
            Monat
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex space-x-4">
        <CalendarFilterPopover filters={filters} setFilters={setFilters} />

        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Neuer Termin
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Neuen Termin erstellen</DialogTitle>
                <EventForm />
            </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
