#!/bin/bash

echo "=== Création de la base de données et des tables ==="
mysql --defaults-extra-file=mysql.cnf < ../01_schema.sql

echo "=== Création des utilisateurs ==="
mysql --defaults-extra-file=mysql.cnf < ../02_users.sql

echo "=== Installation des procédures et fonctions ==="
mysql --defaults-extra-file=mysql.cnf < ../04_procedures.sql

echo "✅ Installation complète terminée!"