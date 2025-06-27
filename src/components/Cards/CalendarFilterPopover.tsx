import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { SlidersHorizontal, Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CalendarFilter } from "@/types/filter"
import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase/client"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "../ui/select"
import { Patient } from "@/types/patient"
import { AppointmentAssignee } from "@/types/appointmentAssignee"
import { Relative } from "@/types/relative"

interface Props {
  filters: CalendarFilter
  setFilters: (filters: CalendarFilter) => void
}

interface Category {
  id: string
  label: string
}

export function CalendarFilterPopover({ filters, setFilters }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [assigneeDisplayList, setAssigneeDisplayList] = useState<AppointmentAssignee[]>([])

  useEffect(() => {
    async function fetchOptions() {
      const { data: categoryData } = await supabase.from("categories").select("id, label")
      const { data: patientData } = await supabase.from("patients").select("id, firstname, lastname")
      const { data: assigneeData } = await supabase.from("appointment_assignee").select("id, user, user_type")
      const { data: relativesData } = await supabase.from("relatives").select("id, pronoun, firstname, lastname")
      if (categoryData) setCategories(categoryData)
      if (patientData) setPatients(patientData)
      if (assigneeData && relativesData) {
        const enriched = assigneeData.map((asg: AppointmentAssignee) => {
            const relative: Relative | undefined = relativesData.find((r) => r.id === asg.user)
            return {
            id: asg.id,
            user: asg.user,
            user_type: asg.user_type,
            displayName: relative
                ? `${relative.pronoun ?? ""} ${relative.firstname ?? ""} ${relative.lastname ?? ""}`.trim()
                : asg.user_type
            }
        })
        setAssigneeDisplayList(enriched)
        }
    }
    fetchOptions()
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Termine Filtern
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[360px]">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Termine Filtern</h4>
            <p className="text-muted-foreground text-sm">
              Setzen Sie die Filter für Ihre Termine.
            </p>
          </div>

          <div className="grid gap-2">

            {/* Titel */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                className="col-span-2 h-8"
                value={filters.title ?? ""}
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              />
            </div>

            {/* Kategorie */}
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label>Kategorie</Label>
                    <Select
                        value={filters.category ?? ""}
                        onValueChange={(value) =>
                            setFilters({ ...filters, category: value === "__empty__" ? "" : value })
                        }
                        >
                        <SelectTrigger className="col-span-2 h-8">
                            <SelectValue placeholder="Kategorie wählen" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__empty__">–</SelectItem>
                            {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.label}>
                                {cat.label}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Klient:in */}
                <div className="grid grid-cols-3 items-center gap-4">
                <Label>Klient:in</Label>
                <Select
                    value={filters.client ?? ""}
                    onValueChange={(value) =>
                        setFilters({ ...filters, client: value === "__empty__" ? "" : value })
                    }
                    >
                    <SelectTrigger className="col-span-2 h-8">
                        <SelectValue placeholder="Klient:in wählen" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__empty__">–</SelectItem>
                        {patients.map((p) => {
                        const name = `${p.firstname ?? ""} ${p.lastname ?? ""}`.trim()
                        return (
                            <SelectItem key={p.id} value={name}>
                            {name}
                            </SelectItem>
                        )
                        })}
                    </SelectContent>
                </Select>
            </div>

            {/* Assignee */}
            <div className="grid grid-cols-3 items-center gap-4">
                <Label>Abtretung</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="col-span-2 py-1.5 px-3 h-auto min-h-6 text-left flex justify-between items-start gap-2"
                            >
                            <span className="flex-1 whitespace-normal break-words">
                                {filters.assigneeIds && filters.assigneeIds.length > 0
                                ? assigneeDisplayList
                                    .filter((a) => filters.assigneeIds?.includes(a.id))
                                    .map((a) => a.displayName)
                                    .join(", ")
                                : "Wählen"}
                            </span>
                            <ChevronDownIcon className="mt-1 shrink-0 w-4 h-4 text-muted-foreground" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-full max-h-60 overflow-y-auto">
                    <div className="flex flex-col gap-1">
                        {assigneeDisplayList.map((asg) => {
                        const isSelected = filters.assigneeIds?.includes(asg.id)
                        return (
                            <label
                            key={asg.id}
                            className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-muted rounded-sm"
                            >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                const newIds = isSelected
                                    ? filters.assigneeIds?.filter((id) => id !== asg.id)
                                    : [...(filters.assigneeIds ?? []), asg.id]
                                setFilters({ ...filters, assigneeIds: newIds })
                                }}
                            />
                            <span>{asg.displayName}</span>
                            </label>
                        )
                        })}
                    </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Standort */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="location">Standort</Label>
              <Input
                id="location"
                className="col-span-2 h-8"
                value={filters.location ?? ""}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Zeitraum</Label>
              <div className="col-span-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal h-8">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange?.from ? (
                        filters.dateRange.to
                          ? `${format(filters.dateRange.from, "dd.MM.yyyy", { locale: de })} – ${format(filters.dateRange.to, "dd.MM.yyyy", { locale: de })}`
                          : format(filters.dateRange.from, "dd.MM.yyyy", { locale: de })
                      ) : (
                        <span className="text-muted-foreground">Datum wählen</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={filters.dateRange}
                      onSelect={(dateRange) => setFilters({ ...filters, dateRange })}
                      numberOfMonths={2}
                      locale={de}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
