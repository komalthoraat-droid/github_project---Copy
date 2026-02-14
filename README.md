# RepoLens – See Your GitHub Through Recruiter Eyes

RepoLens is an AI-powered GitHub profile analyzer designed for students and early-career developers. It simulates a recruiter's evaluation process, providing a "Hireability" score, brutally honest feedback, and an actionable improvement roadmap.

## 🚀 Features

- **Portfolio Scoring**: 0–100 score based on 4 technical and professional dimensions.
- **Recruiter Verdict**: Shortlist / Maybe / Hard Pass based on AI logic.
- **Competency Map**: Visualization of skill balance (Tech Depth, Consistency, Impact, etc.).
- **Impact Detector**: Scans READMEs for "Production-ready" signals (API, Scaling, UX).
- **Personality Type**: Categorizes your coding style (e.g., "The Architect", "The Hacker").

## 🛠 Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: FastAPI, Pydantic, HTTPX.
- **AI**: Google Gemini 1.5 Flash (via Google Cloud API).

## 🏃 Quick Start

### 1. Prerequisite: API Keys
Create a `.env` file in the `backend/` directory:
```env
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_google_cloud_api_key
```

And create a `.env.local` file in the `frontend/` directory (optional if running on localhost:8000):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Manual Installation

#### Backend
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## 📊 Scoring Logic

The **GitHub Portfolio Score (GPS)** is calculated as:
`GPS = (TechDepth * 0.2) + (Consistency * 0.15) + (Impact * 0.2) + (Impression * 0.2) + (RecruiterScore * 0.25)`

- **Technical Depth**: Language diversity and project volume.
- **Consistency**: Recent commit frequency (last 30-90 days).
- **Impact**: Stars, Forks, and Signal keywords (Deployment, Production).
- **Impression**: Profile completeness and README quality.
- **Recruiter Score**: Qualitative AI evaluation based on hireability.
