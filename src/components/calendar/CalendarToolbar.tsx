import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ToggleGroup } from "@radix-ui/react-toggle-group"
import { ToggleGroupItem } from "../ui/toggle-group"
import { Calendar } from "../ui/calendar"

interface Props {
    currentView: "list" | "week" | "month"
    setCurrentView: (view: "list" | "week" | "month") => void
    selectedDate: Date
    setSelectedDate: (date:Date) => void
}

export function CalendarToolbar({ currentView, setCurrentView, selectedDate, setSelectedDate }: Props){
    return (
        <div className="flex items-center justify-between">
            <div className="flex space-x-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
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

                <ToggleGroup type="single" value={currentView} onValueChange={(value) => value && setCurrentView(value as Props["currentView"])}>
                    <ToggleGroupItem value="list">Liste</ToggleGroupItem>
                    <ToggleGroupItem value="week">Woche</ToggleGroupItem>
                    <ToggleGroupItem value="month">Monat</ToggleGroupItem>
                </ToggleGroup>
            </div>
            
            <div className="space-x-4">
                <Button variant="outline">
                    Filter
                </Button>

                <Button>
                    Neuer Termin
                </Button>
            </div>
            
        </div>
    )
}