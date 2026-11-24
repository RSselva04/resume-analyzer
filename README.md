# AI Resume Analyzer & Job Fit Optimizer (Job Seeker Edition)

A full-stack web application designed for job seekers to analyze and optimize their resumes against specific job descriptions (JDs). It calculates ATS readability, highlights skill gaps, grades job match compatibility, and rewrites weak bullet points with action verbs and quantifiable metrics.

---

## 🛠️ Technology Stack

* **Frontend:** React.js (Vite), Tailwind CSS, Lucide Icons, Axios
* **Backend:** Python 3, Django 5, Django REST Framework (DRF), django-cors-headers
* **Database:** PostgreSQL (with instant SQLite test fallback)
* **Document Parsing:** `pdfplumber`, `pypdf`, `python-docx`
* **AI Analysis:** Google Gemini API (`gemini-2.5-flash` with structured JSON schema)

---

## 📁 Project Directory Structure

```text
resume-analyzer/
│
├── backend/                              # Django + DRF Backend
│   ├── manage.py
│   ├── requirements.txt                  # Python dependencies
│   ├── .env                              # Environment configuration
│   ├── .env.example
│   ├── config/                           # Django settings, CORS, and root URLs
│   │   ├── settings.py
│   │   └── urls.py
│   └── analyzer/                         # Resume Analyzer app
│       ├── models.py                     # PostgreSQL ResumeAnalysis model
│       ├── serializers.py                # Upload & output serializers
│       ├── views.py                      # REST endpoints (/api/analyze/, /api/analyses/)
│       ├── urls.py
│       └── services/
│           ├── parser.py                 # Multi-format parser (PDF, DOCX, TXT)
│           └── ai_engine.py              # Gemini structured analysis & fallback engine
│
├── frontend/                             # React.js Client
│   ├── package.json
│   ├── vite.config.js                    # Dev server & API proxy
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx                       # Main responsive dashboard
│       ├── components/
│       │   ├── Header.jsx                # Navigation & scan history toggle
│       │   ├── ResumeUploader.jsx        # Drag-and-drop resume upload
│       │   ├── JobDescriptionInput.jsx   # JD input & sample loader
│       │   ├── ScoreCard.jsx             # Circular gauges for Match & ATS score
│       │   ├── SkillsBreakdown.jsx       # Matched vs Missing skills breakdown
│       │   ├── BulletRewriter.jsx        # Before & After bullet points with 1-click copy
│       │   ├── SectionFeedback.jsx       # Section-by-section ATS evaluation
│       │   └── HistoryDrawer.jsx         # Slide-over for past scans saved in PostgreSQL
│       └── services/api.js               # Axios API client
│
└── README.md
```

---

## 🚀 Step-by-Step Setup Instructions

### 1. Backend Setup (Django & PostgreSQL)

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. Install required dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Configure your `.env` file:
   Open `backend/.env`:
   * **PostgreSQL Configuration:**
     ```env
     USE_SQLITE=False
     DB_NAME=resume_analyzer_db
     DB_USER=postgres
     DB_PASSWORD=your_postgres_password
     DB_HOST=localhost
     DB_PORT=5432
     ```
     *(Note: If you haven't set up PostgreSQL yet and want to test immediately, keep `USE_SQLITE=True`)*
   * **Gemini API Key:**
     ```env
     GEMINI_API_KEY=your_actual_gemini_api_key
     ```
     *(If left blank, the app will automatically use the built-in heuristic fallback analyzer so you can test right away without crashing)*

5. Run database migrations:
   ```powershell
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Start the Django backend server:
   ```powershell
   python manage.py runserver
   ```
   Backend will be running at: `http://127.0.0.1:8000/`

---

### 2. Frontend Setup (React.js)

1. Open a second terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the Vite React development server:
   ```powershell
   npm run dev
   ```
   Frontend will be running at: `http://localhost:5173/`

---

## 🔍 Key Endpoints

* `POST /api/analyze/`: Accepts multipart form (`resume` file + `job_description` text). Parses document, runs AI evaluation, persists record to PostgreSQL, and returns analysis report.
* `GET /api/analyses/`: Retrieves recent scans for history drawer.
* `GET /api/analyses/<uuid:id>/`: Retrieves specific saved report.
* `DELETE /api/analyses/<uuid:id>/`: Deletes a saved report.
