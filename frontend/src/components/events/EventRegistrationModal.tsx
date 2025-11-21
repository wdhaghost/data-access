import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type EventRegistrationModalProps = {
  name: string;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  successMessage: string;
  errorMessage: string;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  isLoading: boolean;
  handleAddAttendeeToEvent: () => void;
  setErrorMessage: (msg: string) => void;
  setSuccessMessage: (msg: string) => void;
};

export default function EventRegistrationModal({
  name,
  showForm,
  setShowForm,
  successMessage,
  errorMessage,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  isLoading,
  handleAddAttendeeToEvent,
  setErrorMessage,
  setSuccessMessage,
}: EventRegistrationModalProps) {
  return (
    <Dialog open={showForm} onOpenChange={setShowForm}>
      <DialogTrigger asChild>
        <Button className="w-full">Participer à l'évènement</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>S'inscrire à l'évènement</DialogTitle>
          <DialogDescription>
            Veuillez entrer vos informations pour vous inscrire à "{name}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {successMessage && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              placeholder="Votre prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              placeholder="Votre nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowForm(false);
              setErrorMessage("");
              setSuccessMessage("");
              setFirstName("");
              setLastName("");
            }}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleAddAttendeeToEvent}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "S'inscrire"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
