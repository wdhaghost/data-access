USE events_db;

-- Supprimer toutes les procédures et fonctions
DROP PROCEDURE IF EXISTS create_events;
DROP PROCEDURE IF EXISTS add_attendee;
DROP PROCEDURE IF EXISTS delete_attendee;
DROP PROCEDURE IF EXISTS delete_event;
DROP PROCEDURE IF EXISTS update_date;
DROP FUNCTION IF EXISTS is_full;
