CREATE DATABASE IF NOT EXISTS events_db;

USE events_db;

CREATE TABLE IF NOT EXISTS event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_attendees INT NOT NULL,
    location VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS attendee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES event (id) ON DELETE CASCADE
);

--Utilisateurs
CREATE USER 'johndoe' @ 'localhost' IDENTIFIED BY 'password';

GRANT SELECT, CALL ON events_db.* TO 'johndoe' @ 'localhost';

FLUSH PRIVILEGES;

--PROCEDURES
--1 Créer un évènement
DELIMITER //

CREATE PROCEDURE create_events(new_name CHAR(50), new_start_date DATE, new_end_date DATE, new_location VARCHAR(100), new_max_attendees INT)
    BEGIN
        INSERT INTO event(name, start_date, end_date, max_attendees, location) 
        VALUES (new_name, new_start_date, new_end_date, new_max_attendees, new_location);
    END//

DELIMITER ;

--2 Inscription à un évènement (échec si max pers)
DELIMITER //

CREATE FUNCTION is_full(actual_attendees INT, limit_attendees INT)
    RETURNS VARCHAR(50)
    DETERMINISTIC
    BEGIN
        RETURN actual_attendees < limit_attendees
    END//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE add_attendee(event_id INT, fn VARCHAR(30),ln VARCHAR(30))
    BEGIN

    DECLARE limit_attendees INT;
    DECLARE actual_attendees INT;

    SELECT max_attendees INTO limit_attendees FROM event WHERE id = event_id;
    SELECT COUNT(*) INTO actual_attendees FROM attendee WHERE event_id = event_id;

    IF NOT is_full(actual_attendees, limit_attendees) THEN
        INSERT into attendee VALUES (event_id,fn,ln);
        SET MESSAGE_TEXT = "Il y a encore des places";
    ELSE
        SET MESSAGE_TEXT = "Evènement plein";
    END IF
    END//

DELIMITER ;

--3 Désinscription avec nom prénom
DELIMITER //

CREATE PROCEDURE delete_attendee(event_id INT, fn VARCHAR(30),ln VARCHAR(30))
    BEGIN
        DELETE FROM attendee 
        WHERE first_name = fn
            AND last_name = ln 
            AND event_id = event_id 
        LIMIT 1 ; 
    END//

DELIMITER ;

--4 Suppr un évènement avec toutes les inscriptions
DELIMITER //

CREATE PROCEDURE delete_event(event_id INT)
    BEGIN
        DELETE FROM event 
        WHERE id = event_id 
        LIMIT 1 ; 
    END//

DELIMITER ;

DELIMITER //

CREATE TRIGGER 'delete_attendees' AFTER DELETE ON 'event'
    FOR EACH ROW
    BEGIN
        DELETE FROM attendee 
        WHERE event_id = OLD.id;
    END//
DELIMITER ;

--5 changer la date de début et de fin
DELIMITER //

CREATE PROCEDURE update_date(event_id INT,new_start_date DATE ,new_end_date DATE)
    BEGIN
        UPDATE event 
        SET start_date = new_start_date, end_date = new_end_date 
        WHERE id = event_id;
    END//

DELIMITER ;