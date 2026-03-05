# 📺 YouTube Fact Checker & Propaganda Analyzer

A full-stack experimental application that analyzes YouTube videos by extracting transcripts and applying AI-assisted analysis to highlight patterns in how information is presented.

The system evaluates signals related to:

• factual claims
• propaganda or persuasive rhetoric
• logical fallacies in reasoning
• controversial or strongly asserted statements

The goal is not to label videos as “true” or “false”, but to help users **think more critically about online information instead of accepting it blindly**.

---

# 🚀 Features

🔗 Accepts any valid YouTube video URL
📝 Automatically extracts video transcripts
🤖 AI-assisted content analysis
📊 Returns structured JSON analysis including:

• video summary
• propaganda score (0–10)
• potential factual inconsistencies
• detected logical fallacies
• controversial statements

🌐 Simple interactive frontend for user interaction
⚙️ Python Flask backend API

---

# 🧠 How It Works

1️⃣ A user submits a YouTube video URL.

2️⃣ The backend extracts the video ID from the URL.

3️⃣ The transcript is retrieved using the **YouTube Transcript API**.

4️⃣ The transcript is passed through an AI-assisted analysis pipeline designed to evaluate reasoning patterns and extract key signals.

5️⃣ The system generates structured output including summaries, reasoning observations, and propaganda indicators.

6️⃣ Results are returned to the frontend and displayed to the user.

The outputs are meant to **support critical thinking**, not provide definitive judgments.

---

# 🏗 System Architecture

Frontend
A lightweight interface built using **Vite**. The initial UI structure was generated with AI assistance and then refined to improve usability and interaction.

Backend
A **Flask-based Python server** that handles requests, transcript retrieval, and communication with analysis APIs.

Analysis Pipeline
The overall analysis pipeline was designed as part of the project to process transcripts and generate structured reasoning indicators.

External APIs
• YouTube Transcript API for transcript extraction
• Language model APIs for transcript analysis

---

# 🛠 Technologies Used

Python
Flask backend
YouTube Transcript API
Language model APIs for analysis
Vite frontend (AI-assisted development)
REST-based communication between frontend and backend

---

# 📚 What I Learned

Through building this project I explored:

• transcript-based content analysis
• integrating multiple APIs into a single system
• designing AI-assisted processing pipelines
• full-stack communication between frontend and backend
• the limitations of automated reasoning analysis
• how AI tools can assist development while still requiring human oversight

The project was built as a **learning-driven experiment** to explore how computational tools might help people evaluate online information more thoughtfully.

---

# ⚠️ Limitations

The system does not verify facts or determine objective truth.

The analysis is based on linguistic patterns and model outputs, which means results may sometimes be incomplete or imperfect.

This project is an **experimental prototype intended for learning and exploration**, not a definitive fact-checking tool.

---

# 🔧 Future Improvements

🚀 Deploy the system for public experimentation
The current version is not deployed because I am still experimenting with the analysis pipeline and improving API integrations. I plan to deploy the project once the system becomes more stable.

🤖 Migration to updated AI APIs
The earlier prototype used APIs that are no longer available, and I am working on adapting the system to newer models.

📊 Improved visualization of analysis results
Better presentation of summaries and reasoning signals.

🧠 Improved claim extraction and reasoning analysis
Experiment with more reliable ways to detect factual claims and logical fallacies.



<img width="1131" height="729" alt="Screenshot 2026-02-07 at 11-48-30 TruthScanner" src="https://github.com/user-attachments/assets/8c062907-b9a7-45d3-910e-8c3204e2e8e6" />
<img width="1135" height="876" alt="Screenshot 2026-02-07 at 11-48-58 TruthScanner" src="https://github.com/user-attachments/assets/b177e66a-628b-40b8-b43e-29c0869b781c" />
