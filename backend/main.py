from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services import github_service, openai_service, scoring
import uvicorn

app = FastAPI(title="RepoLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    username: str

@app.get("/")
def read_root():
    return {"message": "RepoLens API is live"}

@app.post("/analyze")
async def analyze_profile(request: AnalyzeRequest):
    username = request.username.strip().split('/')[-1] # Handle URL or username
    
    try:
        # 1. Fetch GitHub Data
        user_data = await github_service.get_user_profile(username)
        repos = await github_service.get_user_repos(username)
        events = await github_service.get_user_events(username)
        
        # 2. Fetch READMEs for top repos
        readmes = {}
        for repo in repos[:5]:
            readme = await github_service.get_repo_readme(repo['full_name'])
            readmes[repo['name']] = readme if readme else "No README"
            
        # 3. Get AI Qualitative Analysis
        ai_analysis = await openai_service.analyze_profile_qualitative(user_data, repos, readmes)
        
        # 4. Calculate Scores
        scores = scoring.get_final_scores(
            user_data, 
            repos, 
            events, 
            ai_analysis.get('recruiter_score', 50)
        )
        
        return {
            "user": {
                "login": user_data.get('login'),
                "name": user_data.get('name'),
                "avatar_url": user_data.get('avatar_url'),
                "bio": user_data.get('bio'),
                "location": user_data.get('location'),
            },
            "scores": scores,
            "analysis": ai_analysis
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
