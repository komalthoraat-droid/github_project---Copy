import os
import httpx
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
BASE_URL = "https://api.github.com"

async def get_user_profile(username: str) -> Dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/users/{username}", headers=HEADERS)
        response.raise_for_status()
        return response.json()

async def get_user_repos(username: str) -> List[Dict]:
    async with httpx.AsyncClient() as client:
        # Fetching top 30 repos to get a buena overview
        response = await client.get(
            f"{BASE_URL}/users/{username}/repos?sort=updated&per_page=30", 
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()

async def get_repo_readme(full_name: str) -> Optional[str]:
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{BASE_URL}/repos/{full_name}/readme", headers=HEADERS)
            if response.status_code == 200:
                content_url = response.json().get("download_url")
                readme_res = await client.get(content_url)
                return readme_res.text
        except Exception:
            return None
    return None

async def get_user_events(username: str) -> List[Dict]:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/users/{username}/events", headers=HEADERS)
        response.raise_for_status()
        return response.json()
