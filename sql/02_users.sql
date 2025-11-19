USE events_db;

CREATE USER IF NOT EXISTS 'johndoe'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT, EXECUTE ON events_db.* TO 'johndoe'@'localhost';
FLUSH PRIVILEGES;
