USE events_db;

-- Supprimer toutes les procédures et fonctions
DROP PROCEDURE IF EXISTS create_events;
DROP PROCEDURE IF EXISTS create_attendee;
DROP PROCEDURE IF EXISTS delete_attendee;
DROP PROCEDURE IF EXISTS remove_attendee;
DROP PROCEDURE IF EXISTS delete_event;
DROP PROCEDURE IF EXISTS update_date;
DROP PROCEDURE IF EXISTS update_event_dates;
DROP FUNCTION IF EXISTS is_full;
DROP PROCEDURE IF EXISTS delete_attendees;