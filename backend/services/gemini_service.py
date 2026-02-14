import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def analyze_profile_qualitative(user_data: dict, repos_data: list, readmes: dict):
    # Construct a prompt that simulates a recruiter's perspective
    repo_summaries = []
    for repo in repos_data[:5]:
        name = repo['name']
        description = repo.get('description', 'No description')
        readme_snippet = readmes.get(name, "No README found")[:500] # Limit snippet size
        repo_summaries.append(f"Repo: {name}\nDesc: {description}\nREADME Snippet: {readme_snippet}\n")

    prompt = f"""
    You are a cynical but fair Senior Tech Recruiter at a top-tier tech firm.
    Analyze the following GitHub profile data for an early-career developer.

    User: {user_data.get('login')}
    Bio: {user_data.get('bio')}
    Public Repos: {user_data.get('public_repos')}
    Followers: {user_data.get('followers')}

    Top Projects:
    {"".join(repo_summaries)}

    Your task is to provide:
    1. A 'Verdict': Shortlist, Maybe, or Hard Pass.
    2. 'Personality Type': A 2-3 word clever name (e.g., 'The Weekend Warrior', 'The Template King', 'The Deep Diver').
    3. 'Key Strengths': 3 bullet points.
    4. 'Red Flags': Any obvious issues (missing descriptions, generic READMEs, inactivity).
    5. 'Recruiter Score': A score from 0-100 based on 'Hireability'.
    6. 'Actionable Roadmap': 5 specific, slightly bold tips to improve.

    Return the result in JSON format ONLY with keys: verdict, personality_type, strengths, red_flags, recruiter_score, roadmap.
    Make the tone professional but slightly bold and honest.
    """

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        return json.loads(response.text)
    except Exception as e:
        return {
            "verdict": "Maybe",
            "personality_type": "The Enigma",
            "strengths": ["Data fetching worked"],
            "red_flags": [f"AI Analysis failed: {str(e)}"],
            "recruiter_score": 50,
            "roadmap": ["Fix the API integration"]
        }
