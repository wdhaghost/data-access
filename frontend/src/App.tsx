import "./App.css";
import { EventCardsList } from "./components/events/EventCardsList";
import { useEffect, useState } from "react";
import { formatEvents, type FormattedEvent, type ApiEvent } from "./services/formatEvents";
import { fetchApi } from "./lib/utils";

function App() {
  const [events, setEvents] = useState<FormattedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const { data, error: apiError } = await fetchApi<ApiEvent[]>("/events");

        if (apiError) {
          setError(apiError);
          return;
        }

        if (data) {
          const formattedEvents = formatEvents(data);
          setEvents(formattedEvents);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 flex flex-col px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Événements</h1>
        <div className="flex-1 w-full">
          <EventCardsList events={events} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
}

export default App;
