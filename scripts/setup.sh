#!/bin/bash

# Charger les variables d'environnement
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
else
    echo "❌ Fichier .env introuvable"
    exit 1
fi

echo "🚀 Installation complète de la base de données..."

# Vérifier que le container MySQL est démarré
if ! docker-compose ps mysql | grep -q "Up"; then
    echo "⏳ Démarrage du container MySQL..."
    docker-compose up -d mysql
    echo "⏳ Attente de MySQL (30 secondes)..."
    sleep 30
fi

echo "=== Création de la base de données et des tables ==="
docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} < ../sql/01_schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schéma créé"
else
    echo "❌ Erreur lors de la création du schéma"
    exit 1
fi

echo "=== Création des utilisateurs ==="
docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} < ../sql/02_users.sql

if [ $? -eq 0 ]; then
    echo "✅ Utilisateurs créés"
else
    echo "❌ Erreur lors de la création des utilisateurs"
    exit 1
fi

echo "=== Installation des procédures et fonctions ==="
docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} events_db < ../sql/04_procedures.sql

if [ $? -eq 0 ]; then
    echo "✅ Procédures installées"
else
    echo "❌ Erreur lors de l'installation des procédures"
    exit 1
fi

echo ""
echo "✅ Installation complète terminée!"
echo "📊 Vous pouvez maintenant utiliser la base de données events_db"