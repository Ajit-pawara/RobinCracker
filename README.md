# 🚀 RobinCracker — Password Hash Analysis Toolkit

> *"Crack the hash. Not just the password."*

**RobinCracker** is a professional open-source web application for password security analysis, hash identification, and cracking workflow automation. Built for penetration testers, security researchers, and CTF players.

[![Live Demo](https://img.shields.io/badge/LIVE-Demo-00C853?style=for-the-badge&logo=vercel)](https://robin-cracker.vercel.app)
[![API Docs](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://robincracker-api.onrender.com/docs)

---

![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.140-009688?logo=fastapi)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

---

## ✨ Features

| # | Module | Description |
|---|--------|-------------|
| 1 | **🔍 Hash Identifier** | Auto-detect hash type (MD5, SHA1, bcrypt, Argon2, etc.) |
| 2 | **📊 Hash Analyzer** | Deep entropy analysis, charset detection, risk scoring |
| 3 | **🛡️ Password Strength** | Entropy calculation, crack-time estimates, suggestions |
| 4 | **⚡ Benchmark** | Algorithm speed comparison (MD5 → Argon2) |
| 5 | **📖 Dictionary Manager** | Upload, preview, deduplicate wordlists |
| 6 | **🧩 Rule Generator** | Visual hashcat rule builder with previews |
| 7 | **🔨 Hashcat Builder** | GUI wizard for hashcat command construction |
| 8 | **⚒️ John Builder** | GUI wizard for John the Ripper commands |
| 9 | **🔑 Password Generator** | Customizable secure password generation |
| 10 | **🔄 Hash Converter** | Convert between hex, base64, binary, ASCII |
| 11 | **🎓 Learning Center** | Tutorials — Day 20 Password Security |
| 12 | **💻 Terminal** | Web-based terminal for hashcat/john |
| 13 | **📜 History** | Full audit trail of all operations |
| 14 | **📤 Export** | PDF/CSV export for reports |
| 15 | **📈 Dashboard** | Activity overview, stats, quick actions |
| 16 | **⚙️ Settings** | Theme, API config, preferences |

## 🧠 Day 20: Password Security & Hashing Attacks

Built-in teaching module covering:
- **Hash Functions** — MD5, SHA-1, SHA-256, bcrypt, Argon2
- **Identification** — Hashid techniques, format recognition
- **Cracking** — Hashcat + John the Ripper workflows
- **Password Strength** — Entropy math, crack-time estimation
- **Real Attacks** — Bangladesh Bank SWIFT heist (2016), LinkedIn 2012 breach
- **Defense** — Salt, pepper, key stretching, memory-hard functions

## 🏗️ Architecture

```
┌────────────────────────┐      ┌────────────────────────┐
│    Next.js 14          │      │    FastAPI (Python)     │
│    (Frontend)          │◄────►│    (Backend API)        │
│    Port 3000           │      │    Port 8000            │
│                        │      │                         │
│  ┌──────────────────┐  │      │  ┌───────────────────┐  │
│  │ 17 Route Pages   │  │      │  │ 13 API Endpoints  │  │
│  │ + Components     │  │      │  │ + SQLite DB       │  │
│  │ + Animations     │  │      │  │ + File Uploads    │  │
│  └──────────────────┘  │      │  └───────────────────┘  │
└────────────────────────┘      └────────────────────────┘
```

### Tech Stack

**Frontend:**
- Next.js 14 (App Router) + React 18
- TypeScript 5 + TailwindCSS 3.4
- Framer Motion (animations)
- Recharts (charts)
- Radix UI (accessible components)
- Shadcn UI (design system)

**Backend:**
- FastAPI (Python 3.12)
- SQLite (lightweight storage)
- bcrypt / hashlib (crypto)
- Uvicorn (ASGI server)

**Deployment:**
- Docker + Docker Compose
- GitHub Actions (CI/CD)

## 🚀 Quick Start

### Docker (Recommended)

```bash
docker compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000/docs
```

### Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

## 🗂️ Project Structure

```
Robincracker/
├── frontend/                # Next.js 14 application
│   ├── app/                 # App Router pages (17 routes)
│   │   ├── page.tsx         # Landing page
│   │   ├── dashboard/
│   │   ├── hash-identifier/
│   │   ├── hash-analyzer/
│   │   ├── password-strength/
│   │   ├── benchmark/
│   │   ├── dictionary/
│   │   ├── rule-generator/
│   │   ├── hashcat-builder/
│   │   ├── john-builder/
│   │   ├── password-generator/
│   │   ├── hash-converter/
│   │   ├── learning/
│   │   ├── terminal/
│   │   ├── history/
│   │   ├── export/
│   │   └── settings/
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities + API client
│   └── public/              # Static assets
├── backend/
│   ├── main.py              # FastAPI application (435 lines)
│   ├── data/                # SQLite database
│   ├── uploads/             # Uploaded wordlists
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 📚 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/identify` | POST | Hash type identification |
| `/api/analyze` | POST | Deep hash analysis |
| `/api/password-strength` | POST | Entropy + crack-time |
| `/api/generate-password` | POST | Secure password gen |
| `/api/convert-hash` | POST | Format conversion |
| `/api/benchmark` | GET | Algorithm speed comparison |
| `/api/hashcat-command` | POST | Hashcat wizard |
| `/api/john-command` | POST | John wizard |
| `/api/generate-rules` | POST | Rule generation |
| `/api/upload-dictionary` | POST | Wordlist upload |
| `/api/uploads` | GET | List uploads |
| `/api/history` | GET | Operation history |

## 🛡️ License

MIT — Free for pentesting, education, and commercial use.

---

*Built with ❤️ for the security community. Day 20: Password Security & Hashing Attacks.*
