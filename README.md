# ScreenFind — Installatiehandleiding

## Inhoudsopgave

1. [Inleiding](#1-inleiding)
2. [Screenshot](#2-screenshot)
3. [Benodigdheden](#3-benodigdheden)
4. [De applicatie draaien](#4-de-applicatie-draaien)
5. [Overige commando’s](#5-overige-commando)
6. [Testgebruikers](#6-testgebruikers)

---

## 1. Inleiding

**ScreenFind** is een React-frontend waarin je films, series en personen kunt zoeken (TMDB), detailpagina’s kunt bekijken, en — na registratie/inloggen via de NOVI Dynamic API — een persoonlijke watchlist kunt beheren.

Belangrijkste functionaliteiten:

- Registreren en inloggen (NOVI)
- Zoeken en filteren op mediatype (TMDB)
- Detailpagina’s via dynamic routes
- Watchlist toevoegen / status wijzigen / verwijderen (private route)

---

## 2. Screenshot

Plaats een screenshot van de Search- of Watchlist-pagina in `docs/screenshots/app.png` en toon die hier in de PDF/README-export:

![ScreenFind screenshot](docs/screenshots/app.png)

*(Als de afbeelding ontbreekt: start de app, maak zelf een screenshot en sla hem op onder dat pad.)*

---

## 3. Benodigdheden

| Techniek | Doel |
|---|---|
| Node.js (LTS) + npm | Dependencies installeren en scripts draaien |
| React 19 + Vite | Frontend framework / bundler |
| React Router DOM | Routing, dynamic & private routes |
| jwt-decode | JWT uitlezen na login |
| TMDB API | Zoeken en details |
| NOVI Dynamic API | Auth + watchlist-collectie |

Geen Bootstrap, Material UI of Tailwind.

---

## 4. De applicatie draaien

### Stap 1 — Project ophalen

```bash
git clone <jouw-github-repo-url>
cd testSuite
```

Of pak de aangeleverde ZIP uit en open de projectmap.

### Stap 2 — Dependencies

```bash
npm install
```

### Stap 3 — NOVI database uploaden

1. Ga naar https://novi-backend-api-wgsgz.ondigitalocean.app/
2. Registreer met je NOVI-studentmail en bewaar je **Project ID**
3. Upload het configuratiebestand [`novi/screenfind-init.json`](novi/screenfind-init.json)

### Stap 4 — Omgevingsvariabelen

Kopieer `.env.example` naar `.env` (in de ZIP/levering staat al een werkende `.env` met keys voor de nakijker):

```bash
cp .env.example .env
```

Vul in:

```env
VITE_TMDB_ACCESS_TOKEN=...jouw_tmdb_key_of_token...
VITE_NOVI_BASE_URL=https://novi-backend-api-wgsgz.ondigitalocean.app/api
VITE_NOVI_PROJECT_ID=...jouw_project_id...
```

> De nakijkende docent hoeft **geen** eigen API-keys aan te maken; keys/project-id worden meegeleverd.

### Stap 5 — Starten

```bash
npm run dev
```

Open de URL die Vite toont (standaard http://localhost:5173).  
De NOVI API vereist dat de frontend op poort **5173** of **3000** draait (CORS).

---

## 5. Overige commando’s

| Commando | Functie |
|---|---|
| `npm run dev` | Development server met hot reload |
| `npm run build` | Productiebuild naar `dist/` |
| `npm run preview` | Preview van de productiebuild |
| `npm run lint` | ESLint over het project |

---

## 6. Testgebruikers

Na upload van `novi/screenfind-init.json`:

| E-mail | Wachtwoord | Rol |
|---|---|---|
| `demo@screenfind.nl` | `demo123` | user |
| `admin@screenfind.nl` | `admin123` | admin |

De demo-user heeft al twee voorbeeld-watchlistitems.  
Let op: de NOVI Dynamic API leegt data periodiek; upload het JSON-bestand opnieuw indien nodig.
