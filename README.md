# Nutrition AI Frontend

This is the Vite + React frontend for the Smartest AI Nutrition Assistant.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173)

## Features
- Chat UI for interacting with the AI Nutrition Assistant
- Connects to FastAPI backend (default: http://localhost:8000)
- PWA support (installable, offline-ready)

## PWA
- To test PWA features, build the app and serve it:
  ```
  npm run build
  npm run preview
  ```
- You can "install" the app from your browser for a native-like experience.

## Backend
- Make sure the FastAPI backend is running at http://localhost:8000
- You can change the backend URL in `src/api.js` if needed.

# Nutrition AI Backend

This is the backend API for the Smartest AI Nutrition Assistant MVP.

## Setup

1. Create and activate a virtual environment:
   ```
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On Mac/Linux
   ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Running the Server

Start the FastAPI server with Uvicorn:

```
uvicorn main:app --reload
```

The API will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000)

## Endpoints
- `POST /profile` — Create or update a user profile
- `POST /mealplan` — Generate a personalized meal plan
- `GET /` — Health check 



