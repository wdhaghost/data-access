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
  createdAt,
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
    <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-gray-800">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Date de début</p>
            <p className="text-base text-gray-900">{formatDate(startDate)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Date de fin</p>
            <p className="text-base text-gray-900">{formatDate(endDate)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Lieu</p>
            <p className="text-base text-gray-900">{location}</p>
          </div>
        </div>

        {maxAttendees && (
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">
                Participants maximum
              </p>
              <p className="text-base text-gray-900">{maxAttendees}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-3 bg-gray-50 border-t">
        <div className="flex items-center text-sm text-gray-500 w-full">
          <Calendar className="w-4 h-4 mr-2" />
          Créé le {new Date(createdAt).toLocaleDateString("fr-FR")}
        </div>
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
