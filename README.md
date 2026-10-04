# 🎓 AI Study Assistant

An intelligent, full-stack AI Study Companion built with **FastAPI**, **React (Vite)**, **Tailwind CSS**, **FAISS**, and **Google Gemini 2.5 Flash**. 

Upload any PDF (lecture notes, textbooks, research papers) and get instant **RAG-powered Q&A**, **5-MCQ Quizzes**, **3D Flip Flashcards**, and **Executive Summaries**.

![AI Study Assistant Preview](https://raw.githubusercontent.com/Siddhi-2005/ai-study-assistant/main/preview.png)

---

## ✨ Features

- 📄 **PDF Extraction & Vector Embedding**: Reads PDFs with `pdfplumber`, chunks text, and embeds vectors using Gemini Embedding API (`models/gemini-embedding-001`).
- ⚡ **In-Memory FAISS Vector Search**: Fast local similarity search returning verified source context.
- 💬 **Strict RAG Q&A Chat**: Answers questions strictly using the document's content with source chunk transparency.
- 🧠 **5-MCQ Knowledge Quiz**: AI-generated quiz with instant scoring & detailed answer explanations.
- 🃏 **Interactive 3D Flashcards**: Flip cards for studying key concepts and terminology.
- 📝 **Concise Summary**: 5–8 sentence high-level document takeaways with 1-click copy feature.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v3, Axios
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic
- **AI & Vector DB**: Google Generative AI SDK (`gemini-2.5-flash`), FAISS (`faiss-cpu`), `pdfplumber`

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Google Gemini API Key ([Get a key here](https://aistudio.google.com/))

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create .env file from .env.example
copy .env.example .env

# Paste your Gemini API key inside .env:
# GEMINI_API_KEY=your_actual_key_here

# Install dependencies
pip install -r requirements.txt

# Start FastAPI backend server
uvicorn main:app --reload --port 8000
```
Backend runs at: `http://127.0.0.1:8000`

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🎓 Interview 1-Minute Architecture Summary

1. **PDF Processing**: `pdfplumber` extracts raw text from uploaded PDF bytes.
2. **Chunking**: Text is split into ~500 word overlapping chunks (`split_into_chunks`).
3. **Embeddings & Indexing**: Each chunk is embedded via Gemini API and stored in a FAISS `IndexFlatL2` vector index.
4. **Vector Retrieval (RAG)**: User query is embedded, FAISS returns top $k=3$ relevant chunks.
5. **LLM Generation**: Prompt with context + query is passed to `gemini-2.5-flash` for factual answers.

---

## 🌐 Deploy to Free Cloud Platforms

### Backend (Render - Free)
1. Sign up on [Render.com](https://render.com/).
2. Click **New +** -> **Web Service** -> Connect GitHub repo `ai-study-assistant`.
3. Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variable: `GEMINI_API_KEY` = your API key.

### Frontend (Vercel - Free)
1. Sign up on [Vercel.com](https://vercel.com/).
2. Click **Add New** -> **Project** -> Import `ai-study-assistant`.
3. Framework Preset: **Vite**
4. Root Directory: `frontend`
5. Deploy!

---

## 📄 License
MIT License. Created for study & interview demonstrations.
