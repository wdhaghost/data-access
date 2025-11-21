import "./App.css";
import EventCard from "./components/events/EventCard";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Événements</h1>
        <EventCard
          eventId={1}
          name="Conférence Tech 2025"
          startDate={new Date("2025-03-15T09:00:00")}
          endDate={new Date("2025-03-15T17:00:00")}
          maxAttendees={50}
          location="Paris, France"
        />
      </div>
    </div>
  );
}

export default App;
