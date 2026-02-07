import os
import re
import json
import requests

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from youtube_transcript_api import YouTubeTranscriptApi

load_dotenv()

app = Flask(__name__)
CORS(app)  # allow frontend to call /api/*

PERPLEXITY_URL = "https://api.perplexity.ai/chat/completions"
MODEL = "sonar"


def extract_video_id(url: str) -> str:
    """Extract YouTube video ID from various URL formats"""
    patterns = [
        r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
        r'(?:embed\/)([0-9A-Za-z_-]{11})',
        r'(?:watch\?v=)([0-9A-Za-z_-]{11})',
        r'(?:youtu\.be\/)([0-9A-Za-z_-]{11})'
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    raise ValueError("Invalid YouTube URL")


def fetch_transcript_text(video_id: str) -> str:
    """Fetch transcript using new youtube-transcript-api format"""
    ytt_api = YouTubeTranscriptApi()
    
    try:
        # Try English first
        fetched = ytt_api.fetch(video_id, languages=["en"])
    except:
        # Fallback to any available
        fetched = ytt_api.fetch(video_id)
    
    items = fetched.to_raw_data()
    text = " ".join([x.get("text", "") for x in items]).strip()
    return text


def call_perplexity(transcript_text: str) -> dict:
    """Call Perplexity API with robust error handling"""
    # Truncate to avoid token limits
    transcript_text = transcript_text[:80000]
    
    prompt = f"""Return ONLY valid JSON with this exact structure:

{{
  "summary": "3-sentence summary of main points",
  "propaganda_score": 4.5,
  "score_reasoning": "Brief explanation (0=factual, 10=manipulative)",
  "factual_errors": [{{"statement": "claim", "correction": "fact", "why_wrong": "reason"}}],
  "logical_errors": [{{"fallacy": "ad hominem", "quote": "text", "explanation": "brief"}}],
  "controversial_statements": [{{"statement": "text", "context": "balanced view"}}]
}}

Transcript: {transcript_text}"""
    
    headers = {
        "Authorization": f"Bearer {os.getenv('PERPLEXITY_API_KEY')}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "Return ONLY valid JSON. No markdown, no explanations, no extra text."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.05,
        "max_tokens": 2500,
    }

    try:
        r = requests.post(PERPLEXITY_URL, headers=headers, json=payload, timeout=90)
        
        # Check status code first
        if r.status_code != 200:
            return {
                "error": f"API error {r.status_code}: {r.text[:200]}",
                "propaganda_score": 0,
                "factual_errors": [],
                "logical_errors": []
            }
        
        # Safely parse response
        response_data = r.json()
        
        # Handle different response structures
        if isinstance(response_data, dict) and "choices" in response_data:
            if isinstance(response_data["choices"], list) and len(response_data["choices"]) > 0:
                content = response_data["choices"][0]["message"]["content"].strip()
            else:
                content = str(response_data)
        else:
            content = str(response_data)
        
        # Clean markdown wrappers
        for marker in ["```json", "```", "json"]:
            if content.startswith(marker):
                content = content.split(marker, 1)[1].split("```", 1).strip()
            if content.endswith(marker):
                content = content.rsplit(marker, 1).strip()
        
        # Parse JSON
        result = json.loads(content)
        
        # Ensure all fields exist
        result.setdefault("factual_errors", [])
        result.setdefault("logical_errors", [])
        result.setdefault("controversial_statements", [])
        result.setdefault("score_reasoning", "No reasoning provided")
        
        return result
        
    except json.JSONDecodeError:
        return {
            "summary": "Analysis complete (JSON parse failed)",
            "propaganda_score": 0,
            "factual_errors": [],
            "logical_errors": [],
            "controversial_statements": [],
            "raw_response": content[:1000] if 'content' in locals() else "No content"
        }
    except Exception as e:
        return {
            "error": f"Analysis failed: {str(e)}",
            "propaganda_score": 0,
            "factual_errors": [],
            "logical_errors": []
        }


@app.get("/api/health")
def health():
    """Health check endpoint"""
    return jsonify({"ok": True, "model": MODEL})


@app.post("/api/analyze")
def analyze():
    """Main analysis endpoint"""
    data = request.get_json(silent=True) or {}
    url = data.get("url")
    
    if not url:
        return jsonify({"error": "Missing 'url'"}), 400

    try:
        video_id = extract_video_id(url)
        transcript = fetch_transcript_text(video_id)
        
        if not transcript or len(transcript) < 50:
            return jsonify({"error": "No transcript available or too short"}), 400
        
        result = call_perplexity(transcript)
        return jsonify(result)
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

