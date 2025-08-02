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