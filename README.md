📺 YouTube Fact Checker & Propaganda Analyzer


A full-stack application that analyzes YouTube videos by extracting transcripts and using AI to evaluate:

factual accuracy

propaganda/manipulation signals

logical fallacies

controversial claims

The goal is to help users critically evaluate video content instead of blindly trusting it.


🚀 Features

🔗 Accepts any valid YouTube video URL

📝 Automatically extracts video transcripts

🤖 Uses AI to analyze content


📊 Returns structured JSON analysis including:

Summary

Propaganda score (0–10)

Factual errors

Logical fallacies

Controversial statements

🌐 Simple frontend for user interaction

⚙️ Flask backend API


🧠 How It Works

User submits a YouTube video URL

Backend extracts the video ID

Transcript is fetched using YouTube Transcript API

Transcript is sent to an AI model for analysis

Structured results are returned to the frontend
