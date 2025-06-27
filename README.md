# 🗓️ Terminverwaltung – Testprojekt

## 📝 Projektbeschreibung (Deutsch)

### 📦 Komponenten und Technologien

Dieses Projekt wurde mit **Next.js** und **shadcn/ui** entwickelt. Da die Kalender-Komponente von shadcn nur begrenzte Funktionen bietet, wurde **React Big Calendar** integriert. Diese Bibliothek erfüllt Anforderungen wie:

- **Wochen- und Monatsansichten**
- Darstellung von **mehrtägigen Terminen**
- **Anpassbare Event-Komponenten**, die mit HoverCards von shadcn erweiterbar sind

---

### ⚙️ Herausforderungen & Lösungen

#### 1. 🗓️ Mehrtägige Termine

Die Darstellung von Terminen, die sich über mehrere Tage erstrecken, erforderte besondere Behandlung:

- **ListView**: Termine werden an jedem Tag angezeigt, den sie betreffen, nicht nur am Startdatum.
- **EventListSidebar**: Ein Termin erscheint auch dann, wenn der ausgewählte Tag zwischen Start- und Enddatum liegt.

#### 2. 👥 Assignee-Daten aus verbundenen Tabellen

Da die Tabelle `appointment_assignee` keine vollständigen Nutzerdaten enthält:

- Wurde ein zusätzlicher Fetch auf die Tabelle `relatives` implementiert
- Die Zuordnung erfolgt anhand von `user_type` und `user`
- Der Name wird im Frontend aus Titel, Vorname und Nachname zusammengesetzt

#### 3. 🧩 Typisierung und Datenstruktur

Basierend auf dem Supabase-Schema wurden alle Typen sorgfältig angepasst:

- Die Beziehung `appointment_assignee` → `appointments` ist **many-to-one**
- Die Typisierung berücksichtigt optionale und array-basierte Felder

---

### 🛠️ Termin-Erstellung und -Bearbeitung

Ein **Dialog** ermöglicht die Erstellung und Bearbeitung von Terminen:

- **Neu erstellen**: Button oben rechts
- **Bearbeiten**: Über HoverCard oder DetailCard unten rechts

Da Testnutzer:innen keine Schreibrechte besitzen, ist die Speicherfunktion aktuell deaktiviert. Die `EventForm`-Komponente ist vollständig **wiederverwendbar** und erlaubt flexible Übergabe des `onSubmit`-Handlers per Props.

---

## 📄 Project Description (English)

### 📦 Components and Technologies

This project is built with **Next.js** and **shadcn/ui**. Because shadcn’s calendar is limited, **React Big Calendar** was added to support:

- **Week and Month views**
- Support for **multi-day events**
- **Custom event components**, extendable with ShadCN HoverCards for detailed previews

---

### ⚙️ Challenges & Solutions

#### 1. 🗓️ Multi-day Events

Handling events that span several days required special logic:

- **ListView**: Events appear on all days they span, not just the starting date.
- **EventListSidebar**: An event shows up if the selected day is within the event's date range.

#### 2. 👥 Assignee Data from Related Tables

The `appointment_assignee` table lacks full user details:

- An additional fetch was made to the `relatives` table
- Data is matched via `user_type` and `user`
- Name is composed on the frontend using title, first name, and last name

#### 3. 🧩 Typing and Data Structure

TypeScript types were adapted based on the Supabase schema:

- `appointment_assignee` has a **many-to-one** relation to `appointments`
- All nullable and array-based fields were handled properly

---

### 🛠️ Creating & Editing Appointments

A **dialog** is used to create or edit appointments:

- **Create**: Top-right button
- **Edit**: Via HoverCard or DetailCard bottom-right action

Since test users cannot write to the database, the save button is currently disabled. The `EventForm` is designed to be **reusable**, with `onSubmit` logic passed via props.
