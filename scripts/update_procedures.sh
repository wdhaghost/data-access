#!/bin/bash

# Charger les variables d'environnement
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
else
    echo "❌ Fichier .env introuvable"
    exit 1
fi

echo "🔄 Mise à jour des procédures..."

# Vérifier que le container MySQL est en cours d'exécution
if ! docker-compose ps mysql | grep -q "Up"; then
    echo "❌ Le container MySQL n'est pas démarré"
    echo "Démarrez-le avec : docker-compose up -d mysql"
    exit 1
fi

echo "=== Suppression des anciennes procédures ==="
docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} events_db < ../sql/03_drop.sql

if [ $? -eq 0 ]; then
    echo "✅ Anciennes procédures supprimées"
else
    echo "❌ Erreur lors de la suppression"
    exit 1
fi

echo "=== Installation des nouvelles procédures ==="
docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} events_db < ../sql/04_procedures.sql

if [ $? -eq 0 ]; then
    echo "✅ Nouvelles procédures installées"
else
    echo "❌ Erreur lors de l'installation"
    exit 1
fi

echo ""
echo "✅ Mise à jour terminée!"