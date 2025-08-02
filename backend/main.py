from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
import os
import openai
import requests
import jwt
import time
import hashlib
import requests

app = FastAPI()

# Dummy in-memory user profile and auth storage for MVP
user_profiles = {}
users = {}  # {email: {password_hash, user_id}}

# JWT config
JWT_SECRET = os.getenv('JWT_SECRET', 'devsecret')
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 3600

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def create_jwt(user_id, email):
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': int(time.time()) + JWT_EXP_DELTA_SECONDS
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expired')
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail='Invalid token')

def get_current_user(token: str = Depends(OAuth2PasswordBearer(tokenUrl="/auth/login"))):
    payload = verify_jwt(token)
    return payload

# Models
class UserProfile(BaseModel):
    user_id: str
    age: int
    gender: str
    health_goals: List[str]
    allergies: Optional[List[str]] = []
    preferences: Optional[List[str]] = []

class MealPlanRequest(BaseModel):
    user_id: str

class MealPlanResponse(BaseModel):
    meal_plan: str
    explanation: str

class SignupRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class GoogleAuthRequest(BaseModel):
    id_token: str

# Config (set your API keys as environment variables)
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
USDA_API_KEY = os.getenv('USDA_API_KEY')
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

# Helper: Fetch food data from USDA FoodData Central
def fetch_foods(query: str, max_results: int = 5):
    if not USDA_API_KEY:
        return []
    url = f"https://api.nal.usda.gov/fdc/v1/foods/search?api_key={USDA_API_KEY}&query={query}&pageSize={max_results}"
    resp = requests.get(url)
    if resp.status_code == 200:
        data = resp.json()
        return data.get('foods', [])
    return []

# Auth Endpoints
@app.post("/auth/signup", response_model=TokenResponse)
def signup(data: SignupRequest):
    if data.email in users:
        raise HTTPException(status_code=400, detail="Email already registered.")
    user_id = f"user_{len(users)+1}"
    users[data.email] = {"password_hash": hash_password(data.password), "user_id": user_id}
    token = create_jwt(user_id, data.email)
    return TokenResponse(access_token=token)

@app.post("/auth/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users.get(form_data.username)
    if not user or user["password_hash"] != hash_password(form_data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    token = create_jwt(user["user_id"], form_data.username)
    return TokenResponse(access_token=token)

@app.post("/auth/google", response_model=TokenResponse)
def google_auth(data: GoogleAuthRequest):
    # Verify Google ID token
    resp = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={data.id_token}")
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Google token.")
    info = resp.json()
    if info.get('aud') != GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=401, detail="Invalid Google client ID.")
    email = info['email']
    if email not in users:
        user_id = f"user_{len(users)+1}"
        users[email] = {"password_hash": None, "user_id": user_id}
    else:
        user_id = users[email]["user_id"]
    token = create_jwt(user_id, email)
    return TokenResponse(access_token=token)

# Endpoints
@app.post("/profile")
def create_or_update_profile(profile: UserProfile, user=Depends(get_current_user)):
    user_profiles[profile.user_id] = profile
    return {"message": "Profile saved."}

@app.post("/mealplan", response_model=MealPlanResponse)
def generate_meal_plan(request: MealPlanRequest, user=Depends(get_current_user)):
    profile = user_profiles.get(request.user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found.")
    # Fetch some healthy foods as an example
    foods = fetch_foods('healthy')
    food_list = ', '.join([food['description'] for food in foods]) if foods else 'various healthy foods'
    # Use OpenAI to generate a meal plan
    if not OPENAI_API_KEY:
        meal_plan = f"Sample meal plan using: {food_list}"
        explanation = "(OpenAI API key not set. This is a placeholder meal plan.)"
    else:
        openai.api_key = OPENAI_API_KEY
        prompt = f"Generate a personalized meal plan for a {profile.age}-year-old {profile.gender} with goals: {', '.join(profile.health_goals)}, allergies: {', '.join(profile.allergies)}, preferences: {', '.join(profile.preferences)}. Use foods like: {food_list}. Explain your choices."
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "You are a nutrition expert."}, {"role": "user", "content": prompt}],
            max_tokens=500
        )
        meal_plan = response.choices[0].message.content.strip()
        explanation = "This meal plan is generated by AI based on your profile."
    return MealPlanResponse(meal_plan=meal_plan, explanation=explanation)

@app.get("/")
def root():
    return {"message": "Nutrition AI backend is running."} 