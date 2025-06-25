"use client"

import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import { ListView } from "@/components/List/ListView";
import { MonthView } from "@/components/calendar/MonthView";
import { WeekView } from "@/components/calendar/WeekView";
import { useState } from "react";

export default function CalendarPage() {
    const [currentView, setCurrentView] = useState<"list" | "week" | "month">("week")
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  
    return (
    <div className="w-full min-h-[100dvh] p-4 space-y-4">
        <CalendarToolbar 
            currentView={currentView}
            setCurrentView={setCurrentView}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
        />

        {currentView == "list" && <ListView startDate={selectedDate}/>}
        {currentView == "week" && <WeekView selectedDate={selectedDate}/>}
        {currentView == "month" && <MonthView selectedDate={selectedDate}/>}
    </div>
    )
}
