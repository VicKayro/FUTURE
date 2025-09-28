# FUTURE

FUTURE veut mettre **l’analyse prédictive dans les mains de tous**.

Le projet est encore un **prototype / brouillon** : certaines parties sont en cours de construction, et les prédictions actuelles reposent surtout sur des approches simples ou génératives. L’objectif est de rendre l'analyse prédictive accessible à des normies.

---

## Fonctionnalités actuelles

* Import de fichiers **CSV/XLSX**
* Posez une **question en langage naturel** (ex: *“Quelle sera l’évolution dans 3 mois ?”*).
* Obtenez une **analyse automatique** (textuelle ou chiffrée).
* Historique de vos prédictions dans votre espace.

---

## Technologies utilisées

* **React + Vite + TypeScript** (frontend)
* **Supabase** (authentification, base de données, stockage)
* **TailwindCSS + shadcn/ui** (design)

---

## Installation locale

1. Cloner le projet

   ```bash
   git clone <URL_DU_REPO>
   cd predict-your-way
   ```

2. Installer les dépendances

   ```bash
   npm install
   ```

3. Créer un fichier `.env` à la racine avec :

   ```bash
   VITE_SUPABASE_URL=<ton_url_supabase>
   VITE_SUPABASE_ANON_KEY=<ta_clef_anon_supabase>
   ```

4. Lancer le serveur de dev

   ```bash
   npm run dev
   ```

---

## Sécurité & RGPD

* Les fichiers sont stockés **en privé** dans Supabase.
* Seules des **métadonnées** (nom, chemin, taille) sont conservées en base.
* Chaque utilisateur n’accède qu’à **ses propres prédictions**.

---

## Déploiement

* **Frontend** : [Vercel](https://vercel.com/)
* **Backend / Edge Functions** : [Supabase](https://supabase.com/)

---

## Statut du projet

Ce projet est encore **expérimental**.
Certaines parties sont incomplètes, et la logique de prédiction sera amenée à évoluer (d’abord via ChatGPT, puis via modèles statistiques et ML).

---

## Licence

Projet privé — usage interne uniquement (à adapter selon besoin).
