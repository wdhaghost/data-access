import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import type { EventType } from "@/types/EventType";
import EventRegistrationModal from "./EventRegistrationModal";
import { formatDate } from "@/services/formatDate";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function EventCard({
  eventId,
  name,
  startDate,
  endDate,
  maxAttendees,
  location,
}: EventType) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleAddAttendeeToEvent = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("Veuillez remplir tous les champs");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch(`${API_URL}/events/${eventId}/attendees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Erreur lors de l'inscription");
      } else {
        setSuccessMessage(data.message || "Inscription réussie !");
        setFirstName("");
        setLastName("");
        setShowForm(false);
      }
    } catch (error: unknown) {
      setErrorMessage("Erreur de connexion au serveur");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-linear-to-br from-white to-blue-50/30">
      <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-blue-500 to-blue-600" />

      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-xl font-bold text-gray-900">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 pb-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate">{formatDate(startDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate">{formatDate(endDate)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        {maxAttendees && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-gray-600">
              <span className="font-semibold text-blue-600">{maxAttendees}</span> participants max
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 bg-linear-to-r from-gray-50 to-blue-50/50 border-t pt-3 pb-3">
        <EventRegistrationModal
          name={name}
          showForm={showForm}
          setShowForm={setShowForm}
          successMessage={successMessage}
          errorMessage={errorMessage}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          isLoading={isLoading}
          handleAddAttendeeToEvent={handleAddAttendeeToEvent}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
        />
      </CardFooter>
    </Card>
  );
}
