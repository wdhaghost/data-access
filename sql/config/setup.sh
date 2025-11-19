#!/bin/bash

echo "=== Création de la base de données et des tables ==="
mysql -u root -p < 01_schema.sql

echo "=== Création des utilisateurs ==="
mysql -u root -p < 02_users.sql

echo "=== Installation des procédures et fonctions ==="
mysql -u root -p < 04_procedures.sql

echo "✅ Installation complète terminée!"