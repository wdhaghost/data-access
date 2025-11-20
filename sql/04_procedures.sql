USE events_db;

DELIMITER //

CREATE PROCEDURE create_events(new_name CHAR(50), new_start_date DATE, new_end_date DATE, new_location VARCHAR(100), new_max_attendees INT)
    BEGIN
        DECLARE EXIT HANDLER FOR 1062
            BEGIN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'L\'evenement existe deja';
            END;

        IF new_end_date < new_start_date THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'La date de fin doit etre posterieure a la date de debut';
        END IF;

        INSERT INTO event(name, start_date, end_date, max_attendees, location) 
        VALUES (new_name, new_start_date, new_end_date, new_max_attendees, new_location);
    END//

-- 2 Inscription à un évènement (échec si max pers)
CREATE FUNCTION is_full(actual_attendees INT, limit_attendees INT)
    RETURNS BOOLEAN
    DETERMINISTIC
    BEGIN
        RETURN actual_attendees >= limit_attendees;
    END//

CREATE PROCEDURE create_attendee(p_event_id INT, fn VARCHAR(30), ln VARCHAR(30))
    BEGIN
        DECLARE limit_attendees INT;
        DECLARE actual_attendees INT;

        DECLARE EXIT HANDLER FOR 1062
        BEGIN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Le participant est deja inscrit a cet evenement';
        END;

        SELECT max_attendees
        INTO limit_attendees
        FROM event
        WHERE id = p_event_id;

        SELECT COUNT(*)
        INTO actual_attendees
        FROM attendee
        WHERE attendee.event_id = p_event_id;

        IF NOT is_full(actual_attendees, limit_attendees) THEN
            INSERT INTO attendee(event_id, first_name, last_name) VALUES (p_event_id, fn, ln);
            SELECT 'Inscription reussie' AS message;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'L\'evenement est plein';
        END IF;
    END//

-- 3 Désinscription avec nom prénom
CREATE PROCEDURE delete_attendee(p_event_id INT, fn VARCHAR(30),ln VARCHAR(30))
    BEGIN
        DECLARE attendee_exists INT;

        SELECT COUNT(*) INTO attendee_exists
        FROM attendee
        WHERE first_name = fn
            AND last_name = ln
            AND event_id = p_event_id;

        IF attendee_exists > 0 THEN
            DELETE FROM attendee
            WHERE first_name = fn
                AND last_name = ln
                AND event_id = p_event_id
            LIMIT 1 ;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Participant non trouve pour cet evenement';
        END IF;
    END//

-- 4 Suppr un évènement avec toutes les inscriptions
CREATE PROCEDURE delete_event(event_id INT)
    BEGIN
        DECLARE event_exists INT;

        SELECT COUNT(*)
        INTO event_exists
        FROM event
        WHERE id = event_id;

        IF event_exists = 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Evenement introuvable';
        END IF;

        DELETE FROM event 
        WHERE id = event_id 
        LIMIT 1 ; 
    END//

-- 5 changer la date de début et de fin
CREATE PROCEDURE update_date(event_id INT,new_start_date DATE ,new_end_date DATE)
    BEGIN
        IF new_end_date < new_start_date THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'La date de fin doit etre posterieure à la date de debut';
        END IF;

        UPDATE event 
        SET start_date = new_start_date,
            end_date = new_end_date
        WHERE id = event_id;

        IF ROW_COUNT() = 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Evenement introuvable';
        END IF;
    END//

DELIMITER ;
