import { EventCard } from './EventCard';
import { Spinner } from '@/components/ui/spinner';
import {Card, CardDescription} from "@/components/ui/card.tsx";

interface Event {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  max_attendees: number;
  location: string;
  createdAt: string;
  updatedAt?: string;
}

interface EventCardsListProps {
  events: Event[];
  isLoading?: boolean;
  error?: string | null;
}

export function EventCardsList({ events, isLoading, error }: EventCardsListProps) {
  if (isLoading) {
    return (
      <Card>
        <Spinner />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardDescription className="text-destructive">Erreur: {error}</CardDescription>
      </Card>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card className="flex items-center justify-center p-8">
        <CardDescription className="text-muted-foreground">Aucun évènement disponible</CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}