include .env
export

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose build

logs:
	docker-compose logs -f

setup:
	@echo "🚀 Installation de la base de données..."
	@docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} < sql/01_schema.sql
	@docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} < sql/02_users.sql
	@docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} events_db < sql/03_drop.sql 2>/dev/null || true
	@docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} events_db < sql/04_procedures.sql
	@echo "✅ Installation terminée!"

update:
	@echo "🔄 Mise à jour des procédures..."
	@docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} events_db < sql/03_drop.sql
	@docker-compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} events_db < sql/04_procedures.sql
	@echo "✅ Mise à jour terminée!"

restart:
	docker-compose restart