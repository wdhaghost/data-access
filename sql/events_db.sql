CREATE DATABASE IF NOT EXISTS events_db;

USE events_db;

CREATE TABLE event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_attendees INT NOT NULL,
    location VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    updated_at TIMESTAMP NULL
)

CREATE TABLE attendee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE
);

--PROCEDURES
--1 Créer un évènement
DELIMITER //;
CREATE PROCEDURE create_events(name CHAR(50),start_date DATE,end_date DATE,location VARCHAR(100),max_attendees INT)
    BEGIN
        INSERT into event VALUES (name,start_date,end_date,max_attendees,location);
    END //
DELIMITER ;
--2 Inscription à un évènement (échec si max pers)
DELIMITER //;
CREATE PROCEDURE add_attendee(event_id INT, fn VARCHAR(30),ln VARCHAR(30))
    BEGIN
        INSERT into attendee VALUES (event_id,)
    END
DELIMITER ;
--3 Désinscription avec nom prénom

--4 Suppr un évènement avec toutes les inscriptions

--5 changer la date de début et de fin

DELIMITER ;