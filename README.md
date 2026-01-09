# DOOH AD Manager - Backend 

This project is the backend (server side) of a Digital Out-of-Home (DOOH) advertising system.

This backend decides:

- Which ad plays
- On which screen
- At what time

It also keeps a record of what was actually played.

---

## What this project does :

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

### 1. Clone the repository

```bash
git clone git clone https://github.com/jesss007/dooh-ad-manager.git
cd dooh-ad-manager

