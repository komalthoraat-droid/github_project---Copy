def extract_username(input_str: str) -> str:
    cleaned = input_str.strip().rstrip('/')
    if '/' in cleaned:
        return cleaned.split('/')[-1]
    return cleaned

test_cases = [
    ("https://github.com/komalthoraat", "komalthoraat"),
    ("https://github.com/komalthoraat/", "komalthoraat"),
    ("github.com/komalthoraat", "komalthoraat"),
    ("komalthoraat", "komalthoraat"),
    ("  komalthoraat  ", "komalthoraat"),
    ("https://github.com/komalthoraat/repo", "repo"), # Note: This logic assumes the last part is the user if it's a profile URL
]

for inp, expected in test_cases:
    actual = extract_username(inp)
    print(f"Input: {inp:40} | Expected: {expected:15} | Actual: {actual:15} | {'PASS' if actual == expected else 'FAIL'}")
