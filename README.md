# PROJET Accès aux données 21/11/2025

## Equipe 
- AUGE Gauthier
- GONIN Mahery
- HAMZA Hicham
- COULIBALY Abdourahmane

## Introduction

Cet environnement fournit une stack complète pour le développement :

- **Backend** : Node.js / Express
- **Frontend** : React (Vite)
- **Base SQL** : MySQL
- **Base NoSQL** : MongoDB
- **Automatisation** : Makefile

L’objectif : disposer d’une architecture claire, stable et reproductible pour coder sereinement.

---

## Structure du projet

- projet/
  - .env — Variables d'environnement
  - docker-compose.yml
  - Makefile — Scripts d’automatisation

  - frontend/ — Frontend React + Vite

  - backend/ — Backend Node.js / Express
    - server.js — Point d'entrée du serveur
    - seedMongodb.js — Import JSON → MongoDB
    - seedMysql.js — Migration MongoDB → MySQL

  - sql/ — Scripts SQL
    - 01_schema.sql
    - 02_users.sql
    - 03_drop.sql
    - 04_procedures.sql

---

## Scripts Makefile

### Gestion Docker

| Commande | Description |
|---------|-------------|
| `make up` | Démarre les services en mode détaché |
| `make down` | Stoppe et supprime les conteneurs |
| `make build` | Reconstruit les images Docker |
| `make logs` | Affiche les logs en continu |
| `make restart` | Redémarre tous les services |

---

### Gestion MySQL

| Commande | Description |
|---------|-------------|
| `make mysql` | Ouvre le client MySQL dans le conteneur |
| `make setup` | Initialise la base (schema, users, procédures) |
| `make update` | Met à jour uniquement les procédures |
| `make drop-db` | Supprime la base `events_db` |

Scripts associés :  
`01_schema.sql`, `02_users.sql`, `03_drop.sql`, `04_procedures.sql`

---

### Gestion MongoDB

| Commande | Description |
|---------|-------------|
| `make mongo` | Ouvre un shell MongoDB |
| `make seed-mongo file=X.json` | Import d’un fichier JSON |
| `make seed-disisfine` | Charge `disisfine.json` |
| `make seed-liveticket` | Charge `liveticket.json` |
| `make seed-truegister` | Charge `truegister.json` |

Scripts utilisés : `backend/seedMongodb.js`

---

### Migration MongoDB → MySQL

| Commande | Description |
|---------|-------------|
| `make seed-mysql` | Exécute `seedMysql.js` pour transférer les données |

---

## Initialisation du projet

1. Lancer les services Docker :

    ```bash
    make up
    ```
2. Initialiser la base MySQL :

    ```bash
    make setup
    ```
3. Importer les données JSON dans MongoDB (exemple avec `disisfine.json`) :
    ```bash
    make seed-disisfine
    ```
4. Migrer les données de MongoDB vers MySQL : 

    ```bash
    make seed-mysql
    ```
5.  Lancer le frontend React :
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

