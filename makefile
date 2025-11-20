include .env
export

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f

setup:
	@echo "🚀 Installation de la base de données..."
	@docker compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} < sql/01_schema.sql
	@docker compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} < sql/02_users.sql
	@docker compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} events_db < sql/03_drop.sql 2>/dev/null || true
	@docker compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} events_db < sql/04_procedures.sql
	@echo "✅ Installation terminée!"

update:
	@echo "🔄 Mise à jour des procédures..."
	@docker compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} events_db < sql/03_drop.sql
	@docker compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} events_db < sql/04_procedures.sql
	@echo "✅ Mise à jour terminée!"

restart:
	docker-compose restart

mysql:
	@docker compose exec mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} events_db
	
# ====== NODE ====== #
backend: 
	@docker compose exec node sh

node-install:
	@docker compose exec node npm install

node-logs:
	@docker compose logs -f node

# ====== MONGODB ====== #
mongo:
	@docker compose exec mongodb mongosh "mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@localhost:27017/events_db?authSource=admin"

seed-mongo:
	@if [ -z "$(file)" ]; then \
		echo "❌ Erreur: Vous devez spécifier un fichier. Exemple: make seed-mongo file=disisfine.json"; \
		exit 1; \
	fi
	@echo "🌱 Chargement des données dans MongoDB..."
	@docker compose exec node node seedMongodb.js /app/json/$(file)
	@echo "✅ Seed terminé!"

seed-disisfine:
	@echo "🌱 Chargement de disisfine.json dans MongoDB..."
	@docker compose exec node node seedMongodb.js /app/json/disisfine.json disisfine

seed-liveticket:
	@echo "🌱 Chargement de liveticket.json dans MongoDB..."
	@docker compose exec node node seedMongodb.js /app/json/liveticket.json liveticket

seed-truegister:
	@echo "🌱 Chargement de truegister.json dans MongoDB..."
	@docker compose exec node node seedMongodb.js /app/json/truegister.json truegister

# ====== MySQL ====== #
mysql:
	@docker compose exec mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} events_db
	
seed-mysql:
	@echo "🔄 Migration MongoDB → MySQL..."
	@docker compose exec node node seedMysql.js
	@echo "✅ Migration terminée!"