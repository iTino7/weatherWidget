# Weather Widget Challenge ☀️🌧️

Widget meteo moderno e responsive sviluppato come parte della **Freedome Front-End Challenge**.

---

## 🚀 Funzionalità

* **Meteo Attuale** – Visualizzazione delle condizioni meteo in tempo reale
* **Previsioni Orarie (prossime 5 ore)** – Previsioni meteo a breve termine
* **Previsioni Giornaliere (prossimi 5 giorni)** – Previsioni aggregate per giorno
* **Navigazione Swipe / Carousel** – Navigazione fluida tra le viste tramite **shadcn/ui Carousel**
* **Design Responsive** – Ottimizzato per mobile, tablet e desktop
* **TypeScript** – Tipizzazione completa delle risposte API
* **Architettura a Componenti** – Struttura modulare, pulita e manutenibile

---

## 🧠 Concetto del Progetto

Il widget è pensato per essere integrato all’interno delle pagine attività di **freedome.it**, mostrando le previsioni meteo della località in cui si svolge l’esperienza.

La località viene passata direttamente al widget come **prop**, senza possibilità di selezione da parte dell’utente.

---

## 🛠️ Stack Tecnologico

* **React**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **OpenWeatherMap API**

---

## 📦 API Utilizzate

I dati meteo sono recuperati tramite le **OpenWeatherMap API**:

* **Meteo attuale** → `/data/2.5/weather`
* **Previsioni 5 giorni / 3 ore** → `/data/2.5/forecast`

I dati delle previsioni vengono elaborati lato client per ottenere:

* Previsioni delle **prossime 5 ore**
* Previsioni **giornaliere per 5 giorni**

---

## ⚙️ Configurazione Ambiente

Crea un file `.env` nella root del progetto e inserisci la tua API key:

```
VITE_API_KEY=xxxxxxx
```

---

## ▶️ Avvio del Progetto

```bash
npm install
npm run dev
```

