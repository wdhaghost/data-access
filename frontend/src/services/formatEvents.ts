interface ApiEvent {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  max_attendees: number;
  location: string;
  created_at: string;
  updated_at?: string;
}

interface FormattedEvent {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  max_attendees: number;
  location: string;
  createdAt: string;
  updatedAt?: string;
}

export const formatEvents = (data: ApiEvent[]): FormattedEvent[] => {
  return data.map((event) => ({
    id: event.id,
    name: event.name,
    startDate: event.start_date,
    endDate: event.end_date,
    max_attendees: event.max_attendees,
    location: event.location,
    createdAt: event.created_at,
    updatedAt: event.updated_at,
  }));
};

export type { ApiEvent, FormattedEvent };
