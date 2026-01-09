# DOOH AD Manager - Backend 

This project is the backend (server side) of a Digital Out-of-Home (DOOH) advertising system.

This backend decides:

- Which ad plays
- On which screen
- At what time

It also keeps a record of what was actually played.

---

## What this Project does :

This backend allows an operator to:

- Create and manage screens (TVs or digital displays)
- Upload and manage ads (images or videos)
- Create campaigns with a start and end time
- Assign campaigns to screens
- Assign ads to campaigns in a specific order
- Ask the system:
 >“What ads should play on this screen at this time?”
- Store proof-of-play, which means logging which ad was played and when.

---

## Technologies Used:

- Backend: Node.js with Express
- Database: PostgreSQL
- File Storage: Local filesystem
- Authentication: Not implemented
- Time handling: UTC time is used everywhere

---

## Database Tables:

- screen ->           stores information about screens
- ad ->               stores ads (image or video)
- campaign ->         stores campaign start and end times
- campaign_screen ->  links campaigns to screens
- campaign_ad ->      links ads to campaigns with play order
- proof_of_play ->    records what ad actually played on which screen and when

---

## How to Run the Backend

### 1.Clone the repository

```bash
git clone https://github.com/jesss007/dooh-ad-manager.git
cd dooh-ad-manager
```

---

### 2. Setup & Run

### Install dependencies
```bash
npm install
```

---

## Configure environment variables

Create a .env file in the project root:

```env
DB_HOST=localhost
DB_PORT=5433
DB_NAME=doohdb
DB_USER=postgres
DB_PASSWORD=your_password
```
---

## Start the Server
```bash
npm run dev
```
Server runs on :
http://localhost:4000

---

## Available APIs

### Screens
 
- GET `/api/screens` - List screens
- POST `/api/screens` - Create screen
- PUT `/api/screens/:id` - Update screen 

### ADs

- POST `/api/ads` - Upload ad
- DELETE `/api/ads/:id` - Delete ad

### Campaigns 

- POST `/api/campaigns` – Create campaign
- POST `/api/campaigns/:id/screens` – Assign screens to campaign
- POST `/api/campaigns/:id/ads` – Assign ads to campaign with play_order

### Playlist (device API)
- GET `/api/screens/:screen_id/playlist?at=<ISO_UTC_TIME>` – Get ordered playlist valid at that time

---

## Example Request & Response

### Get playlist for a screen at a specific time (UTC)

Request :

```bash 
GET /api/screens/<screen_id>/playlist?at=2026-01-05T10:30:00Z
```

Response :

```json
{
  "screen_id": "<screen_id>",
  "campaign_id": "<campaign_id>",
  "ads": [
    {
      "id": "<ad_id>",
      "title": "Ad 1",
      "media_url": "/uploads/ad.mp4",
      "duration_seconds": 10,
      "media_type": "video",
      "play_order": 1
    }
  ]
}
```
---

## Key Assumptions
- All timestamps sent to the API are in UTC (ISO format with `Z`).
- Screens fetch playlist using screen_id and a time (`at` query param).
- Proof-of-play is recorded in the database table `proof_of_play`.

---

## Known Limitations
- Campaign overlap validation on the same screen is not enforced (operator must avoid overlaps).
- No authentication/authorization (not required).
- UI is basic (focus is on backend functionality).

---

## Time Handling
- UTC is used everywhere.
- Campaign matching logic: `start_time <= at < end_time`
