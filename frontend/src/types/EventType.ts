export type EventType = {
    eventId: number;
    name: string;
    startDate: Date;
    endDate: Date;
    maxAttendees: number | null;
    location: string;
    createdAt?: string;
    updatedAt?: string;
};