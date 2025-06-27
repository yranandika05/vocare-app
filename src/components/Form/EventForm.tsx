"use client"

import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ChevronDownIcon } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Calendar } from "../ui/calendar"
import { DateRange } from "react-day-picker"
import { supabase } from "@/utils/supabase/client"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select"
import { Patient } from "@/types/patient"
import { AppointmentAssignee } from "@/types/appointmentAssignee"
import { Relative } from "@/types/relative"

interface EventFormProps {
  mode: "create" | "edit"
  initialData?: {
    title?: string
    location?: string
    notes?: string
    categoryId?: string
    patientId?: string
    dateRange?: DateRange
    assigneeIds?: string[]
  }
}

interface Category {
  id: string
  label: string
}

export function EventForm({ mode, initialData }: EventFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [location, setLocation] = useState(initialData?.location ?? "")
  const [notes, setNotes] = useState(initialData?.notes ?? "")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialData?.dateRange)
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "")
  const [patientId, setPatientId] = useState(initialData?.patientId ?? "")
  const [assigneeIds, setAssigneeIds] = useState<string[]>(initialData?.assigneeIds ?? [])


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
          const relative : Relative | undefined = relativesData.find((r) => r.id === asg.user)
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
    <div className="space-y-6 max-w-md mx-auto">
      <div className="grid gap-4">

        {/* Title */}
        <div className="grid gap-2">
          <Label htmlFor="title">Titel</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        {/* Category */}
        <div className="grid gap-2">
          <Label>Kategorie</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Kategorie wählen" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Client */}
        <div className="grid gap-2">
          <Label>Klient:in</Label>
          <Select value={patientId} onValueChange={setPatientId}>
            <SelectTrigger>
              <SelectValue placeholder="Klient:in wählen" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((pat) => (
                <SelectItem key={pat.id} value={pat.id}>
                  {`${pat.firstname ?? ""} ${pat.lastname ?? ""}`.trim()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assignee */}
        <div className="grid gap-2">
            <Label>Abtretungsempfänger:innen</Label>
            <Popover>
                <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between font-medium">
                    {assigneeIds.length > 0
                    ? assigneeDisplayList
                        .filter((a) => assigneeIds.includes(a.id))
                        .map((a) => a.displayName)
                        .join(", ")
                    : "Abtretungsempfänger:in wählen"}
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full max-h-60 overflow-y-auto">
                <div className="flex flex-col gap-1">
                    {assigneeDisplayList.map((asg) => {
                    const isSelected = assigneeIds.includes(asg.id)
                    return (
                        <label
                        key={asg.id}
                        className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-muted rounded-sm"
                        >
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                            setAssigneeIds((prev) =>
                                isSelected
                                ? prev.filter((id) => id !== asg.id)
                                : [...prev, asg.id]
                            )
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

        {/* Location */}
        <div className="grid gap-2">
          <Label htmlFor="location">Standort</Label>
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        {/* Notes */}
        <div className="grid gap-2">
          <Label htmlFor="notes">Notizen</Label>
          <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {/* Start Date */}
        <div className="grid gap-2">
        <Label className="px-1">Start</Label>
        <div className="flex gap-4">
            {/* Date Picker */}
            <Popover>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                className="w-36 justify-between font-normal"
                >
                {dateRange?.from ? format(dateRange.from, "dd.MM.yyyy", { locale: de }) : "Datum wählen"}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                mode="single"
                selected={dateRange?.from}
                onSelect={(date) => {
                    setDateRange((prev) => ({
                    from: date!,
                    to: prev?.to ?? undefined,
                    }))
                }}
                locale={de}
                />
            </PopoverContent>
            </Popover>

            {/* Time Picker */}
            <Input
            type="time"
            value={
                dateRange?.from
                ? format(dateRange.from, "HH:mm")
                : ""
            }
            onChange={(e) => {
                const [hours, minutes] = e.target.value.split(":").map(Number)
                setDateRange((prev) => {
                const newDate = prev?.from ? new Date(prev.from) : new Date()
                newDate.setHours(hours)
                newDate.setMinutes(minutes)
                return { from: newDate, to: prev?.to ?? undefined }
                })
            }}
            className="w-28 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
            />
        </div>
        </div>

        {/* End Date */}
        <div className="grid gap-2">
        <Label className="px-1">Ende</Label>
        <div className="flex gap-4">
            {/* Date Picker */}
            <Popover>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                className="w-36 justify-between font-normal"
                >
                {dateRange?.to ? format(dateRange.to, "dd.MM.yyyy", { locale: de }) : "Datum wählen"}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                mode="single"
                selected={dateRange?.to}
                onSelect={(date) => {
                    setDateRange((prev) => ({
                    from: prev?.from ?? undefined,
                    to: date!,
                    }))
                }}
                locale={de}
                />
            </PopoverContent>
            </Popover>

            {/* Time Picker */}
            <Input
            type="time"
            value={
                dateRange?.to
                ? format(dateRange.to, "HH:mm")
                : ""
            }
            onChange={(e) => {
                const [hours, minutes] = e.target.value.split(":").map(Number)
                setDateRange((prev) => {
                const newDate = prev?.to ? new Date(prev.to) : new Date()
                newDate.setHours(hours)
                newDate.setMinutes(minutes)
                return { from: prev?.from ?? undefined, to: newDate }
                })
            }}
            className="w-28 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
            />
        </div>
        </div>
      </div>

      {/* <Button onClick={() => onSubmit?.({ title, location, notes, categoryId, patientId, dateRange })}>
        Speichern
      </Button> */}
      <Button disabled variant="secondary">
        Speichern (Prototyp – deaktiviert)
      </Button>
    </div>
  )
}
