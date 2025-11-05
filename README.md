🎱 Biljarttafel – JavaScript Canvas Game

Een compacte, browsergebaseerde biljartsimulatie gebouwd met HTML5 Canvas, Vanilla JavaScript en CSS. Richt met de muis, bepaal je stootkracht en speel de gekleurde ballen in de pockets.

## 🚀 Functionaliteiten

- **Realistische fysica**: botsingen, wrijving en stuiteren tussen ballen.
- **Mikken & krachtopbouw**: hoe verder je uithaalt, hoe sterker de stoot.
- **Visuele keu**: dynamische weergave tijdens het mikken met power-indicator.
- **Pocketsysteem**: ballen verdwijnen wanneer ze een pocket raken.
- **Start/Stop**: pauzeer of hervat de simulatie (knop kleurt rood bij actief).
- **Opslaan/Laden**: bewaar en herstel de huidige spelstand via `localStorage`.
- **Instructiepaneel**: klapt automatisch kort open bij het laden.
- **Pool-thema**: groene tafel, houten rand, goudkleurige knoppen met schaduw.
- **Volledig responsive**: werkt perfect op desktop, tablet en mobiel.
- **Touch-ondersteuning**: volledige touch controls voor mobiele apparaten.
- **Responsive canvas**: automatische aanpassing aan schermgrootte en oriëntatie.

## 🕹️ Besturing

### Desktop
- **Muis bewegen**: richten op de witte bal.
- **Muis ingedrukt houden**: kracht opbouwen.
- **Muis loslaten**: stoten.

### Mobiel
- **Vinger bewegen**: richten op de witte bal.
- **Vinger ingedrukt houden**: kracht opbouwen.
- **Vinger loslaten**: stoten.

### Algemeen
- **Start/Stop**: pauzeren of hervatten.
- **Save/Load**: huidige spelstand opslaan of laden.

## 📦 Installatie & Gebruik

Omdat `index.html` absolute paden gebruikt (zoals `/javascript.js`), is een lokale webserver aanbevolen.

1) Met Node.js (aanbevolen):

```bash
npx serve -l 5173 .
```

Open vervolgens in de browser: `http://localhost:5173`

2) Zonder Node.js (Python 3):

```bash
python -m http.server 5173
```

Open vervolgens in de browser: `http://localhost:5173`

> Tip: Start de server vanuit de projectmap met `index.html`.

## 🗂️ Projectstructuur

```
biljarttafel/
├─ index.html         # Canvas, UI-knoppen en instructiepaneel
├─ style.css          # Pool-thema styling
├─ javascript.js      # Spel- en fysica-logica
└─ foto/
   └─ Biljarttafel.png
```

## 🔧 Ontwikkeling

- De spelupdate draait via `setInterval(drawCanvas, 10)` (~100 FPS).
- Ballen worden geïnitialiseerd in `initBalls()` en getekend in `drawCanvas()`.
- Muisinteractie (mik- en schietlogica) zit in de `mousedown`, `mousemove` en `mouseup` handlers.
- Spelstatus kan bewaard worden via `saveData()` en geladen met `loadData()`.

### Vereisten

- Moderne browser met ondersteuning voor HTML5 Canvas en `localStorage`.
- Optioneel: Node.js of Python voor het draaien van een lokale server.

## 🌐 Browserondersteuning

Getest op recente versies van Chrome, Edge, Firefox en Safari. Andere moderne browsers zouden moeten werken. Volledige ondersteuning voor touch events op mobiele browsers.

## 🔮 Toekomstige Features

Dit project is nog in actieve ontwikkeling. De volgende functies zijn gepland voor toekomstige versies:

### Multiplayer Functionaliteit
- **Lokale multiplayer**: speel met meerdere spelers op hetzelfde scherm.
- **Online multiplayer**: speel tegen andere spelers via internet.
- **Beurtsysteem**: duidelijke weergave van welke speler aan de beurt is.
- **Spelerprofielen**: bewaar je statistieken en voortgang.

### Gameplay Verbeteringen
- **Scorebord**: bijhouden van punten en scores per speler.
- **Spelregels**: implementatie van verschillende biljartspelregels (8-ball, 9-ball, etc.).
- **Geluidseffecten**: realistische geluiden bij stoten, botsingen en pockets.
- **Visual effects**: verbeterde visuele feedback bij stoten en botsingen.
- **Replay-systeem**: bekijk je laatste stoten terug.

### Technische Verbeteringen
- **Betere fysica-engine**: nog realistischere balbewegingen en botsingen.
- **Animatie-verbeteringen**: vloeiendere animaties en transitions.
- **Performance optimalisaties**: betere prestaties op oudere apparaten.
- **Accessibility**: verbeterde toegankelijkheid voor gebruikers met beperkingen.

### UI/UX Verbeteringen
- **Themes**: verschillende tafelthema's en kleurenschema's.
- **Customisatie**: aanpasbare ballen, tafel en knoppen.
- **Tutorial-modus**: interactieve tutorial voor nieuwe spelers.
- **Statistieken dashboard**: gedetailleerde statistieken over je prestaties.

### Mobiele Features
- **Verbeterde touch controls**: nog betere touch-ervaring met haptic feedback.
- **Offline modus**: speel zonder internetverbinding.
- **App-versie**: native app-versies voor iOS en Android.

> **Opmerking**: Deze features zijn gepland en kunnen in de toekomst worden toegevoegd. De prioriteit en volgorde kunnen wijzigen op basis van feedback en beschikbare ontwikkeltijd.

## 🤝 Bijdragen

Verbeteringen, bugfixes of ideeën zijn welkom. Maak gerust een fork en dien een pull request in. Als je ideeën hebt voor toekomstige features, open dan een issue op GitHub.

## 🎨 Credits

- Het logo (`foto/Biljarttafel.png`) is zelf ontworpen voor dit project.

## 📜 Licentie

Dit project is open-source en beschikbaar onder de **MIT License**.
