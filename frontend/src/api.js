const API_BASE = 'http://localhost:8000'; // Adjust if backend runs elsewhere

export async function saveUserProfile(profile) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('Failed to save profile');
  return res.json();
}

export async function getMealPlan(user_id) {
  const res = await fetch(`${API_BASE}/mealplan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id }),
  });
  if (!res.ok) throw new Error('Failed to get meal plan');
  return res.json();
} 