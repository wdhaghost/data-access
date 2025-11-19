# Event Management Database

Système de gestion d'événements avec inscriptions.

## 📁 Structure du projet
```
project/
├ config
├ ├── setup.sh               # Installation initiale complète
├ ├── update_procedures.sh   # Mise à jour des procédures uniquement
├── 01_schema.sql          # Création de la base de données et des tables
├── 02_users.sql           # Création des utilisateurs MySQL
├── 03_drop.sql            # Suppression des procédures/fonctions
├── 04_procedures.sql      # Procédures stockées et fonctions
└── README.md              # Ce fichier
```

## 🚀 Installation initiale

**Première utilisation :**
```bash
# 1. Rendre les scripts exécutables
chmod +x setup.sh update_procedures.sh

# 2. Lancer l'installation complète
./setup.sh
```

Le script `setup.sh` va :
- Créer la base de données `events_db`
- Créer les tables `event` et `attendee`
- Créer l'utilisateur `johndoe` avec les permissions
- Installer toutes les procédures et fonctions

**Mot de passe MySQL :** Le script vous demandera le mot de passe root MySQL.

## 🔄 Mise à jour des procédures

Quand vous modifiez les procédures dans `04_procedures.sql` :
```bash
./update_procedures.sh
```

Ce script va :
- Supprimer les anciennes procédures/fonctions
- Installer les nouvelles versions

## 📝 Procédures disponibles

### 1. Créer un événement
```sql
CALL create_events('Concert Rock', '2025-12-01', '2025-12-01', 'Paris', 100);
```

### 2. Inscrire un participant
```sql
CALL add_attendee(1, 'Marie', 'Dupont');
```

### 3. Désinscrire un participant
```sql
CALL delete_attendee(1, 'Marie', 'Dupont');
```

### 4. Supprimer un événement
```sql
CALL delete_event(1);
```

### 5. Modifier les dates d'un événement
```sql
CALL update_date(1, '2025-12-15', '2025-12-16');
```

## 🧪 Tests
```sql
-- Se connecter à MySQL
mysql -u root -p

-- Utiliser la base de données
USE events_db;

-- Créer un événement de test
CALL create_events('Test Event', '2025-12-01', '2025-12-01', 'Lyon', 2);

-- Ajouter des participants
CALL add_attendee(1, 'Jean', 'Martin');
CALL add_attendee(1, 'Marie', 'Durand');

-- Essayer d'ajouter un 3ème participant (doit échouer - événement plein)
CALL add_attendee(1, 'Paul', 'Bernard');

-- Vérifier les inscriptions
SELECT * FROM attendee WHERE event_id = 1;
```

## 🗑️ Réinitialisation complète

Si vous voulez tout recommencer :
```sql
-- Dans MySQL
DROP DATABASE events_db;
```

Puis relancer :
```bash
./setup.sh
```

## ⚠️ Troubleshooting

### Erreur : "Permission denied"
```bash
chmod +x setup.sh update_procedures.sh
```

### Erreur : "Procedure already exists"
```bash
# Utiliser update_procedures.sh au lieu de setup.sh
./update_procedures.sh
```

### Erreur : "Access denied for user"
```bash
# Vérifier que vous utilisez le bon mot de passe root MySQL
# Ou modifier les scripts pour utiliser un autre utilisateur
```

### Erreur : "Cannot add or update a child row"
```bash
# Vérifier que l'event_id existe
SELECT * FROM event;
```

## 👤 Utilisateurs

- **root** : Administration complète
- **johndoe** : Lecture seule + Exécution des procédures
  - Mot de passe : `password`

## 🛠️ Commandes utiles
```bash
# Voir tous les événements
mysql -u root -p -e "USE events_db; SELECT * FROM event;"

# Voir tous les participants
mysql -u root -p -e "USE events_db; SELECT * FROM attendee;"

# Voir les procédures installées
mysql -u root -p -e "USE events_db; SHOW PROCEDURE STATUS WHERE Db = 'events_db';"

# Voir les fonctions installées
mysql -u root -p -e "USE events_db; SHOW FUNCTION STATUS WHERE Db = 'events_db';"
```

## 📌 Notes

- Les participants sont automatiquement supprimés quand un événement est supprimé (`ON DELETE CASCADE`)
- La fonction `is_full()` vérifie si un événement a atteint sa capacité maximale
- Tous les horodatages sont gérés automatiquement
