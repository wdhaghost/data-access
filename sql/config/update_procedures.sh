#!/bin/bash

echo "=== Suppression des anciennes procédures ==="
mysql -u root -p < ../03_drop.sql

echo "=== Installation des nouvelles procédures ==="
mysql -u root -p < ../04_procedures.sql

echo "✅ Mise à jour terminée!"
