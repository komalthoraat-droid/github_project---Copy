from typing import List, Dict

def calculate_technical_depth(repos: List[Dict]) -> int:
    if not repos:
        return 0
    
    score = 0
    languages = set()
    total_size = 0
    
    for repo in repos:
        if repo.get('language'):
            languages.add(repo['language'])
        total_size += repo.get('size', 0)
    
    # Language diversity (max 40 points)
    score += min(len(languages) * 10, 40)
    
    # Repo volume and size (max 40 points)
    score += min(len(repos) * 2, 40)
    
    # Bonus for significant size (max 20 points)
    if total_size > 10000: # >10MB
        score += 20
    elif total_size > 1000: # >1MB
        score += 10
        
    return min(score, 100)

def calculate_consistency(events: List[Dict]) -> int:
    if not events:
        return 0
    
    # Simply count recent events in the last 90 days (GitHub Events API limit)
    # A highly active user might have 300+ events in a month
    event_count = len(events)
    score = min(event_count * 2, 100)
    
    return score

def calculate_impact(repos: List[Dict]) -> int:
    if not repos:
        return 0
    
    stars = sum(repo.get('stargazers_count', 0) for repo in repos)
    forks = sum(repo.get('forks_count', 0) for repo in repos)
    
    score = 0
    # Star impact (max 40 points)
    score += min(stars * 4, 40)
    
    # Fork impact (max 20 points)
    score += min(forks * 8, 20)
    
    # Impact Signal Detector (Keyword analysis in descriptions/README excerpts)
    # Check for: API, deployment, production, scalability, security, CI/CD, database
    impact_keywords = ['api', 'deployment', 'production', 'scalable', 'ux', 'database', 'cloud', 'optimized']
    signal_score = 0
    for repo in repos[:10]:
        desc = (repo.get('description') or "").lower()
        if any(kw in desc for kw in impact_keywords):
            signal_score += 4
            
    score += min(signal_score, 40)
    
    return min(score, 100)

def calculate_first_impression(user_data: Dict, repos: List[Dict]) -> int:
    score = 0
    
    # Bio presence (20 points)
    if user_data.get('bio'):
        score += 20
        
    # Avatar and Name (20 points)
    if user_data.get('avatar_url') and user_data.get('name'):
        score += 20
        
    # Pinned repos or top repos have descriptions (30 points)
    with_desc = [r for r in repos[:5] if r.get('description')]
    score += (len(with_desc) / 5) * 30
    
    # Location/Company/Blog (30 points)
    if user_data.get('location'): score += 10
    if user_data.get('company'): score += 10
    if user_data.get('blog'): score += 10
    
    return int(min(score, 100))

def get_final_scores(user_data: Dict, repos: List[Dict], events: List[Dict], recruiter_score: int) -> Dict:
    tech_depth = calculate_technical_depth(repos)
    consistency = calculate_consistency(events)
    impact = calculate_impact(repos)
    first_impression = calculate_first_impression(user_data, repos)
    
    # GPS = (TechnicalDepth * 0.25) + (Consistency * 0.20) + (Impact * 0.25) + (FirstImpression * 0.30)
    # Actually, let's incorporate AI Recruiter Score too for the aggregate
    
    aggregate = (tech_depth * 0.2 + consistency * 0.15 + impact * 0.2 + first_impression * 0.2 + recruiter_score * 0.25)
    
    return {
        "portfolio_score": int(aggregate),
        "technical_depth": tech_depth,
        "consistency": consistency,
        "impact": impact,
        "first_impression": first_impression,
        "recruiter_score": recruiter_score
    }
