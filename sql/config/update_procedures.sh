#!/bin/bash

echo "=== Suppression des anciennes procédures ==="
mysql --defaults-extra-file=mysql.cnf < ../03_drop.sql

echo "=== Installation des nouvelles procédures ==="
mysql --defaults-extra-file=mysql.cnf < ../04_procedures.sql

echo "✅ Mise à jour terminée!"
