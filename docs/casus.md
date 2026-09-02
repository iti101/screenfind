# Casus — ScreenFind (max. 250 woorden)

**Student:** [vul naam in]  
**Datum:** [vul inleverdatum in]  
**Leerlijn:** Frontend

---

Mensen verzamelen films en series op meerdere apps, notities en chatberichten. Daardoor is het moeilijk om snel iets terug te vinden, te onthouden wat je nog wilt kijken, of details te raadplegen zonder heen-en-weer te schakelen. ScreenFind lost dit op met één overzichtelijke frontend: zoeken in een betrouwbare film-/serie-database, details bekijken, en een persoonlijke watchlist beheren na inloggen.

Ik gebruik de **publieke TMDB API** voor zoeken en detailinformatie over films, series en personen  
(documentatie: https://developer.themoviedb.org/docs).  
Voor **registreren, inloggen** en de **persoonlijke watchlist** gebruik ik de **NOVI Dynamic API**. In die database sla ik onder andere op:

- **users** — accounts met e-mail, wachtwoord en rollen  
- **watchlistItems** — opgeslagen titel (TMDB-id, mediatype, titel, posterpad, status, gebruikers-id)

### Vier kernfunctionaliteiten

1. **Registreren en inloggen** — Als gebruiker wil ik een account aanmaken en inloggen, zodat mijn watchlist privé blijft.  
2. **Zoeken en filteren** — Als bezoeker wil ik films, series en personen doorzoeken (en op type filteren), zodat ik snel relevante resultaten vind.  
3. **Watchlist beheren** — Als ingelogde gebruiker wil ik items toevoegen, status wijzigen en verwijderen, zodat ik bijhoud wat ik nog wil kijken.  
4. **Detailpagina’s** — Als gebruiker wil ik een detailpagina met synopsis, metadata en (indien ingelogd) watchlist-acties zien, zodat ik een weloverwogen keuze maak.

**Actie voor de student:** lever deze casus in bij de docent ter goedkeuring vóór je verdergaat met Deelopdracht 1.
